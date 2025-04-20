import React from "react";
import "../styles/ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <h2>Contact Us</h2>
      <div className="contact-details">
        <p><span>📍 Address:</span> 123 Main Street, Pune, India</p>
        <p><span>📞 Phone:</span> +91 9876543210</p>
        <p><span>📧 Email:</span> support@mentora.com</p>
        <p><span>🕒 Hours:</span> Mon–Fri, 9am–6pm</p>
      </div>

      <div className="social-links">
        <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>

      <div className="faq-section">
        <h3>FAQs</h3>
        <ul>
          <li><strong>How can I reset my password?</strong> Go to the login page → Click "Forgot Password".</li>
          <li><strong>How do I contact support?</strong> Email us at support@mentora.com.</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactUs;
