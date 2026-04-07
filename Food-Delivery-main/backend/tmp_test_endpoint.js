async function testChat() {
  try {
    const response = await fetch('http://localhost:4000/api/chatbot/chat', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Hello, recommend me some Indian food",
        userId: "test-user"
      })
    });
    const data = await response.json();
    console.log("Chat Response:", data);
  } catch (error) {
    console.error("Chat Error:", error.message);
  }
}

testChat();
