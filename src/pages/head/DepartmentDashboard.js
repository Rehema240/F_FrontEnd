import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import headService from '../../services/headService';
import '../../styles/DashboardOverview.css';

const DepartmentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [departmentUsers, setDepartmentUsers] = useState([]);
  const [departmentEvents, setDepartmentEvents] = useState([]);
  const [departmentOpportunities, setDepartmentOpportunities] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreateOpportunityModal, setShowCreateOpportunityModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    department: '',
    start_time: '',
    end_time: '',
    capacity: 0,
    is_public: true,
  });
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    description: '',
    link: '',
    department: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('API_URL:', process.env.REACT_APP_API_URL);
        console.log('Fetching dashboard data from:', `${process.env.REACT_APP_API_URL}/head/dashboard`);
        
        // First try to fetch the main dashboard data
        try {
          const dashboardResponse = await headService.getDashboardStats();
          const dashboardData = dashboardResponse.data;
          console.log('Dashboard data fetched successfully:', dashboardData);
          
          setDashboardData(dashboardData);
          setRecentEvents(dashboardData.recent_events || []);
          
          // Set stats from the dashboard data
          setStats({
            department: dashboardData.department,
            department_users: dashboardData.department_users,
            department_events: dashboardData.department_events,
            department_opportunities: dashboardData.department_opportunities,
            department_confirmations: dashboardData.department_confirmations,
            upcoming_events: dashboardData.upcoming_events
          });
          
          // If dashboard fetch is successful, try to get detailed users and events data
          try {
            const [usersResponse, eventsResponse, opportunitiesResponse] = await Promise.all([
              headService.getDepartmentUsers(),
              headService.getDepartmentEvents(),
              headService.getDepartmentOpportunities()
            ]);
            
            setDepartmentUsers(usersResponse.data || []);
            setDepartmentEvents(eventsResponse.data || []);
            setDepartmentOpportunities(opportunitiesResponse.data || []);
            
          } catch (detailsErr) {
            console.warn('Could not fetch detailed data, using summary data only:', detailsErr);
          }
          
          setError(null);
        } catch (dashboardErr) {
          console.error('Failed to fetch dashboard data, falling back to individual endpoints:', dashboardErr);
          
          // Fallback to fetching individual endpoints
          // Fetch users first
          let users = [];
          try {
            const usersResponse = await headService.getDepartmentUsers();
            users = usersResponse.data || [];
            console.log('Department users fetched successfully:', users);
            setDepartmentUsers(users);
          } catch (usersErr) {
            console.error('Failed to fetch department users:', usersErr);
            setError('Failed to fetch department users. Please check API connection.');
            setLoading(false);
            return; // Exit early if we can't get users
          }
          
          // Then fetch events
          let events = [];
          try {
            const eventsResponse = await headService.getDepartmentEvents();
            events = eventsResponse.data || [];
            console.log('Department events fetched successfully:', events);
            setDepartmentEvents(events);
          } catch (eventsErr) {
            console.error('Failed to fetch department events:', eventsErr);
            // Continue even if we can't get events
          }
          
          // Try to fetch opportunities if available
          let opportunities = [];
          try {
            const opportunitiesResponse = await headService.getDepartmentOpportunities();
            opportunities = opportunitiesResponse.data || [];
            console.log('Department opportunities fetched successfully:', opportunities);
            setDepartmentOpportunities(opportunities);
          } catch (oppErr) {
            console.warn("Failed to fetch department opportunities:", oppErr);
            // Continue even if we can't get opportunities
          }
          
          // Create stats object from the fetched data
          setStats({
            department_users: users.length,
            department_events: events.length,
            department_opportunities: opportunities.length
          });
        }
      } catch (err) {
        setError('Failed to fetch dashboard data. Please check console for details.');
        console.error('Dashboard fetch error:', err);
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
    return (
      <div className="error-container">
        <h2>Dashboard Error</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <p>Please check the API endpoints and make sure they are configured correctly:</p>
        <ul>
          <li>Current API URL: {process.env.REACT_APP_API_URL || 'Not set'}</li>
          <li>Main dashboard endpoint: /head/dashboard</li>
          <li>Endpoint for users: /head/dashboard/department_users/</li>
          <li>Endpoint for events: /head/dashboard/department_events/</li>
          <li>Endpoint for opportunities: /head/dashboard/department_opportunities/</li>
        </ul>
        <button 
          onClick={refreshData} 
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'event') {
      setNewEvent({ ...newEvent, [name]: value });
    } else {
      setNewOpportunity({ ...newOpportunity, [name]: value });
    }
  };

  const handleCreateEvent = async () => {
    try {
      await headService.createEvent(newEvent);
      setShowCreateEventModal(false);
      Swal.fire('Success!', 'Event created successfully.', 'success');
      // Optionally, you can refetch the dashboard data here
    } catch (err) {
      setError('Failed to create event.');
      console.error(err);
      Swal.fire('Error!', 'Failed to create event.', 'error');
    }
  };

  const handleCreateOpportunity = async () => {
    try {
      const opportunityData = { ...newOpportunity, department: user.department };
      await headService.createOpportunity(opportunityData);
      setShowCreateOpportunityModal(false);
      Swal.fire('Success!', 'Opportunity created successfully.', 'success');
      // Optionally, you can refetch the dashboard data here
    } catch (err) {
      setError('Failed to create opportunity.');
      console.error(err);
      Swal.fire('Error!', 'Failed to create opportunity.', 'error');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      // Try to fetch the main dashboard data first
      try {
        const dashboardResponse = await headService.getDashboardStats();
        const dashboardData = dashboardResponse.data;
        console.log('Dashboard data refreshed successfully:', dashboardData);
        
        setDashboardData(dashboardData);
        setRecentEvents(dashboardData.recent_events || []);
        
        // Set stats from the dashboard data
        setStats({
          department: dashboardData.department,
          department_users: dashboardData.department_users,
          department_events: dashboardData.department_events,
          department_opportunities: dashboardData.department_opportunities,
          department_confirmations: dashboardData.department_confirmations,
          upcoming_events: dashboardData.upcoming_events
        });
        
        // If dashboard refresh is successful, try to get detailed users and events data
        try {
          const [usersResponse, eventsResponse, opportunitiesResponse] = await Promise.all([
            headService.getDepartmentUsers(),
            headService.getDepartmentEvents(),
            headService.getDepartmentOpportunities()
          ]);
          
          setDepartmentUsers(usersResponse.data || []);
          setDepartmentEvents(eventsResponse.data || []);
          setDepartmentOpportunities(opportunitiesResponse.data || []);
          
        } catch (detailsErr) {
          console.warn('Could not refresh detailed data, using summary data only:', detailsErr);
        }
        
        setError(null);
      } catch (dashboardErr) {
        console.error('Failed to refresh dashboard data, falling back to individual endpoints:', dashboardErr);
        
        // Fallback to fetching individual endpoints
        // Fetch users first
        let users = [];
        try {
          const usersResponse = await headService.getDepartmentUsers();
          users = usersResponse.data || [];
          console.log('Department users refreshed successfully:', users);
          setDepartmentUsers(users);
        } catch (usersErr) {
          console.error('Failed to refresh department users:', usersErr);
          setError('Failed to refresh department users. Please check API connection.');
          setLoading(false);
          return; // Exit early if we can't get users
        }
        
        // Then fetch events
        let events = [];
        try {
          const eventsResponse = await headService.getDepartmentEvents();
          events = eventsResponse.data || [];
          console.log('Department events refreshed successfully:', events);
          setDepartmentEvents(events);
        } catch (eventsErr) {
          console.error('Failed to refresh department events:', eventsErr);
          // Continue even if we can't get events
        }
        
        // Try to fetch opportunities if available
        let opportunities = [];
        try {
          const opportunitiesResponse = await headService.getDepartmentOpportunities();
          opportunities = opportunitiesResponse.data || [];
          console.log('Department opportunities refreshed successfully:', opportunities);
          setDepartmentOpportunities(opportunities);
        } catch (oppErr) {
          console.warn("Failed to refresh department opportunities:", oppErr);
          // Continue even if we can't get opportunities
        }
        
        // Create stats object from the fetched data
        setStats({
          department_users: users.length,
          department_events: events.length,
          department_opportunities: opportunities.length
        });
      }
    } catch (err) {
      setError('Failed to refresh dashboard data. Please check console for details.');
      console.error('Dashboard refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <h1>Head Department Dashboard</h1>
        <button 
          onClick={refreshData} 
          className="btn btn-outline-primary refresh-btn"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      {stats && (
        <div className="stats-container">
          {stats.department && (
            <div className="stat-card department-card">
              <h2>Department</h2>
              <p>{stats.department}</p>
            </div>
          )}
          <div className="stat-card">
            <h2>Department Users</h2>
            <p>{stats.department_users}</p>
          </div>
          <div className="stat-card">
            <h2>Department Events</h2>
            <p>{stats.department_events}</p>
          </div>
          <div className="stat-card">
            <h2>Department Opportunities</h2>
            <p>{stats.department_opportunities}</p>
          </div>
          {stats.department_confirmations !== undefined && (
            <div className="stat-card">
              <h2>Total Confirmations</h2>
              <p>{stats.department_confirmations}</p>
            </div>
          )}
          {stats.upcoming_events !== undefined && (
            <div className="stat-card">
              <h2>Upcoming Events</h2>
              <p>{stats.upcoming_events}</p>
            </div>
          )}
        </div>
      )}
      <hr />
      <div className="dashboard-actions">
        <button onClick={() => setShowCreateEventModal(true)} className="btn btn-primary">Create New Event</button>
        <button onClick={() => setShowCreateOpportunityModal(true)} className="btn btn-primary">Create New Opportunity</button>
      </div>
      <div className="dashboard-links">
        <Link to="/head/confirmed-students" className="dashboard-link">View Confirmed Students</Link>
        <Link to="/head/notifications" className="dashboard-link">View Notifications</Link>
      </div>
      
      {/* Department Users Section */}
      <div className="dashboard-section">
        <h2>Department Users</h2>
        {departmentUsers.length > 0 ? (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {departmentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>{user.role}</td>
                  <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No department users found.</p>
        )}
      </div>

      {/* Department Events Section */}
      <div className="dashboard-section">
        <h2>Department Events</h2>
        {departmentEvents.length > 0 ? (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Location</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Capacity</th>
                <th>Confirmations</th>
              </tr>
            </thead>
            <tbody>
              {departmentEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.description.substring(0, 50)}...</td>
                  <td>{event.location}</td>
                  <td>{new Date(event.start_time).toLocaleString()}</td>
                  <td>{new Date(event.end_time).toLocaleString()}</td>
                  <td>{event.capacity}</td>
                  <td>{event.confirmation_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No department events found.</p>
        )}
      </div>
      
      {/* Department Opportunities Section */}
      <div className="dashboard-section">
        <h2>Department Opportunities</h2>
        {departmentOpportunities.length > 0 ? (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Link</th>
                <th>Department</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {departmentOpportunities.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td>{opportunity.title}</td>
                  <td>{opportunity.description.substring(0, 50)}...</td>
                  <td>
                    {opportunity.link && (
                      <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                        View Link
                      </a>
                    )}
                  </td>
                  <td>{opportunity.department}</td>
                  <td>{new Date(opportunity.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No department opportunities found.</p>
        )}
      </div>
      
      {/* Recent Events Section */}
      {recentEvents && recentEvents.length > 0 && (
        <div className="dashboard-section">
          <h2>Recent Events</h2>
          <div className="recent-events-container">
            {recentEvents.map((event) => (
              <div key={event.id} className="recent-event-card">
                <h3>{event.title}</h3>
                <p className="event-description">{event.description.substring(0, 100)}...</p>
                <div className="event-details">
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Department:</strong> {event.department}</p>
                  <p>
                    <strong>Date:</strong> {new Date(event.start_time).toLocaleDateString()} 
                    {event.start_time !== event.end_time && ` - ${new Date(event.end_time).toLocaleDateString()}`}
                  </p>
                  <p>
                    <strong>Time:</strong> {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                    {event.start_time !== event.end_time && ` - ${new Date(event.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                  </p>
                  <p><strong>Capacity:</strong> {event.capacity}</p>
                  <p><strong>Confirmations:</strong> {event.confirmation_count}</p>
                </div>
                <Link to={`/head/events/${event.id}`} className="btn btn-sm btn-outline-primary">View Details</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        title="Create New Event"
        show={showCreateEventModal}
        onConfirm={handleCreateEvent}
        onCancel={() => setShowCreateEventModal(false)}
      >
        <form className="event-form">
          <input name="title" value={newEvent.title} onChange={(e) => handleInputChange(e, 'event')} placeholder="Title" required className="form-input" />
          <textarea name="description" value={newEvent.description} onChange={(e) => handleInputChange(e, 'event')} placeholder="Description" required className="form-textarea" />
          <input name="location" value={newEvent.location} onChange={(e) => handleInputChange(e, 'event')} placeholder="Location" required className="form-input" />
          <input name="department" value={newEvent.department} onChange={(e) => handleInputChange(e, 'event')} placeholder="Department" required className="form-input" />
          <input type="datetime-local" name="start_time" value={newEvent.start_time} onChange={(e) => handleInputChange(e, 'event')} required className="form-input" />
          <input type="datetime-local" name="end_time" value={newEvent.end_time} onChange={(e) => handleInputChange(e, 'event')} required className="form-input" />
          <input type="number" name="capacity" value={newEvent.capacity} onChange={(e) => handleInputChange(e, 'event')} placeholder="Capacity" required className="form-input" />
          <label>
            <input type="checkbox" name="is_public" checked={newEvent.is_public} onChange={(e) => setNewEvent({ ...newEvent, is_public: e.target.checked })} />
            Public
          </label>
        </form>
      </Modal>

      <Modal
        title="Create New Opportunity"
        show={showCreateOpportunityModal}
        onConfirm={handleCreateOpportunity}
        onCancel={() => setShowCreateOpportunityModal(false)}
      >
        <form className="opportunity-form">
          <input name="title" value={newOpportunity.title} onChange={(e) => handleInputChange(e, 'opportunity')} placeholder="Title" required className="form-input" />
          <textarea name="description" value={newOpportunity.description} onChange={(e) => handleInputChange(e, 'opportunity')} placeholder="Description" required className="form-textarea" />
          <input name="link" value={newOpportunity.link} onChange={(e) => handleInputChange(e, 'opportunity')} placeholder="Link" required className="form-input" />
          <input name="department" value={newOpportunity.department} onChange={(e) => handleInputChange(e, 'opportunity')} placeholder="Department" required className="form-input" />
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentDashboard;
