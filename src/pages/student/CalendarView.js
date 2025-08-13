import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const response = await studentService.getCalendarEvents();
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch calendar events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, []);

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Student Calendar View</h1>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.title}</strong> - {new Date(event.deadline).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events scheduled.</p>
      )}
    </div>
  );
};

export default CalendarView;
