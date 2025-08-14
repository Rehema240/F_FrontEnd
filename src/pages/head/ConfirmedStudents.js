import React, { useState, useEffect } from 'react';
import headService from '../../services/headService';

const ConfirmedStudents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await headService.getEvents();
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events.');
        console.error(err);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      const fetchConfirmedStudents = async () => {
        setLoading(true);
        try {
          const response = await headService.getConfirmedStudents(selectedEvent);
          setStudents(response.data);
        } catch (err) {
          setError('Failed to fetch confirmed students.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchConfirmedStudents();
    }
  }, [selectedEvent]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Confirmed Students</h1>
      <div>
        <label htmlFor="event-select">Choose an event:</label>
        <select id="event-select" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
          <option value="">--Please choose an event--</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {loading && <div>Loading students...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {students.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Note</th>
              <th>Status</th>
              <th>Confirmed At</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.note}</td>
                <td>{student.status}</td>
                <td>{new Date(student.confirmed_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && selectedEvent && <p>No confirmed students found for this event.</p>
      )}
    </div>
  );
};

export default ConfirmedStudents;
