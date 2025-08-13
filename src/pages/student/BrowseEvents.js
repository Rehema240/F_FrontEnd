import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await studentService.getEvents();
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleConfirm = async (eventId) => {
    setConfirming(eventId);
    try {
      await studentService.confirmEvent({ event: eventId, status: 'confirmed' });
      // Optionally, you could refetch events or update the UI to show confirmation
      alert('Event confirmed successfully!');
    } catch (err) {
      setError('Failed to confirm event.');
      console.error(err);
    } finally {
      setConfirming(null);
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Browse Events</h1>
      {events.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{new Date(event.deadline).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleConfirm(event.id)}
                    disabled={confirming === event.id}
                  >
                    {confirming === event.id ? 'Confirming...' : 'Confirm Attendance'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No events available to browse.</p>
      )}
    </div>
  );
};

export default BrowseEvents;
