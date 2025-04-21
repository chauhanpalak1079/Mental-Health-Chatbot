import React from 'react';
import "../styles/Contact.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1>Contact Us</h1>
        <div className="contact-item">
          <FaMapMarkerAlt className="contact-icon" />
          <p>Parth Residency,Lohgaon,Pune</p>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="contact-icon" />
          <p>876-7604-500</p>
        </div>
        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <p>mentora.ai@gmail.com</p>
        </div>
        <div className="contact-item">
          <FaGlobe className="contact-icon" />
          <p>www.mentora.ai.com</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
