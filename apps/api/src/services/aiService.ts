import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface BOQRateSuggestion {
  rate: number;
  unit: string;
  justification: string;
  confidence: "high" | "medium" | "low";
}

/**
 * Suggest a market rate for a construction BOQ item using Gemini.
 * Returns rate, unit, a short justification, and a confidence level.
 */
export interface ReferencePrice {
  name: string;
  price: number;
  unit: string;
  supplier?: string;
}

export interface PastCorrection {
  description: string;
  aiSuggestedRate: number;
  finalRate: number;
  location?: string;
}

export const suggestBOQRate = async (
  description: string,
  category: string,
  location?: string,
  referencePrices: ReferencePrice[] = [],
  pastCorrections: PastCorrection[] = []
): Promise<BOQRateSuggestion> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env");
  }

  const locationLine = location
    ? `Estimate the rate for this specific location: "${location}". Account for local
       market conditions, transport, and import costs in that region.`
    : `Estimate a general market rate for Africa.`;

  const referenceLine = referencePrices.length
    ? `Use these real marketplace prices (in USD) as your primary anchor; only
       deviate if the item clearly differs:\n` +
      referencePrices
        .map((p) => `- ${p.name}: ${p.price} per ${p.unit}${p.supplier ? ` (${p.supplier})` : ''}`)
        .join('\n')
    : '';

  // Learning loop: the user's own past corrections steer future estimates
  const correctionLine = pastCorrections.length
    ? `This user previously corrected your estimates for similar items — weight these heavily:\n` +
      pastCorrections
        .map((c) => `- "${c.description}"${c.location ? ` (${c.location})` : ''}: you suggested ${c.aiSuggestedRate}, they used ${c.finalRate}`)
        .join('\n')
    : '';

  const prompt = `
    Act as a construction cost estimator.
    ${locationLine}
    ${referenceLine}
    ${correctionLine}
    Analyze this item: "${description}" in category "${category}".
    Provide a suggested market rate (number, no currency symbol), the unit of
    measure, a brief one-sentence justification (mention the location if given),
    and your confidence in the estimate.
    When marketplace reference prices are given, set confidence to "high".

    Set "confidence" to:
      - "high" if this is a common, standardised item with stable pricing
      - "medium" if pricing varies by supplier or region
      - "low" if the item is vague, specialised, or hard to price without specs

    Return ONLY JSON in this exact shape:
    { "rate": number, "unit": string, "justification": string, "confidence": "high" | "medium" | "low" }
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const result = await model.generateContent(prompt);
  const parsed = JSON.parse(result.response.text() || "{}");

  // Normalise / guard the response
  const confidence = ["high", "medium", "low"].includes(parsed.confidence)
    ? parsed.confidence
    : "low";

  return {
    rate: Number(parsed.rate) || 0,
    unit: parsed.unit || "unit",
    justification: parsed.justification || "No justification provided.",
    confidence,
  };
};

/* ------------------------------------------------------------------ */
/* WHOLE-BOQ ANALYSIS: missing items / duplicates / alternatives /    */
/* price outliers                                                     */
/* ------------------------------------------------------------------ */

export interface BOQItemInput {
  description: string;
  unit: string;
  qty: number;
  rate: number;
}

export type SuggestionType = "missing" | "duplicate" | "alternative" | "outlier";

export interface BOQSuggestion {
  type: SuggestionType;
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  relatedItems?: string[]; // descriptions of existing items this refers to
  item?: BOQItemInput;     // an addable item (for missing / alternative)
}

const VALID_TYPES: SuggestionType[] = ["missing", "duplicate", "alternative", "outlier"];

/**
 * Review an entire BOQ and surface missing complementary items, duplicates,
 * cheaper marketplace alternatives, and price outliers.
 */
export const analyzeBOQ = async (
  items: BOQItemInput[],
  location?: string,
  referencePrices: ReferencePrice[] = []
): Promise<BOQSuggestion[]> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env");
  }
  if (!items.length) return [];

  const itemList = items
    .map((it, i) => `${i + 1}. ${it.description} — ${it.qty} ${it.unit} @ ${it.rate}`)
    .join("\n");

  const referenceLine = referencePrices.length
    ? `Marketplace catalogue (prices in USD), use for alternatives and outlier checks:\n` +
      referencePrices
        .map((p) => `- ${p.name}: ${p.price} per ${p.unit}${p.supplier ? ` (${p.supplier})` : ""}`)
        .join("\n")
    : "";

  const prompt = `
    Act as a quantity surveyor reviewing a Bill of Quantities${location ? ` for a project in ${location}` : ""}.

    BOQ items (number. description — qty unit @ rate):
    ${itemList}

    ${referenceLine}

    Review the BOQ and return concrete, high-value suggestions only. Look for:
    - "missing": complementary items clearly required but absent (e.g. concrete without rebar/aggregate).
    - "duplicate": items that appear to be the same thing entered more than once.
    - "alternative": a cheaper marketplace product that could substitute an item.
    - "outlier": a rate that is far from the marketplace/regional norm.

    For "missing" and "alternative", include an "item" object the user can add directly.
    Reference existing items by their description in "relatedItems" where relevant.
    Be conservative — do not invent problems. Return at most 8 suggestions.

    Return ONLY JSON in this exact shape:
    {
      "suggestions": [
        {
          "type": "missing" | "duplicate" | "alternative" | "outlier",
          "severity": "high" | "medium" | "low",
          "title": string,
          "detail": string,
          "relatedItems": string[],
          "item": { "description": string, "unit": string, "qty": number, "rate": number }
        }
      ]
    }
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const result = await model.generateContent(prompt);
  const parsed = JSON.parse(result.response.text() || "{}");
  const raw = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];

  // Validate / normalise each suggestion
  return raw
    .filter((s: any) => VALID_TYPES.includes(s?.type))
    .slice(0, 8)
    .map((s: any) => ({
      type: s.type,
      severity: ["high", "medium", "low"].includes(s.severity) ? s.severity : "medium",
      title: String(s.title || "Suggestion"),
      detail: String(s.detail || ""),
      relatedItems: Array.isArray(s.relatedItems) ? s.relatedItems.map(String).slice(0, 5) : [],
      item:
        s.item && s.item.description
          ? {
              description: String(s.item.description),
              unit: String(s.item.unit || "unit"),
              qty: Number(s.item.qty) || 1,
              rate: Number(s.item.rate) || 0,
            }
          : undefined,
    }));
};
