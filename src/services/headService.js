import axios from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL;

const getCalendarEvents = (start_time, end_time) => {
  return axios.get(`${API_URL}/head/events/calendar_view/`, { params: { start_time, end_time } });
};

const getConfirmedStudents = (event_id) => {
  return axios.get(`${API_URL}/head/events/${event_id}/confirmations`);
};

// Function to get dashboard statistics for head department
const getDashboardStats = () => {
  return axios.get(`${API_URL}/head/dashboard`);
};

const getDepartmentUsers = () => {
  return axios.get(`${API_URL}/head/dashboard/department_users/`);
};

const getDepartmentEvents = () => {
  return axios.get(`${API_URL}/head/dashboard/department_events/`);
};

const getDepartmentOpportunities = () => {
  return axios.get(`${API_URL}/head/dashboard/department_opportunities/`);
};

const getEvents = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/head/events/`, { params: { skip, limit } });
};

const createEvent = (eventData) => {
  return axios.post(`${API_URL}/head/events/`, eventData);
};

const getEventById = (id) => {
  return axios.get(`${API_URL}/head/events/${id}`);
};

const updateEvent = (id, eventData) => {
  return axios.put(`${API_URL}/head/events/${id}`, eventData);
};

const deleteEvent = (id) => {
  return axios.delete(`${API_URL}/head/events/${id}`);
};

const getOpportunities = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/head/opportunities/`, { params: { skip, limit } });
};

const createOpportunity = (opportunityData) => {
  return axios.post(`${API_URL}/head/opportunities/`, opportunityData);
};

const getOpportunityById = (id) => {
  return axios.get(`${API_URL}/head/opportunities/${id}`);
};

const updateOpportunity = (id, opportunityData) => {
  return axios.put(`${API_URL}/head/opportunities/${id}`, opportunityData);
};

const deleteOpportunity = (id) => {
  return axios.delete(`${API_URL}/head/opportunities/${id}`);
};

const headService = {
  getCalendarEvents,
  getConfirmedStudents,
  getDashboardStats,
  getDepartmentUsers,
  getDepartmentEvents,
  getDepartmentOpportunities,
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getOpportunities,
  createOpportunity,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
};

export default headService;
