import { GoogleGenerativeAI } from "@google/generative-ai";
import foodModel from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ───────────────────────────────────────────
// 1. AI Chatbot — food-ordering assistant
// ───────────────────────────────────────────
const chatWithAI = async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;
    if (!message) {
      return res.json({ success: false, message: "Message is required" });
    }

    // Fetch the current menu so the AI knows what's available
    const foods = await foodModel.find({});
    const menuSummary = foods
      .map((f) => `• ${f.name} ($${f.price}) — ${f.category}: ${f.description}`)
      .join("\n");

    const systemPrompt = `You are "Tomato AI", a friendly and knowledgeable food-ordering assistant for the TOMATO food delivery app.

CURRENT MENU:
${menuSummary}

RULES:
- Help users pick dishes, answer dietary questions, suggest combos.
- Keep answers concise (2-4 sentences max).
- Be enthusiastic about food! Use occasional emojis 🍕🌮🍜
- If user asks about something not on the menu, say it's not available but suggest alternatives.
- Never discuss topics unrelated to food or this restaurant.
- Format prices with $ sign.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build conversation history for multi-turn
    const contents = [];
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });
    contents.push({
      role: "model",
      parts: [
        {
          text: "Got it! I'm Tomato AI 🍅, ready to help you find the perfect meal! How can I help you today?",
        },
      ],
    });

    // Append previous turns
    for (const turn of chatHistory) {
      contents.push({
        role: turn.role === "user" ? "user" : "model",
        parts: [{ text: turn.text }],
      });
    }

    // Append the current user message
    contents.push({ role: "user", parts: [{ text: message }] });

    const result = await model.generateContent({ contents });
    const response = result.response.text();

    res.json({ success: true, reply: response });
  } catch (error) {
    console.log("AI Chat Error:", error);
    res.json({ success: false, message: "AI service temporarily unavailable" });
  }
};

// ───────────────────────────────────────────
// 2. Smart AI Search
// ───────────────────────────────────────────
const smartSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.json({ success: false, message: "Search query is required" });
    }

    const foods = await foodModel.find({});
    const menuJSON = JSON.stringify(
      foods.map((f) => ({
        id: f._id,
        name: f.name,
        description: f.description,
        price: f.price,
        category: f.category,
      }))
    );

    const prompt = `You are a food search engine. Given the user query and a menu, return a JSON array of matching items.

USER QUERY: "${query}"

MENU:
${menuJSON}

Return ONLY a valid JSON array of objects with these fields (no markdown, no backticks):
[{"id": "...", "name": "...", "reason": "<short 5-8 word reason why it matches>"}]

Rules:
- Return the most relevant items first (max 8).
- If nothing matches, return an empty array [].
- The "reason" should explain why this dish matches the search (e.g., "Spicy kick with bold flavors").
- Consider flavor profiles, ingredients, dietary preferences, and price when matching.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Clean potential markdown wrapping
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let matches = [];
    try {
      matches = JSON.parse(text);
    } catch {
      matches = [];
    }

    // Enrich matches with full food data
    const enrichedResults = matches
      .map((match) => {
        const food = foods.find((f) => f._id.toString() === match.id);
        if (!food) return null;
        return {
          _id: food._id,
          name: food.name,
          description: food.description,
          price: food.price,
          category: food.category,
          image: food.image,
          aiReason: match.reason,
        };
      })
      .filter(Boolean);

    res.json({ success: true, data: enrichedResults });
  } catch (error) {
    console.log("AI Search Error:", error);
    res.json({ success: false, message: "AI search temporarily unavailable" });
  }
};

// ───────────────────────────────────────────
// 3. Personalized Recommendations
// ───────────────────────────────────────────
const getRecommendations = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Get past orders for this user
    const orders = await orderModel.find({ userId, payment: true });
    if (!orders.length) {
      return res.json({ success: true, data: [], message: "No order history" });
    }

    // Collect previously ordered item names
    const orderedItems = [];
    for (const order of orders) {
      for (const item of order.items) {
        orderedItems.push(item.name);
      }
    }

    const foods = await foodModel.find({});
    const menuJSON = JSON.stringify(
      foods.map((f) => ({
        id: f._id,
        name: f.name,
        description: f.description,
        price: f.price,
        category: f.category,
      }))
    );

    const prompt = `You are a food recommendation engine. Based on this user's order history, suggest items they would love but haven't tried yet.

ORDER HISTORY (items previously ordered):
${JSON.stringify([...new Set(orderedItems)])}

FULL MENU:
${menuJSON}

Return ONLY a valid JSON array (no markdown, no backticks). Max 6 items:
[{"id": "...", "name": "...", "reason": "<personalized reason, 8-12 words, e.g. Because you love spicy curries>"}]

Rules:
- Prefer items the user has NOT ordered before.
- Base reasoning on taste patterns from their history.
- Consider variety — suggest from different categories.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let recommendations = [];
    try {
      recommendations = JSON.parse(text);
    } catch {
      recommendations = [];
    }

    // Enrich with full food data
    const enrichedResults = recommendations
      .map((rec) => {
        const food = foods.find((f) => f._id.toString() === rec.id);
        if (!food) return null;
        return {
          _id: food._id,
          name: food.name,
          description: food.description,
          price: food.price,
          category: food.category,
          image: food.image,
          aiReason: rec.reason,
        };
      })
      .filter(Boolean);

    res.json({ success: true, data: enrichedResults });
  } catch (error) {
    console.log("AI Recommend Error:", error);
    res.json({
      success: false,
      message: "Recommendations temporarily unavailable",
    });
  }
};

export { chatWithAI, smartSearch, getRecommendations };
