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
  
  // Create a clean payload object that EXACTLY matches API expectations
  // Based on API docs: /student/event_confirmations/
  const payload = {
    event_id: data.event_id,
    status: "confirmed" // Use exactly "confirmed" as per API spec
  };
  
  // Only add note if it exists and is not empty
  // Note is optional according to API schema
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
          console.error('Validation error - check payload format:');
          console.error('Required format: { "note": "string", "event_id": "UUID", "status": "confirmed" }');
          console.error('Sent payload:', payload);
          
          // Print out detailed validation errors if available
          if (error.response.data?.detail) {
            console.error('Validation details:', error.response.data.detail);
          }
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

const getNotifications = (skip = 0, limit = 100, unreadOnly = false, notificationType = null) => {
  const params = { 
    skip, 
    limit,
    unread_only: unreadOnly
  };
  
  if (notificationType) {
    params.notification_type = notificationType;
  }
  
  return axios.get(`${API_URL}/student/notifications/`, { params });
};

const getNotification = (notificationId) => {
  return axios.get(`${API_URL}/student/notifications/${notificationId}`);
};

const markNotificationAsRead = (notificationId) => {
  return axios.put(`${API_URL}/student/notifications/${notificationId}/read`);
};

const getUnreadNotificationCount = () => {
  return axios.get(`${API_URL}/student/notifications/unread_count`);
};

const markAllNotificationsAsRead = () => {
  return axios.put(`${API_URL}/student/notifications/mark_all_read`);
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
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  
  // Additional exports
  getMyProfile,
  updateProfile,
  getMyNotifications,
  getOpportunityDetails,
  applyForOpportunity,
  getMyApplications
};

export default studentService;
