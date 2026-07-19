import { useState, useRef, useEffect } from "react";
import api from "../utils/api";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! Ask me anything about your tasks and projects.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: userMessage });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button style={styles.fab} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div style={styles.drawer}>
          <div style={styles.header}>AI Assistant</div>

          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.bubble,
                  ...(msg.role === "user"
                    ? styles.userBubble
                    : styles.assistantBubble),
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ ...styles.bubble, ...styles.assistantBubble }}>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={styles.inputRow}>
            <input
              type="text"
              placeholder="Ask about your tasks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.sendBtn} disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

const styles = {
  fab: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    fontSize: "22px",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
    zIndex: 200,
  },
  drawer: {
    position: "fixed",
    bottom: "92px",
    right: "24px",
    width: "340px",
    height: "440px",
    background: "#1e293b",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    zIndex: 200,
    border: "1px solid #334155",
  },
  header: {
    padding: "16px",
    color: "#f8fafc",
    fontWeight: 600,
    borderBottom: "1px solid #334155",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  bubble: {
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    maxWidth: "85%",
    lineHeight: 1.4,
  },
  userBubble: {
    background: "#6366f1",
    color: "#fff",
    alignSelf: "flex-end",
  },
  assistantBubble: {
    background: "#334155",
    color: "#f8fafc",
    alignSelf: "flex-start",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid #334155",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    outline: "none",
    fontSize: "13px",
  },
  sendBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  },
};

export default ChatWidget;
