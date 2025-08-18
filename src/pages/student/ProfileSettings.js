import { useEffect, useState } from 'react';
import ChangePassword from '../../components/ChangePassword';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';
import '../../styles/StudentComponents.css';

const ProfileSettings = () => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    batch: '',
    bio: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use getMe() instead of getMyProfile() to match the correct API endpoint
        const response = await studentService.getMe();
        console.log('Profile data:', response.data);
        setProfile(response.data);
        
        // Map API response fields to form fields
        setFormData({
          name: response.data.full_name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          program: response.data.department || '',
          batch: response.data.batch || '',
          bio: response.data.bio || ''
        });
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error('Error fetching profile:', err);
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare data in the format expected by the API
      const updateData = {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio
        // Note: We don't include department/batch as they're likely read-only fields managed by admin
      };
      
      // Use updateMe instead of updateProfile to match correct API endpoint
      await studentService.updateMe(updateData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile.');
      console.error('Error updating profile:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="loading-container">Loading profile...</div>;
  }

  if (error && !profile) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="student-page-container">
      <h1 className="student-page-title">Profile Settings</h1>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      <div className="card">
        <div className="card-body">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile?.full_name?.charAt(0) || currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="profile-info">
              <h2>{profile?.full_name || currentUser?.name || 'Student'}</h2>
              <p>{profile?.email || currentUser?.email || ''}</p>
              <p className="profile-role">{profile?.role || 'Student'} • {profile?.department || 'Department'}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  readOnly
                />
              </div>
            </div>
            
            {profile?.id && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="userId">Account ID</label>
                  <input
                    type="text"
                    id="userId"
                    value={profile.id}
                    className="form-control"
                    readOnly
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={profile.username || ''}
                    className="form-control"
                    readOnly
                  />
                </div>
              </div>
            )}
            
            <div className="form-row">
              {/* Only show phone field if the API schema supports it */}
              {(profile?.phone !== undefined || formData.phone) && (
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="program">Department</label>
                <input
                  type="text"
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="form-control"
                  readOnly
                />
              </div>
            </div>
            
            <div className="form-row">
              {/* Only show batch field if the API schema supports it */}
              {(profile?.batch !== undefined || formData.batch) && (
                <div className="form-group">
                  <label htmlFor="batch">Batch</label>
                  <input
                    type="text"
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    className="form-control"
                    readOnly
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={profile?.role || ''}
                  className="form-control"
                  readOnly
                />
              </div>
              
              {profile?.is_active !== undefined && (
                <div className="form-group">
                  <label htmlFor="status">Account Status</label>
                  <input
                    type="text"
                    id="status"
                    name="status"
                    value={profile?.is_active ? 'Active' : 'Inactive'}
                    className="form-control"
                    readOnly
                  />
                </div>
              )}
            </div>
            
            {/* Only show bio field if the API schema supports it */}
            {(profile?.bio !== undefined || formData.bio) && (
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                ></textarea>
              </div>
            )}
            
            <div className="button-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {showPasswordModal && (
        <ChangePassword
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setShowPasswordModal(false);
            setSuccessMessage('Password changed successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
          }}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
