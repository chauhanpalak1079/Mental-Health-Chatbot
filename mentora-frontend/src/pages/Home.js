import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import robotImg from "../assets/robot.jpg"; //

const Home = () => {
  const [showMore, setShowMore] = useState({
    chatbot: false,
    reports: false,
    moodTracking: false,
    cnnDetection: false,
  });

  const navigate = useNavigate();

  const toggleInfo = (feature) => {
    setShowMore((prev) => ({ ...prev, [feature]: !prev[feature] }));
  };

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <motion.div
        className="welcome-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="welcome-container">
          <h1>Welcome to Mentora</h1>
          <h3>Your AI-powered mental health companion</h3>
          <p className="quote">
            "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity."
          </p>
          <button className="get-started-btn" onClick={() => navigate("/chat")}>
            Get Started
          </button>
        </div>
        <div className="robot-container">
          <img src={robotImg} alt="AI Robot" className="robot-image" />
        </div>
      </motion.div>

      <div className="motion-wrapper">
  {/* Greeting Container */}
  <motion.div
    className="motion-container"
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <h2>Hi, I am your AI companion.</h2>
    <p>Here to listen, understand, and support you.</p>
  </motion.div>


      {/* Mood Log Container */}
      <div className="mood-log-container">
        <h2 className="mood-heading">Track your emotional journey </h2>
        <p className="mood-description">Logging your mood daily helps you reflect and grow.</p>
        <p className="mood-question">How are you feeling today?</p>
        <a className="mood-log-link" href="/mood-log">Mood Check-In</a>
      </div>

</div>


      {/* Why Mentora is Unique */}
      <div className="unique-container">
        <h2>Why Mentora is Unique?</h2>
        <div className="features-row">
          {[
            {
              key: "chatbot",
              title: "Mentora Chatbot",
              extra: "A smart AI chatbot to support your mental health needs.Mentora's chatbot provides real-time mental health conversations, helping users feel heard and supported 24/7.",
            },
            {
              key: "reports",
              title: "Mental Health Reports",
              extra: "Track your mental health progress with AI-generated reports.Get AI-generated reports summarizing your mental health trends and emotional patterns based on your chats.",
            },
            {
              key: "moodTracking",
              title: "Mood Tracking",
              extra: "Understand your mood patterns with smart tracking.Our AI tracks your emotions over time, helping you identify trends and improve your mental well-being.",
            },
            {
              key: "cnnDetection",
              title: "CNN Emotion Detection",
              extra: "Advanced AI detects emotions from facial expressions.Using deep learning (CNN), Mentora can analyze facial expressions to detect emotions and provide better support.",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.key}
              className="feature-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button onClick={() => toggleInfo(feature.key)}>
                {showMore[feature.key] ? "Show Less" : "Learn More"}
              </button>
              {showMore[feature.key] && (
                <motion.div
                  className="extra-info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{feature.extra}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

{/* Why Choose Mentora? */}
<motion.div
  className="choose-us"
  initial={{ opacity: 0, x: -30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7 }}
>
  <h2>Why Choose Mentora?</h2>
  <p>Mentora is your 24/7 AI companion, offering confidential, empathetic, and data-driven mental health support.</p>

  <div className="features-row">
    {[
      { title: "24/7 Support", description: "Help anytime, anywhere." },
      { title: "Private & Secure", description: "Your chats are encrypted." },
      { title: "AI Insights", description: "Smart mood tracking & reports." },
      { title: "Empathetic AI", description: "Conversations that listen." },
    ].map((feature, index) => (
      <motion.div
        key={index}
        className="feature-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
      >
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </motion.div>
    ))}
  </div>
</motion.div>

{/* How Mentora Helps Section */}
<motion.div
  className="how-mentora-helps"
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7 }}
>
  <h2>How Mentora Helps?</h2>
  <p>Mentora offers AI-driven emotional support, tracks your mood, and provides expert-backed mental health insights to guide you towards well-being.</p>
</motion.div>




      {/* Our Mission Section */}
<motion.div
  className="mission"
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7 }}
>
  <h2>Our Mission</h2>
  <p>At AI Mentora, we aim to provide accessible, compassionate, and AI-driven mental health support for everyone.</p>
</motion.div>


      {/* Footer */}
      <footer className="reserved-rights">
        <p>© 2025 Mentora. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
