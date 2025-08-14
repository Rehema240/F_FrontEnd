import axios from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL;

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
  return axios.post(`${API_URL}/student/event_confirmations/`, data);
};

const getMyEventConfirmations = () => {
  return axios.get(`${API_URL}/student/my_event_confirmations/`);
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

const studentService = {
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
  getNotifications,
  getNotification,
  markNotificationAsRead,
};

export default studentService;
