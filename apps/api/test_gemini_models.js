require('dotenv').config({ path: '/home/rehack/Desktop/construction/apps/api/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  // Try to use the generic fetch to call the models list API
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("No API key found in .env");
    return;
  }
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await response.json();
  if (data.models) {
    console.log("Available models:");
    data.models.forEach(m => console.log(m.name, "-", m.supportedGenerationMethods));
  } else {
    console.log("Response:", data);
  }
}
run();
