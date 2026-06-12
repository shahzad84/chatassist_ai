import { useState } from "react";
import { sendMessage } from "./services/api";
import { Message } from "./types/chat";
import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] =
    useState<string | undefined>(
      localStorage.getItem(
        "sessionId"
      ) || undefined
    );
  const [error, setError] =
  useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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
    setError("");

    try {
      const data = await sendMessage(currentInput, sessionId);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: data.reply,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setSessionId(data.sessionId);
      localStorage.setItem(
        "sessionId",
        data.sessionId
      );
    } catch (error) {
        setError(
          "Failed to contact support agent."
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Spur AI Support Agent</h1>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="chat-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-row ${
              msg.sender === "user"
                ? "user"
                : "ai"
            }`}
          >
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="typing">
            Support Agent is typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-container">
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !loading
            ) {
              handleSend();
            }
          }}
          placeholder="Ask something..."
        />

        <button
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;