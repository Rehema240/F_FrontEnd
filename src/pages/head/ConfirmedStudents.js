import React, { useState, useEffect } from 'react';
import headService from '../../services/headService';

const ConfirmedStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfirmedStudents = async () => {
      try {
        const response = await headService.getConfirmedStudents();
        setStudents(response.data);
      } catch (err) {
        setError('Failed to fetch confirmed students.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedStudents();
  }, []);

  if (loading) {
    return <div>Loading students...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Confirmed Students</h1>
      {students.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.username}</td>
                <td>{student.email}</td>
                <td>{`${student.first_name} ${student.last_name}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No confirmed students found.</p>
      )}
    </div>
  );
};

export default ConfirmedStudents;
