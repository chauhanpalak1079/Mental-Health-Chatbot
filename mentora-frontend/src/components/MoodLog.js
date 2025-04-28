import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/MoodLog.css';

function MoodLogForm() {
  const { date } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    mood: '',
    influence: '',
    sleep_quality: '',
    food_intake: '',
    coping_mechanism: '',
    improvement_goal: '',
    note: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`https://mentora-backend-w886.onrender.com/mood-log/${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setIsSubmitted(false);
        } else {
          setFormData(data);
          setIsSubmitted(true);
        }
      });
  }, [date, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const readableDate = new Date(date).toLocaleDateString('en-CA');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://mentora-backend-w886.onrender.com/mood-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...formData, date })
    });

    const result = await res.json();
    if (res.ok) {
      setMessage(' ✔ Mood logged successfully!');
      setIsSubmitted(true);
    } else {
      setMessage(`❌ ${result.message}`);
    }
  };

  return (
    <div style={{ minHeight: '90vh', overflowY: 'auto' }}>
     <div className="mood-tracker-container">
      <h2>Mood Log for {readableDate}</h2>

      {isSubmitted ? (
        <p className="message">
          <span className="check-icon">✔</span> You've already logged your mood for this day.
        </p>
      ) : (
        <form className="mood-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Form groups for all fields */}
            {[
              ['mood', 'How did you feel today?', ['Happy', 'Sad', 'Anxious', 'Angry', 'Tired', 'Neutral']],
              ['influence', 'What affected your mood the most?', ['Work/Studies', 'Relationships', 'Health', 'Sleep', 'Social Media']],
              ['sleep_quality', 'How was your sleep last night?', ['Great', 'Okay', 'Poor', "Didn't sleep"]],
              ['food_intake', 'How would you describe your eating today?', ['Healthy', 'Skipped meals', 'Junk food', "Didn't eat much"]],
              ['coping_mechanism', 'Did you try anything to manage your mood?', ['Talked to someone', 'Took a walk', 'Watched something', 'Journaled', "Didn't cope"]],
              ['improvement_goal', '"One small step for tomorrow?"', ['Sleep earlier', 'Avoid overthinking', 'Eat better', 'Exercise', 'Talk to a friend']]
              ].map(([name, label, options], index) => (
              <div key={name} className="form-group">
                <label>{label}</label>
                <select name={name} value={formData[name]} onChange={handleChange} required>
                  <option value="">Select</option>
                  {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="form-group full-width">
          <label>Want to add a note about your day? (Optional)</label>
            <textarea name="note" value={formData.note} onChange={handleChange} rows="3" />
          </div>

          <div className="form-group full-width">
            <button type="submit">Submit</button>
          </div>
        </form>
      )}

      {message && (
        <p className="message">
          <span></span> {message}
        </p>
      )}

      <br />
      <button onClick={() => navigate('/mood-log')}>⬅ Back to Calendar</button>
    </div>
    </div>
  );
}

export default MoodLogForm;
