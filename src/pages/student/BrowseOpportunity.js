import { useEffect, useState } from 'react';
import studentService from '../../services/studentService';
import '../../styles/StudentComponents.css';

const BrowseOpportunity = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

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

  const viewOpportunityDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const closeDetails = () => {
    setSelectedOpportunity(null);
  };

  if (loading) {
    return <div className="loading-container">Loading opportunities...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="student-page-container">
      <h1 className="student-page-title">Browse Opportunities</h1>
      
      {opportunities.length > 0 ? (
        <div className="card">
          <div className="card-body">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Description</th>
                  <th>Posted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opportunity) => (
                  <tr key={opportunity.id}>
                    <td>{opportunity.title}</td>
                    <td>{opportunity.department || 'N/A'}</td>
                    <td>{opportunity.description?.substring(0, 50)}{opportunity.description?.length > 50 ? '...' : ''}</td>
                    <td>{new Date(opportunity.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => viewOpportunityDetails(opportunity)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p>No opportunities available to browse.</p>
        </div>
      )}
      
      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="confirmation-modal">
          <div className="confirmation-modal-content" style={{ maxWidth: '600px' }}>
            <div className="confirmation-modal-header">
              {selectedOpportunity.title}
            </div>
            <div>
              {selectedOpportunity.department && (
                <p><strong>Department:</strong> {selectedOpportunity.department}</p>
              )}
              <div className="card" style={{ marginTop: '10px', marginBottom: '10px' }}>
                <div className="card-body">
                  <p>{selectedOpportunity.description}</p>
                </div>
              </div>
              {selectedOpportunity.link && (
                <p>
                  <strong>Link:</strong>{' '}
                  <a 
                    href={selectedOpportunity.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    Visit Website
                  </a>
                </p>
              )}
              <p><strong>Posted:</strong> {new Date(selectedOpportunity.created_at).toLocaleDateString()}</p>
            </div>
            <div className="confirmation-modal-footer">
              <button onClick={closeDetails} className="btn btn-outline-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseOpportunity;
