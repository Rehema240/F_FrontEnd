import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';

const MyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await studentService.getDashboardStats();
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
    <div style={{ padding: '20px' }}>
      <h1>Student My Dashboard</h1>
      {stats ? (
        <div>
          <h2>Dashboard Statistics</h2>
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
      ) : (
        <p>No statistics available.</p>
      )}
    </div>
  );
};

export default MyDashboard;
