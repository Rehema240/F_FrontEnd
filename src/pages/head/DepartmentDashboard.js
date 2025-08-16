import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import headService from '../../services/headService';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2';
import '../../styles/DashboardOverview.css';

const DepartmentDashboard = () => {
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
        const statsResponse = await headService.getDashboardStats();
        setStats(statsResponse.data);
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

  return (
    <div className="dashboard-overview">
      <h1>Head Department Dashboard</h1>
      {stats && (
        <div className="stats-container">
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
        </div>
      )}
      <hr />
      <div className="dashboard-actions">
        <button onClick={() => setShowCreateEventModal(true)} className="btn btn-primary">Create New Event</button>
        <button onClick={() => setShowCreateOpportunityModal(true)} className="btn btn-primary">Create New Opportunity</button>
      </div>
      <div>
        <Link to="/head/confirmed-students">View Confirmed Students</Link>
      </div>

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
