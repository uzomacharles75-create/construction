import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sanitizePrompt } from "../utils/promptGuard";

export const askAssistant = async (req: any, res: Response) => {
  try {
    const { history, context } = req.body;
    const { role, name } = req.user;

    // Guard the user message before it reaches the model
    const message = sanitizePrompt(req.body.message, 4000);
    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: "Missing GEMINI_API_KEY in .env",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // SYSTEM PROMPT
    const systemPrompt = `
You are BuildHub AI, a construction ERP expert for Africa.

User: ${name}
Role: ${role}
Context: ${
      context === "engineering-technical"
        ? "Engineering/Site"
        : "Business"
    }

Rules:
- Be professional
- Use metric units
- Give concise technical answers
- Refer to Marketplace for prices
`;

    // MODEL
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // HISTORY FORMAT
    const safeHistory = Array.isArray(history) ? history : [];

    const formattedHistory = safeHistory.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: sanitizePrompt(m.content, 4000) }],
    }));

    // START CHAT
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood." }],
        },
        ...formattedHistory,
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    console.log(`🤖 Gemini processing for: ${name}`);

    // SEND MESSAGE
    const result = await chat.sendMessage(message);

    const response = await result.response;

    const text = response.text();

    return res.status(200).json({
      response: text,
    });
  } catch (error: any) {
    console.error("❌ GEMINI ERROR:", error);

    return res.status(500).json({
      message: "BuildHub AI is currently unavailable.",
      error: error.message,
    });
  }
};