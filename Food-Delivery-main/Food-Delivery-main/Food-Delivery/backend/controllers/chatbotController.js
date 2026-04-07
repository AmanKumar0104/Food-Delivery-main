import { GoogleGenerativeAI } from "@google/generative-ai";

// Store conversation history
const conversationHistory = new Map();

// AI Chatbot Controller
const chatbotController = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const { message, userId = "anonymous", chatHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Try multiple models in case of 404 or unavailability
    const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-pro"];
    let aiResponse = "";
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ 
                model: modelName,
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                }
            });

            // System context with more detail
            const systemContext = `You are "Tomato AI", the friendly and helpful virtual assistant for Tomato Food Delivery. 
Your goal is to provide excellent customer service and help users find delicious Indian food.

Tone: Professional, friendly, and slightly enthusiastic about food. Use food emojis! 🍅🍛🍕

Knowledge Base:
- Our menu categories: Starters (Samosa, Paneer Tikka), Main Course (Butter Chicken, Dal Makhani), Biryani & Rice, Bread (Naan, Roti), South Indian (Dosa, Idli), Desserts (Gulab Jamun), Beverages, and Street Food.
- Popular Items: Butter Chicken (₹380), Paneer Butter Masala (₹280), Chicken Dum Biryani (₹320), Masala Dosa (₹120).
- Delivery: 30-45 minutes. Free on orders above ₹500.
- Payment: Cards, Wallets, Cash on Delivery.

Interaction Rules:
1. Suggest specific dishes from the categories.
2. Keep it concise (2-3 sentences).
3. If they ask about order status, guide them to "My Orders".
4. Priority: Indian Food.

Current User Input: "${message}"`;

            const formattedHistory = chatHistory.map(item => ({
                role: item.role === "user" ? "user" : "model",
                parts: [{ text: item.text || item.content }]
            }));

            const chat = model.startChat({
                history: formattedHistory,
                systemInstruction: systemContext,
            });

            const result = await chat.sendMessage(message);
            aiResponse = result.response.text();
            
            if (aiResponse) break; // Success!
        } catch (error) {
            console.warn(`Model ${modelName} failed:`, error.message);
            lastError = error;
            // Continue to next model
        }
    }

    if (!aiResponse) {
        throw lastError || new Error("Failed to generate response from all models");
    }

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    
    // Fallback response for specific errors
    let userFriendlyMessage = "My apologies! 🍅 Tomato AI is feeling a bit under the weather. Please try again in a moment.";
    
    if (error.message && error.message.includes("API_KEY_INVALID")) {
      userFriendlyMessage = "I'm having trouble connecting to my brain (API Key issue). Please contact support.";
    }

    res.status(500).json({ 
      success: false, 
      message: userFriendlyMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Clear conversation history
const clearChatHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    conversationHistory.delete(userId);
    res.json({ success: true, message: "Chat history cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get predefined quick responses
const getQuickResponses = async (req, res) => {
  const quickResponses = [
    { id: 1, text: "What's on the menu today?", icon: "🍕" },
    { id: 2, text: "Track my order", icon: "📦" },
    { id: 3, text: "Delivery time?", icon: "⏰" },
    { id: 4, text: "Payment options?", icon: "💳" },
    { id: 5, text: "Recommend something healthy", icon: "🥗" },
  ];

  res.json({ success: true, quickResponses });
};

export { chatbotController, clearChatHistory, getQuickResponses };
