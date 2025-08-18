import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import '../../styles/DashboardOverview.css';

const MyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch dashboard stats if the endpoint is available
        try {
          const statsResponse = await employeeService.getDashboardStats();
          setStats(statsResponse.data);
        } catch (statsError) {
          console.warn('Dashboard stats endpoint unavailable:', statsError);
          // We'll continue even if stats aren't available
        }

        // Fetch my events
        const eventsResponse = await employeeService.getMyEvents();
        setMyEvents(eventsResponse.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="dashboard-overview">
      <h1>Employee Dashboard</h1>

      {/* Dashboard Statistics */}
      {stats && (
        <div className="stats-container">
          <div className="stat-card">
            <h2>Events Created</h2>
            <p>{stats.events_created || 0}</p>
          </div>
          <div className="stat-card">
            <h2>Opportunities Created</h2>
            <p>{stats.opportunities_created || 0}</p>
          </div>
          <div className="stat-card">
            <h2>Confirmations for My Events</h2>
            <p>{stats.confirmations_for_my_events || 0}</p>
          </div>
        </div>
      )}

      {/* My Events Section */}
      <div className="my-events-section" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>My Events</h2>
          <Link to="/employee/events" className="btn btn-primary">
            Manage Events
          </Link>
        </div>

        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : myEvents.length === 0 ? (
          <p>You haven't created any events yet.</p>
        ) : (
          <div className="events-table-container">
            <table className="event-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Capacity</th>
                  <th>Confirmations</th>
                </tr>
              </thead>
              <tbody>
                {myEvents.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <Link to={`/employee/events/${event.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                        {event.title}
                      </Link>
                    </td>
                    <td>{event.department}</td>
                    <td>{new Date(event.start_time).toLocaleString()}</td>
                    <td>{new Date(event.end_time).toLocaleString()}</td>
                    <td>{event.capacity}</td>
                    <td>{event.confirmation_count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDashboard;
