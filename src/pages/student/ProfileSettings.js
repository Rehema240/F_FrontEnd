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
        const response = await studentService.getMyProfile();
        setProfile(response.data);
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          program: response.data.program || '',
          batch: response.data.batch || '',
          bio: response.data.bio || ''
        });
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error(err);
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
      await studentService.updateProfile(formData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
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
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="profile-info">
              <h2>{currentUser?.name || 'Student'}</h2>
              <p>{currentUser?.email || ''}</p>
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
            
            <div className="form-row">
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
              
              <div className="form-group">
                <label htmlFor="program">Program</label>
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
            </div>
            
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
