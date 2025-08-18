import { isValidUUID, normalizeUUID } from '../utils/validation';
import axios from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL;

const getDashboardStats = () => {
  return axios.get(`${API_URL}/student/dashboard/`);
};

const getMyConfirmations = () => {
  return axios.get(`${API_URL}/student/dashboard/my_confirmations/`);
};

const getMe = () => {
  return axios.get(`${API_URL}/student/me/`);
};

const updateMe = (data) => {
  return axios.put(`${API_URL}/student/me/`, data);
};

const getEvents = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/student/events/`, { params: { skip, limit } });
};

const getEvent = (eventId) => {
  return axios.get(`${API_URL}/student/events/${eventId}`);
};

const getEventsForCalendar = (startTime, endTime) => {
  return axios.get(`${API_URL}/student/events/calendar_view/`, {
    params: {
      start_time: startTime,
      end_time: endTime,
    },
  });
};

const getOpportunities = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/student/opportunities/`, { params: { skip, limit } });
};

const getOpportunity = (opportunityId) => {
  return axios.get(`${API_URL}/student/opportunities/${opportunityId}`);
};

const createEventConfirmation = (data) => {
  // The API expects a clean payload with exact fields matching the schema
  // According to docs: { "note": "string", "event_id": "UUID", "status": "confirmed" }
  
  // Log request attempt with full details for debugging
  console.log('=== EVENT CONFIRMATION DEBUG ===');
  console.log('Raw input data:', data);
  console.log('event_id type:', typeof data.event_id);
  console.log('event_id value:', data.event_id);
  
  // Try to ensure the event_id is a valid UUID
  let eventId = data.event_id;
  
  // Check if it's a valid UUID format
  if (!isValidUUID(eventId)) {
    console.warn('Warning: Event ID is not in valid UUID format, attempting to normalize...');
    
    // Try to normalize to a proper UUID format
    const normalizedId = normalizeUUID(eventId);
    console.log('Normalized ID:', normalizedId);
    console.log('Is normalized ID a valid UUID?', isValidUUID(normalizedId));
    
    if (isValidUUID(normalizedId)) {
      eventId = normalizedId;
      console.log('Successfully normalized event ID to valid UUID format');
    } else {
      console.warn('Could not normalize to a valid UUID format, proceeding with original ID');
    }
  }
  
  // Create a clean payload object
  const payload = {
    event_id: eventId,
    status: 'confirmed' // Default to 'confirmed' as per the API docs
  };
  
  // Only add note if it exists and is not empty
  if (data.note && data.note.trim() !== '') {
    payload.note = data.note.trim();
  }
  
  console.log('Final event confirmation payload:', payload);
  console.log('Request URL:', `${API_URL}/student/event_confirmations/`);
  
  // Enhanced Axios request with interceptors to log more details
  const requestInterceptor = axios.interceptors.request.use(
    config => {
      console.log('Request headers:', config.headers);
      return config;
    },
    error => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );
  
  const responsePromise = axios.post(`${API_URL}/student/event_confirmations/`, payload)
    .then(response => {
      console.log('Event confirmation success:', response.status, response.data);
      return response;
    })
    .catch(error => {
      console.error('Event confirmation error:', error);
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        console.error('Error data:', error.response.data);
        
        // Specific handling for common errors
        if (error.response.status === 422) {
          console.error('Validation error - check that event_id is a valid UUID and all fields match API expectations');
        } else if (error.response.status === 409) {
          console.warn('Conflict error - the event might already be confirmed');
        } else if (error.response.status === 403) {
          console.error('Authentication or permission error - check user token and permissions');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        console.warn('This could indicate a network issue or server is down');
      } else {
        console.error('Error setting up request:', error.message);
      }
      return Promise.reject(error);
    })
    .finally(() => {
      // Clean up interceptor to avoid memory leaks
      axios.interceptors.request.eject(requestInterceptor);
      console.log('=== END EVENT CONFIRMATION DEBUG ===');
    });
  
  return responsePromise;
};

const getMyEventConfirmations = () => {
  return axios.get(`${API_URL}/student/my_event_confirmations/`);
};

const debugEventConfirmation = (eventId) => {
  return axios.get(`${API_URL}/student/event_confirmations/debug/${eventId}`);
};

const getNotifications = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/student/notifications/`, { params: { skip, limit } });
};

const getNotification = (notificationId) => {
  return axios.get(`${API_URL}/student/notifications/${notificationId}`);
};

const markNotificationAsRead = (notificationId) => {
  return axios.put(`${API_URL}/student/notifications/${notificationId}/read`);
};

// Additional functions for updated components
const getMyProfile = () => {
  return axios.get(`${API_URL}/student/profile/`);
};

const updateProfile = (data) => {
  return axios.put(`${API_URL}/student/profile/`, data);
};

const getMyNotifications = () => {
  return axios.get(`${API_URL}/student/my_notifications/`);
};

const getOpportunityDetails = (opportunityId) => {
  return axios.get(`${API_URL}/student/opportunities/${opportunityId}/details/`);
};

const applyForOpportunity = (opportunityId, data) => {
  return axios.post(`${API_URL}/student/opportunities/${opportunityId}/apply/`, data);
};

const getMyApplications = () => {
  return axios.get(`${API_URL}/student/my_applications/`);
};

const studentService = {
  getDashboardStats,
  getMyConfirmations,
  getMe,
  updateMe,
  getEvents,
  getEvent,
  getEventsForCalendar,
  getOpportunities,
  getOpportunity,
  createEventConfirmation,
  getMyEventConfirmations,
  debugEventConfirmation,
  getNotifications,
  getNotification,
  markNotificationAsRead,
  
  // Additional exports
  getMyProfile,
  updateProfile,
  getMyNotifications,
  getOpportunityDetails,
  applyForOpportunity,
  getMyApplications
};

export default studentService;
