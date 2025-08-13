import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { changePassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }

        try {
            await changePassword(oldPassword, newPassword);
            setSuccess('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setError('Failed to change password. Please check your old password.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h2 className="login-title">Change Password</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label className="form-label" htmlFor="old-password">
                            Old Password
                        </label>
                        <input
                            id="old-password"
                            type="password"
                            placeholder="Enter your old password"
                            className="form-input"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="new-password">
                            New Password
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            placeholder="Enter your new password"
                            className="form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button
                        type="submit"
                        disabled={isLoading || !oldPassword || !newPassword}
                        className="submit-button"
                    >
                        {isLoading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
