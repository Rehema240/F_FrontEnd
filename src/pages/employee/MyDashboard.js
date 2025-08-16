import React, { useState, useEffect } from 'react';
import employeeService from '../../services/employeeService';
import '../../styles/DashboardOverview.css';

const MyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await employeeService.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="dashboard-overview">
      <h1>Employee My Dashboard</h1>
      {stats ? (
        <div className="stats-container">
          <div className="stat-card">
            <h2>Events Created</h2>
            <p>{stats.events_created}</p>
          </div>
          <div className="stat-card">
            <h2>Opportunities Created</h2>
            <p>{stats.opportunities_created}</p>
          </div>
          <div className="stat-card">
            <h2>Confirmations for My Events</h2>
            <p>{stats.confirmations_for_my_events}</p>
          </div>
        </div>
      ) : (
        <p>No statistics available.</p>
      )}
    </div>
  );
};

export default MyDashboard;
