import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store conversation history
const conversationHistory = new Map();

// AI Chatbot Controller
const chatbotController = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Get conversation history
    let history = conversationHistory.get(userId) || [];

    // Initialize Gemini model - using the correct model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      }
    });

    // System context
    const systemContext = `You are an AI assistant for TOMATO Food Delivery. You help customers with:
1. Menu browsing and food recommendations
2. Order placement and tracking
3. Payment information
4. Delivery time estimates
5. Common questions about our service

Our menu includes: Salads, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles.
Delivery time: 30-45 minutes
Payment methods: Credit/Debit Cards, Online Payment
Free delivery on orders above $30

Be friendly, helpful, and concise.`;

    // Build conversation for Gemini
    let fullPrompt;
    if (history.length === 0) {
      // First message - include system context
      fullPrompt = `${systemContext}\n\nUser: ${message}\n\nAssistant:`;
    } else {
      // Subsequent messages - build from history
      fullPrompt = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
      fullPrompt += `\nUser: ${message}\nAssistant:`;
    }

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const aiResponse = response.text();

    // Update conversation history
    history.push({ role: "user", content: message });
    history.push({ role: "assistant", content: aiResponse });

    // Keep only last 10 messages
    if (history.length > 10) {
      history = history.slice(-10);
    }
    conversationHistory.set(userId, history);

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Sorry, I'm having trouble right now. Please try again.",
      error: error.message 
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
