import axios from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL;

// Fetches events created by the logged-in employee
const getMyEvents = () => {
  return axios.get(`${API_URL}/employee/dashboard/my_events/`);
};

// Fetches the profile of the logged-in employee
const getMe = () => {
  return axios.get(`${API_URL}/employee/me/`);
};

// Updates the profile of the logged-in employee
const updateMe = (employeeData) => {
  return axios.put(`${API_URL}/employee/me/`, employeeData);
};

// Creates a new event
const createEvent = (eventData) => {
  return axios.post(`${API_URL}/employee/events/`, eventData);
};

// Fetches a list of events
const getEvents = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/employee/events/`, { params: { skip, limit } });
};

// Fetches a single event by its ID
const getEventById = (eventId) => {
  return axios.get(`${API_URL}/employee/events/${eventId}`);
};

// Updates an existing event
const updateEvent = (eventId, eventData) => {
  return axios.put(`${API_URL}/employee/events/${eventId}`, eventData);
};

// Deletes an event
const deleteEvent = (eventId) => {
  return axios.delete(`${API_URL}/employee/events/${eventId}`);
};

// Fetches events for the calendar view within a specific time range
const getEventsForCalendar = (start_time, end_time) => {
  return axios.get(`${API_URL}/employee/events/calendar_view/`, { params: { start_time, end_time } });
};

// Fetches a list of opportunities
const getOpportunities = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/employee/opportunities/`, { params: { skip, limit } });
};

// Fetches a single opportunity by its ID
const getOpportunityById = (opportunityId) => {
  return axios.get(`${API_URL}/employee/opportunities/${opportunityId}`);
};

// Fetches the list of confirmations for a specific event
const getEventConfirmations = (eventId) => {
  return axios.get(`${API_URL}/employee/events/${eventId}/confirmations`);
};

// Fetches a list of notifications for the logged-in employee
const getNotifications = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/employee/notifications/`, { params: { skip, limit } });
};

// Fetches a single notification by its ID
const getNotificationById = (notificationId) => {
  return axios.get(`${API_URL}/employee/notifications/${notificationId}`);
};

// Marks a notification as read
const markNotificationAsRead = (notificationId) => {
  return axios.put(`${API_URL}/employee/notifications/${notificationId}/read`);
};

const getDashboardStats = () => {
  return axios.get(`${API_URL}/employee/dashboard`);
};

const employeeService = {
  getDashboardStats,
  getMyEvents,
  getMe,
  updateMe,
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsForCalendar,
  getOpportunities,
  getOpportunityById,
  getEventConfirmations,
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
};

export default employeeService;
