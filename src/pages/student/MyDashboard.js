import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import studentService from '../../services/studentService';
import '../../styles/MyDashboard.css'; // Using new MyDashboard CSS

const MyDashboard = () => {
  const [myConfirmations, setMyConfirmations] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const confirmationsResponse = await studentService.getMyConfirmations();
        setMyConfirmations(confirmationsResponse.data);

        const profileResponse = await studentService.getMe();
        setMyProfile(profileResponse.data);

      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div>
                <h1>SUZA Events</h1>
                <p>State University of Zanzibar</p>
              </div>
            </div>

            <div className="user-profile">
              <div className="notification-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <div className="notification-badge">3</div>
              </div>
              <div className="user-avatar">MS</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2>Welcome to SUZA Events</h2>
          <p>Discover amazing events, connect with fellow students, and make memories that last a lifetime</p>
        </div>
      </section>

      {/* Stats Section 
      section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">25</div>
              <div className="stat-label">This Month's Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1,247</div>
              <div className="stat-label">Registered Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">18</div>
              <div className="stat-label">Conferences</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Attendee Satisfaction</div>
            </div>
          </div>
        </div>
      </section>*/}

      {/* My Profile Section (integrated into the new layout) */}
      {!loading && myProfile && (
        <section className="featured-events"> {/* Reusing section style for consistency */}
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">My Profile</h2>
              <p className="section-subtitle">Your personal information</p>
            </div>
            <div className="dashboard-section">
              <p><strong>Username:</strong> {myProfile.username}</p>
              <p><strong>Email:</strong> {myProfile.email}</p>
              <p><strong>Full Name:</strong> {myProfile.full_name}</p>
              <p><strong>Department:</strong> {myProfile.department}</p>
              <p><strong>Role:</strong> {myProfile.role}</p>
            </div>
          </div>
        </section>
      )}

      {/* My Confirmed Events/Opportunities */}
      <section className="featured-events">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">My Confirmed Events/Opportunities</h2>
            <p className="section-subtitle">Events and opportunities you have confirmed</p>
          </div>

          {loading && <LoadingSpinner />}
          {!loading && error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            myConfirmations.length > 0 ? (
              <div className="events-grid">
                {myConfirmations.map((confirmation) => (
                  <div className="event-card" key={confirmation.id}>
                  <img src={confirmation.image_url ? `${process.env.REACT_APP_API_URL}/pictures/${confirmation.image_url}` : 'https://via.placeholder.com/400x200?text=No+Image'} alt={confirmation.event_title || confirmation.opportunity_title} className="event-image" />
                    <div className="event-content">
                      <div className="event-header">
                        <h3 className="event-title">{confirmation.event_title || confirmation.opportunity_title}</h3>
                        <span className={`event-type ${confirmation.event_id ? 'on-campus' : 'off-campus'}`}>
                          {confirmation.event_id ? 'Event' : 'Opportunity'}
                        </span>
                      </div>

                      <div className="event-details">
                        <div className="event-detail">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {new Date(confirmation.confirmed_at).toLocaleDateString()}
                        </div>
                        <div className="event-detail">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                          {new Date(confirmation.confirmed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="event-detail">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {confirmation.location || 'N/A'} {/* Assuming location might be available or can be mocked */}
                        </div>
                      </div>

                      <p className="event-description">
                        {confirmation.description || 'No description available for this item.'} {/* Assuming description might be available or can be mocked */}
                      </p>

                      <div className="event-footer">
                        <span className="event-organizer">Status: {confirmation.status}</span>
                        <a href={`/details/${confirmation.event_id || confirmation.opportunity_id}`} className="view-event-btn">View Details</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No confirmed events or opportunities yet.</p>
            )
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-subtitle">Start enjoying SUZA's event environment</p>
          </div>

          <div className="actions-grid">
            <div className="action-card" onClick={() => window.location.href='/student/events'}>
              <div className="action-icon">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3 className="action-title">View Events</h3>
              <p className="action-description">See all upcoming events and register for your favorites</p>
            </div>

            <div className="action-card" onClick={() => window.location.href='/student/notifications'}>
              <div className="action-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <h3 className="action-title">Notifications</h3>
              <p className="action-description">Get updates about new events and schedule changes</p>
            </div>

            <div className="action-card" onClick={() => window.location.href='/student/event-history'}>
              <div className="action-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <h3 className="action-title">History</h3>
              <p className="action-description">View photos and details of past events</p>
            </div>

            <div className="action-card" onClick={() => window.location.href='/student/profile-settings'}>
              <div className="action-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 className="action-title">Profile</h3>
              <p className="action-description">Update your information and notification settings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>SUZA Events</h3>
              <p>Connecting students with amazing experiences and opportunities at State University of Zanzibar.</p>
            </div>

            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: events@suza.ac.tz</p>
              <p>Phone: +255 24 223 0958</p>
              <p>Location: Vuga, Unguja, Zanzibar</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 State University of Zanzibar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MyDashboard;
