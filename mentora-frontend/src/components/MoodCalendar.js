import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/MoodCalendar.css';

function MoodCalendar() {
  const [loggedDates, setLoggedDates] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);


  // Fetch all logged dates on load
  useEffect(() => {
    fetch('http://127.0.0.1:5000/mood-log/dates', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLoggedDates(data.logged_dates || []))
      .catch((err) => console.error('Failed to fetch dates:', err));
  }, [token]);

  // Navigate to log form
  const handleDateClick = (date) => {
    const selected = new Date(date);
    const today = new Date();

    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selected > today) {
      alert("You can't log mood for future dates!");
      return;
    }

    const formatted = 
    selected.getFullYear() + "-" +
    String(selected.getMonth() + 1).padStart(2, '0') + "-" +
    String(selected.getDate()).padStart(2, '0');

    navigate(`/mood-log/${formatted}`);
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
  
    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const dateStr = formatDate(date);
    const isLogged = loggedDates.includes(dateStr);
    const isFuture = date > today;
    const isPast = date < today;
  
    if (isLogged) return 'logged-date';
    if (isPast && !isLogged) return 'missed-date';
  
    return null;
  };
  

  return (
    <div className="mood-calendar-container">
      <h2>Select a Date to Log/View Mood</h2>
      <Calendar
            onClickDay={(date) => {
                setSelectedDate(date);
                handleDateClick(date);
            }}
            value={selectedDate}
            tileClassName={tileClassName}
            showNeighboringMonth={false}
/>


    </div>
  );
}

export default MoodCalendar;
