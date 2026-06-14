import { useState, useEffect, useRef } from "react";
import { sendMessage, getHistory } from "./services/api";
import { Message } from "./types/chat";
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
  const [showLimitWarning, setShowLimitWarning] =
  useState(false);
  const [error, setError] =
  useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    async function loadHistory() {
      const savedSession =
        localStorage.getItem("sessionId");

      if (!savedSession) return;

      try {
        const history = await getHistory(savedSession);

        const formatted = history.map((msg: Message) => ({
          id: msg.id.toString(),
          text: msg.text,
          sender: msg.sender as "user" | "ai",
        }));

        setMessages(formatted);
        setSessionId(savedSession);
      } catch (error) {
        console.error(
          "Failed to load history",
          error
        );

        setError(
          "Unable to restore previous conversation."
        );
      }
    }

    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (input.length > 1000) {
      setError(
        "Message exceeds maximum length"
      );
      return;
    }
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
        error instanceof Error
          ? error.message
          : "Failed to contact support agent."
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
        <input className={showLimitWarning ? "input-limit" : ""}
          value={input}
          maxLength={1000}
          onChange={(e) => {
            const value = e.target.value;

            if (value.length >= 1000) {
              setShowLimitWarning(true);

              setTimeout(() => {
                setShowLimitWarning(false);
              }, 2500);
            }

            setInput(value);
          }}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !loading &&
              input.trim()
            ) {
              handleSend();
            }
          }}
          placeholder="Ask something..."
        />

        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default App;