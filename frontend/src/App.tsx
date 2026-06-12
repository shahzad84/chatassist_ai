import { useState } from "react";
import { sendMessage } from "./services/api";
import { Message } from "./types/chat";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] =
  useState<string>();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(currentInput, sessionId);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: data.reply,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setSessionId(data.sessionId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Spur AI Support Agent</h1>

      <div
        style={{
          border: "1px solid gray",
          height: "400px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign:
                msg.sender === "user"
                  ? "right"
                  : "left",
              marginBottom: "10px",
            }}
          >
            <strong>
              {msg.sender === "user"
                ? "You"
                : "AI"}
            </strong>

            <p>{msg.text}</p>
          </div>
        ))}

        {loading && <p>AI is typing...</p>}
      </div>

      <input
        value={input}
        onChange={(e) =>
          setInput(e.target.value)
        }
        placeholder="Ask something..."
      />

      <button
        onClick={handleSend}
        disabled={loading}
      >
        Send
      </button>
    </div>
  );
}

export default App;