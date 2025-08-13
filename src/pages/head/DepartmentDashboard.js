import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import headService from '../../services/headService';

const DepartmentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [departmentUsers, setDepartmentUsers] = useState(null);
  const [departmentEvents, setDepartmentEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await headService.getDashboardStats();
        setStats(statsResponse.data);

        const usersResponse = await headService.getDepartmentUsers();
        setDepartmentUsers(usersResponse.data);

        const eventsResponse = await headService.getDepartmentEvents();
        setDepartmentEvents(eventsResponse.data);

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
    <div style={{ padding: '20px' }}>
      <h1>Head Department Dashboard</h1>
      {stats && (
        <div>
          <h2>Dashboard Statistics</h2>
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
      )}
      {departmentUsers && (
        <div>
          <h2>Department Users</h2>
          <pre>{JSON.stringify(departmentUsers, null, 2)}</pre>
        </div>
      )}
      {departmentEvents && (
        <div>
          <h2>Department Events</h2>
          <pre>{JSON.stringify(departmentEvents, null, 2)}</pre>
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
