import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getNotifications = () => {
  return axios.get(`${API_URL}/notifications`);
};

const getEventApplication = (id) => {
  return axios.get(`${API_URL}/applications/${id}/confirm`);
};

const updateEventApplication = (id, data) => {
  return axios.put(`${API_URL}/applications/${id}/confirm`, data);
};

const partialUpdateEventApplication = (id, data) => {
  return axios.patch(`${API_URL}/applications/${id}/confirm`, data);
};

const getCalendarEvents = () => {
  return axios.get(`${API_URL}/calendar`);
};

const getDashboardStats = () => {
  return axios.get(`${API_URL}/dashboard`);
};

const getEvents = () => {
  return axios.get(`${API_URL}/events`);
};

const confirmEvent = (data) => {
  return axios.post(`${API_URL}/events/confirm`, data);
};

const subscribeToNotifications = () => {
  return axios.post(`${API_URL}/notifications/subscribe`);
};

const getOpportunities = () => {
  return axios.get(`${API_URL}/opportunities`);
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

const getOpportunity = (opportunityId) => {
  return axios.get(`${API_URL}/student/opportunities/${opportunityId}`);
};

const createEventConfirmation = (data) => {
  return axios.post(`${API_URL}/student/event_confirmations/`, data);
};

const getMyEventConfirmations = () => {
  return axios.get(`${API_URL}/student/my_event_confirmations/`);
};

const getNotification = (notificationId) => {
  return axios.get(`${API_URL}/student/notifications/${notificationId}`);
};

const markNotificationAsRead = (notificationId) => {
  return axios.put(`${API_URL}/student/notifications/${notificationId}/read`);
};

const studentService = {
  getNotifications,
  getEventApplication,
  updateEventApplication,
  partialUpdateEventApplication,
  getCalendarEvents,
  getDashboardStats,
  getEvents,
  confirmEvent,
  subscribeToNotifications,
  getOpportunities,
  getMyConfirmations,
  getMe,
  updateMe,
  getEvent,
  getEventsForCalendar,
  getOpportunity,
  createEventConfirmation,
  getMyEventConfirmations,
  getNotification,
  markNotificationAsRead,
};

const createNotification = (data) => {
  return axios.post(`${API_URL}/student/notifications/`, data);
};

export default studentService;
