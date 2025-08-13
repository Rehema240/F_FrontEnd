import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getCalendarEvents = () => {
  return axios.get(`${API_URL}/calendar`);
};

const getDashboardStats = () => {
  return axios.get(`${API_URL}/dashboard`);
};

const getEvents = () => {
  return axios.get(`${API_URL}/events`);
};

const createEvent = (eventData) => {
  return axios.post(`${API_URL}/events`, eventData);
};

const getEventById = (id) => {
  return axios.get(`${API_URL}/events/${id}`);
};

const updateEvent = (id, eventData) => {
  return axios.put(`${API_URL}/events/${id}`, eventData);
};

const partialUpdateEvent = (id, eventData) => {
  return axios.patch(`${API_URL}/events/${id}`, eventData);
};

const deleteEvent = (id) => {
  return axios.delete(`${API_URL}/events/${id}`);
};

const getOpportunities = () => {
  return axios.get(`${API_URL}/opportunities`);
};

const createOpportunity = (opportunityData) => {
  return axios.post(`${API_URL}/opportunities`, opportunityData);
};

const getOpportunityById = (id) => {
  return axios.get(`${API_URL}/opportunities/${id}`);
};

const updateOpportunity = (id, opportunityData) => {
  return axios.put(`${API_URL}/opportunities/${id}`, opportunityData);
};

const partialUpdateOpportunity = (id, opportunityData) => {
  return axios.patch(`${API_URL}/opportunities/${id}`, opportunityData);
};

const deleteOpportunity = (id) => {
  return axios.delete(`${API_URL}/opportunities/${id}`);
};

const employeeService = {
  getCalendarEvents,
  getDashboardStats,
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  partialUpdateEvent,
  deleteEvent,
  getOpportunities,
  createOpportunity,
  getOpportunityById,
  updateOpportunity,
  partialUpdateOpportunity,
  deleteOpportunity,
};

export default employeeService;
