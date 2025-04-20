import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatHistory();
    startEmotionDetection();
    setupSpeechRecognition();

    return () => {
      stopEmotionDetection();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  const fetchChatHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    const response = await fetch("http://127.0.0.1:5000/chat/history", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      setChatHistory(data.history);
    } else {
      alert(data.error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    const newMessage = { user_message: message, bot_response: null };
    setChatHistory([...chatHistory, newMessage]);
    setMessage("");
    setLoading(true);

    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { user_message: newMessage.user_message, bot_response: data.response },
      ]);
    } else {
      alert(data.error);
    }
  };

  const startEmotionDetection = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    await fetch("http://127.0.0.1:5000/start-camera", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
  };

  const stopEmotionDetection = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    await fetch("http://127.0.0.1:5000/stop-camera", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const setupSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;
  };

  const handleMicClick = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  return (
    <div className={`chat-container ${darkMode ? "dark" : ""}`}>
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="cloud-background"></div>

      <div className="chat-box">
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <p className="user-message"><strong>You:</strong> {chat.user_message}</p>
            <p className="mentora-message"><strong>Mentora:</strong> {chat.bot_response}</p>
          </div>
        ))}

        {loading && (
          <div className="chat-message">
            <p className="mentora-message typing-indicator">
              <span className="dots"></span>
            </p>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <div className="input-container">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="chat-input"
          />
          <button
            type="button"
            className={`mic-button ${listening ? "listening" : ""}`}
            onClick={handleMicClick}
          >
            🎤
          </button>
          <button type="submit" className="chat-button">Send</button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
