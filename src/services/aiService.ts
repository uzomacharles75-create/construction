import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const suggestBOQRate = async (description: string, category: string) => {
  const prompt = `
    Act as a construction cost estimator in Africa. 
    Analyze this item: "${description}" in category "${category}".
    Provide a suggested market rate, unit of measure, and a brief justification.
    Return JSON format: { "rate": number, "unit": string, "justification": string }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
};