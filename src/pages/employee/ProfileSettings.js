import React from 'react';
import { Link } from 'react-router-dom';

const ProfileSettings = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Employee Profile Settings</h1>
      <p>Manage your account settings and preferences.</p>
      <hr />
      <div>
        <Link to="/change-password">Change Password</Link>
      </div>
    </div>
  );
};

export default ProfileSettings;
