import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCIdK-FkEIsgVc4foeyn_-6Mjbny8FUmTE");

async function list() {
  try {
    // List models is not directly available on genAI in some versions, 
    // it's usually on the library or requiring specific setup.
    // However, let's try the most common models.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("Hi");
        console.log(`Model ${m} works!`);
        return;
      } catch (e) {
        console.log(`Model ${m} failed: ${e.message}`);
      }
    }
  } catch (error) {
    console.error("List Error:", error);
  }
}

list();
