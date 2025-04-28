import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBirthdayCake, FaUserCircle, FaEnvelope, FaVenusMars } from 'react-icons/fa';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('https://mentora-backend-w886.onrender.com/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        return response.json();
      })
      .then(data => setProfile(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {profile && (
        <>
          <motion.div
            className="profile-avatar"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {profile.first_name?.[0]}{profile.last_name?.[0]}
          </motion.div>

          <motion.h2
            className="profile-heading"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome, {profile.first_name || "User"}!
          </motion.h2>
        </>
      )}

      {profile ? (
        <div className="profile-info">
          {[
            { label: 'Username', value: profile.username, icon: <FaUser /> },
            { label: 'First Name', value: profile.first_name, icon: <FaUserCircle /> },
            { label: 'Last Name', value: profile.last_name, icon: <FaUserCircle /> },
            { label: 'Email', value: profile.email, icon: <FaEnvelope /> },
            { label: 'Gender', value: profile.gender, icon: <FaVenusMars /> },
            { label: 'Date of Birth', value: profile.dob ? formatDate(profile.dob) : 'N/A', icon: <FaBirthdayCake /> }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="profile-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <label>{item.icon} {item.label}:</label>
              <p>{item.value || 'Not Provided'}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading profile...
        </motion.p>
      )}
    </motion.div>
  );
};

export default Profile;
