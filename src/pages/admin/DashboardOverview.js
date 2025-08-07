import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/DashboardOverview.css';

const DashboardOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchStats = async () => {
            if (user && user.role !== 'admin') {
                setError('You are not authorized to view this page.');
                return;
            }
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_URL}admin/statistics/`);
                setStats(response.data);
            } catch (err) {
                let errorMessage = 'Failed to fetch statistics.';
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

        fetchStats();
    }, [API_URL, user]);

    return (
        <div className="dashboard-overview">
            <h1>Admin Dashboard Overview</h1>
            {isLoading && <p>Loading statistics...</p>}
            {error && <p className="error-message">{error}</p>}
            {stats && (
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
                    {/* Add more stat cards as needed */}
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;
