import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCIdK-FkEIsgVc4foeyn_-6Mjbny8FUmTE");

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello!");
    const response = await result.response;
    console.log("AI Response:", response.text());
  } catch (error) {
    console.error("AI Error:", error);
  }
}

test();
