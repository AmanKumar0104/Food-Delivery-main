import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function debug() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Key Length:", key ? key.length : 0);
  console.log("Key (first 5):", key ? key.substring(0, 5) : "none");

  const genAI = new GoogleGenerativeAI(key);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Model initialized");
    const result = await model.generateContent("Test");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("DEBUG ERROR:", error);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
  }
}

debug();
