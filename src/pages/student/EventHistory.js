import { useEffect, useState } from 'react';
import studentService from '../../services/studentService';
import '../../styles/StudentComponents.css';

const EventHistory = () => {
  const [confirmations, setConfirmations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventHistory = async () => {
      try {
        const response = await studentService.getMyEventConfirmations();
        setConfirmations(response.data);
      } catch (err) {
        setError('Failed to fetch event history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventHistory();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading event history...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="student-page-container">
      <h1 className="student-page-title">Event History</h1>
      
      {confirmations.length > 0 ? (
        <div className="card">
          <div className="card-body">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Confirmed At</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {confirmations.map((confirmation) => (
                  <tr key={confirmation.id}>
                    <td>{confirmation.event_title}</td>
                    <td>{new Date(confirmation.event_start_time).toLocaleDateString()}</td>
                    <td>{confirmation.event_location}</td>
                    <td>
                      <span className={`status-badge ${confirmation.status}`}>
                        {confirmation.status}
                      </span>
                    </td>
                    <td>{new Date(confirmation.confirmed_at).toLocaleString()}</td>
                    <td>{confirmation.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📜</div>
          <p>You haven't attended any events yet.</p>
        </div>
      )}
    </div>
  );
};

export default EventHistory;
