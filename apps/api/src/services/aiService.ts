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

export const suggestBOQRate = async (
  description: string,
  category: string,
  location?: string,
  referencePrices: ReferencePrice[] = []
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

  const prompt = `
    Act as a construction cost estimator.
    ${locationLine}
    ${referenceLine}
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
