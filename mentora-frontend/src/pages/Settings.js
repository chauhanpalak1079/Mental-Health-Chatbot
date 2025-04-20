import React, { useState } from "react";


function Settings({ toggleTheme, theme }) {
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  return (
    <div className="settings-container">
      <h1>⚙️ Settings</h1>

      <div className="setting-item">
        <span>🌙 Dark Mode:</span>
        <button onClick={toggleTheme}>
          {theme === "light" ? "Enable Dark Mode" : "Disable Dark Mode"}
        </button>
      </div>

      <div className="setting-item">
        <span>🔔 Notifications:</span>
        <input 
          type="checkbox" 
          checked={notifications} 
          onChange={() => setNotifications(!notifications)}
        />
      </div>

      <div className="setting-item">
        <span>🔒 Data Sharing:</span>
        <input 
          type="checkbox" 
          checked={dataSharing} 
          onChange={() => setDataSharing(!dataSharing)}
        />
      </div>

      <div className="setting-item">
        <button className="change-password">🔑 Change Password</button>
        <button className="delete-account">🗑️ Delete Account</button>
      </div>
    </div>
  );
}

export default Settings;
