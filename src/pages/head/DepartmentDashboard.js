import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import headService from '../../services/headService';
import '../../styles/DashboardOverview.css';

const DepartmentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div>
        <Link to="/head/confirmed-students">View Confirmed Students</Link>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
