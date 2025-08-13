import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const ConfirmedStudents = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true; // Add a flag to prevent setting state on unmounted component

        const fetchConfirmedStudents = async () => {
            setIsLoading(true);
            try {
                const response = await adminService.getConfirmedStudents();
                if (isMounted) {
                    setStudents(response.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to fetch confirmed students.');
                    console.error(err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchConfirmedStudents();

        return () => { isMounted = false; } // Cleanup function to set isMounted to false
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
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
                            <th>Full Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.username}</td>
                                <td>{student.email}</td>
                                <td>{student.full_name}</td>
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
