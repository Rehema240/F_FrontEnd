import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';

const BrowseOpportunity = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await studentService.getOpportunities();
        setOpportunities(response.data);
      } catch (err) {
        setError('Failed to fetch opportunities.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return <div>Loading opportunities...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Browse Opportunities</h1>
      {opportunities.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Organization</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id}>
                <td>{opportunity.title}</td>
                <td>{opportunity.organization}</td>
                <td>{new Date(opportunity.deadline).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No opportunities available to browse.</p>
      )}
    </div>
  );
};

export default BrowseOpportunity;
