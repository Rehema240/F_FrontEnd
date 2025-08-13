import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import '../../styles/DashboardOverview.css';
const API_URL = process.env.REACT_APP_API_URL;

const DashboardOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [confirmedStudents, setConfirmedStudents] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.role !== 'admin') {
                setError('You are not authorized to view this page.');
                return;
            }
            setIsLoading(true);
            try {
                const [statsResponse, studentsResponse] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getConfirmedStudents(),
                ]);
                setStats(statsResponse.data);
                setConfirmedStudents(studentsResponse.data);
            } catch (err) {
                let errorMessage = 'Failed to fetch data.';
                if (err.response) {
                    errorMessage += ` Server responded with status ${err.response.status}.`;
                    console.error('Error data:', err.response.data);
                } else if (err.request) {
                    errorMessage += ' No response from server.';
                    console.error('Error request:', err.request);
                } else {
                    errorMessage += ' Error in request setup.';
                    console.error('Error message:', err.message);
                }
                setError(errorMessage);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [API_URL, user]);

    return (
        <div className="dashboard-overview">
            <h1>Admin Dashboard Overview</h1>
            {isLoading && <LoadingSpinner />}
            {error && <p className="error-message">{error}</p>}
            {stats && !isLoading && (
                <div className="stats-container">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p>{stats.total_users}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Events</h3>
                        <p>{stats.total_events}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Opportunities</h3>
                        <p>{stats.total_opportunities}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Confirmations</h3>
                        <p>{stats.total_confirmations}</p>
                    </div>
                </div>
            )}
            <div className="confirmed-students-container">
                <h2>Confirmed Students</h2>
                {confirmedStudents.length > 0 ? (
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
                            {confirmedStudents.map((student) => (
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
        </div>
    );
};

export default DashboardOverview;
