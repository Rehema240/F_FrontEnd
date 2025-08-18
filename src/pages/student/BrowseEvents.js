import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DebugPanel from '../../components/DebugPanel';
import studentService from '../../services/studentService';
import '../../styles/StudentComponents.css';

// For debugging - display environment variables
const API_URL = process.env.REACT_APP_API_URL;

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmationNote, setConfirmationNote] = useState('');
  
  const refreshEvents = async () => {
    try {
      setLoading(true);
      
      // Get all available events
      const eventsResponse = await studentService.getEvents();
      console.log('Events fetched:', eventsResponse.data);
      
      // Get the user's confirmed events
      const confirmationsResponse = await studentService.getMyEventConfirmations();
      console.log('My event confirmations:', confirmationsResponse.data);
      
      // Create a map of confirmed event IDs for quick lookup
      const confirmedEventIds = new Map();
      confirmationsResponse.data.forEach(confirmation => {
        if (confirmation.status === 'confirmed' && confirmation.event_id) {
          confirmedEventIds.set(confirmation.event_id, confirmation);
        }
      });
      
      console.log('Confirmed event IDs:', Array.from(confirmedEventIds.keys()));
      
      // Merge the data - mark events as confirmed if they're in the confirmations list
      const mergedEvents = eventsResponse.data.map(event => {
        if (!event.id) {
          console.warn('Event missing ID:', event);
          return { 
            ...event, 
            id: `temp-${Math.random().toString(36).substring(2, 15)}`,
            confirmed: false
          };
        }
        
        // Check if this event is confirmed by the student
        const isConfirmed = confirmedEventIds.has(event.id);
        const confirmation = confirmedEventIds.get(event.id);
        
        return { 
          ...event, 
          confirmed: isConfirmed,
          confirmation: confirmation || null,
          confirmedAt: confirmation ? confirmation.confirmed_at : null,
          confirmationNote: confirmation ? confirmation.note : null
        };
      });
      
      setEvents(mergedEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events. Please try refreshing the page.');
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log('Component mounted with API URL:', API_URL);
    refreshEvents();
  }, []);

  const openConfirmationModal = (event) => {
    // Enhanced logging for troubleshooting
    console.log('Selected event for confirmation:', event);
    console.log('Event ID type:', typeof event.id);
    console.log('Event ID value:', event.id);
    
    // Check if the ID is a valid UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isUUID = uuidPattern.test(event.id);
    console.log('Is ID a valid UUID format?', isUUID);
    
    // Check if the event is already confirmed
    if (event.confirmed) {
      // Call debug endpoint for troubleshooting
      studentService.debugEventConfirmation(event.id)
        .then(response => {
          console.log('Debug confirmation info:', response.data);
        })
        .catch(error => {
          console.error('Error fetching debug info:', error);
        });
    }
    
    setSelectedEvent(event);
    setConfirmationNote('');
    setShowModal(true);
  };

  const closeConfirmationModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setConfirmationNote('');
  };

  const handleConfirm = async () => {
    if (!selectedEvent) return;
    
    setConfirming(selectedEvent.id);
    try {
      // Get event ID from the selected event
      const eventId = selectedEvent.id;
      
      // Create the payload exactly as the API expects it according to documentation:
      // { "note": "string", "event_id": "UUID", "status": "confirmed" }
      const confirmationData = {
        event_id: eventId, 
        status: "confirmed" // Use exactly "confirmed" string as per API spec
      };
      
      // Only add the note if it's not empty (note is optional)
      if (confirmationNote && confirmationNote.trim()) {
        confirmationData.note = confirmationNote.trim();
      }
      
      // Log for debugging
      console.log('Sending event confirmation request with payload:', confirmationData);
      
      const response = await studentService.createEventConfirmation(confirmationData);
      console.log('Confirmation response:', response.data);
      
      // Get the latest confirmations to update the UI
      const confirmationsResponse = await studentService.getMyEventConfirmations();
      console.log('Updated confirmations:', confirmationsResponse.data);
      
      // Find the confirmation for the current event
      const eventConfirmation = confirmationsResponse.data.find(
        confirmation => confirmation.event_id === selectedEvent.id
      );
      
      console.log('Found confirmation for this event:', eventConfirmation);
      
      // Update the UI to reflect the confirmation with complete data
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? { 
                ...event, 
                confirmed: true,
                confirmation: eventConfirmation || null,
                confirmedAt: eventConfirmation ? eventConfirmation.confirmed_at : new Date().toISOString(),
                confirmationNote: confirmationNote.trim() || null
              }
            : event
        )
      );
      
      closeConfirmationModal();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Event confirmed successfully!',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Refresh the events list to get updated data
      refreshEvents();
      
    } catch (err) {
      console.error('Confirmation error:', err);
      
      // Try to extract a more specific error message
      let errorMessage = 'Failed to confirm event. Please try again.';
      let errorDetail = '';
      
      if (err.response) {
        console.log('Error response status:', err.response.status);
        console.log('Error response data:', err.response.data);
        
        // Handle FastAPI validation errors (422)
        if (err.response.status === 422 && err.response.data && err.response.data.detail) {
          // FastAPI returns validation errors in a specific format
          if (Array.isArray(err.response.data.detail)) {
            const details = err.response.data.detail;
            const errorDetails = details.map(detail => {
              // Extract field name from the location array (typically ["body", "field_name"])
              const field = detail.loc && detail.loc.length > 1 ? detail.loc[detail.loc.length - 1] : 'unknown';
              return `${field}: ${detail.msg}`;
            });
            errorMessage = `API Validation errors:`;
            errorDetail = errorDetails.join('; ');
            
            // Log for debugging
            console.log('Detailed validation errors:');
            details.forEach(detail => {
              console.log(`- ${detail.loc}: ${detail.msg} (${detail.type})`);
            });
            
            // If the error is about event_id format, provide a clearer message
            if (errorDetail.includes('event_id') && errorDetail.includes('uuid')) {
              errorDetail = 'The event ID must be a valid UUID format. Please try again or contact support.';
            }
          } else {
            errorMessage = `API Error:`;
            errorDetail = err.response.data.detail;
          }
        }
        // Handle unauthorized (403)
        else if (err.response.status === 403) {
          errorMessage = 'You are not authorized to confirm this event.';
        }
        // Handle conflict (409) - likely already confirmed
        else if (err.response.status === 409) {
          errorMessage = 'This event may already be confirmed.';
          // Try to parse the detail message if available
          if (err.response.data?.detail) {
            errorDetail = err.response.data.detail;
          }
          
          // Refresh to get the latest state
          refreshEvents();
        }
        // Handle other error formats
        else if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorDetail = err.response.data;
          } else {
            // Try to extract validation errors from other formats
            const validationErrors = [];
            for (const key in err.response.data) {
              if (Array.isArray(err.response.data[key])) {
                validationErrors.push(`${key}: ${err.response.data[key].join(', ')}`);
              } else if (typeof err.response.data[key] === 'string') {
                validationErrors.push(`${key}: ${err.response.data[key]}`);
              }
            }
            
            if (validationErrors.length > 0) {
              errorDetail = validationErrors.join('; ');
            }
          }
        }
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Could Not Confirm Event',
        text: errorMessage,
        ...(errorDetail && { footer: errorDetail })
      });
    } finally {
      setConfirming(null);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading events...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="student-page-container">
      <h1 className="student-page-title">Browse Events</h1>
      
      {events.length > 0 ? (
        <div className="card">
          <div className="card-body">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.description?.substring(0, 50)}{event.description?.length > 50 ? '...' : ''}</td>
                    <td>{event.location}</td>
                    <td>{new Date(event.start_time).toLocaleString()}</td>
                    <td>{new Date(event.end_time).toLocaleString()}</td>
                    <td>
                      {event.confirmed ? (
                        <div className="confirmed-status">
                          <span className="status-badge confirmed">Confirmed</span>
                          {event.confirmedAt && (
                            <small className="confirmation-time">
                              on {new Date(event.confirmedAt).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      ) : (
                        <span className="status-badge not-confirmed">Not Confirmed</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`btn ${event.confirmed ? 'btn-success' : 'btn-primary'}`}
                        onClick={() => openConfirmationModal(event)}
                        disabled={confirming === event.id || event.confirmed}
                        title={event.confirmed ? `Confirmed on ${new Date(event.confirmedAt).toLocaleString()}` : 'Click to confirm attendance'}
                      >
                        {confirming === event.id ? 'Processing...' : 
                         event.confirmed ? 'Confirmed' : 'Confirm Attendance'}
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
          <div className="empty-state-icon">📅</div>
          <p>No events available to browse.</p>
        </div>
      )}
      
      {/* Debug panel - only shows in development */}
      <DebugPanel 
        apiUrl={API_URL}
        data={{
          eventsCount: events.length,
          confirmedEventsCount: events.filter(event => event.confirmed).length,
          selectedEvent: selectedEvent,
          apiEndpoints: {
            getAllEvents: `${API_URL}/student/events/`,
            getMyConfirmations: `${API_URL}/student/my_event_confirmations/`,
            createConfirmation: `${API_URL}/student/event_confirmations/`,
            debugEventConfirmation: `${API_URL}/student/event_confirmations/debug/[event_id]`
          }
        }}
        title="Event Debug Info"
      />
      
      {/* Confirmation Modal */}
      {showModal && selectedEvent && (
        <div className="confirmation-modal">
          <div className="confirmation-modal-content event-confirmation-modal">
            <div className="confirmation-modal-header">
              Confirm Attendance: {selectedEvent.title}
            </div>
            <div>
              <p>
                <strong>Date:</strong> {new Date(selectedEvent.start_time).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {new Date(selectedEvent.start_time).toLocaleTimeString()} - {new Date(selectedEvent.end_time).toLocaleTimeString()}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <div className="form-group">
                <label className="form-label">Add a note (optional):</label>
                <textarea 
                  className="form-textarea"
                  value={confirmationNote}
                  onChange={(e) => setConfirmationNote(e.target.value)}
                  placeholder="Any additional information..."
                ></textarea>
              </div>
            </div>
            <div className="confirmation-modal-footer">
              <button onClick={closeConfirmationModal} className="btn btn-outline-primary">
                Cancel
              </button>
              <button 
                onClick={handleConfirm} 
                className="btn btn-primary"
                disabled={confirming === selectedEvent.id}
              >
                {confirming === selectedEvent.id ? 'Confirming...' : 'Confirm Attendance'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;
