import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getConfirmedStudents = () => {
  return axios.get(`${API_URL}/admin/students_confirmed_for_any_event/`);
};

// Employee related functions (these seem to be for admin managing employees, keeping them for now)
const getEmployees = () => {
  return axios.get(`${API_URL}/admin/employees/`);
};

const createEmployee = (employeeData) => {
  return axios.post(`${API_URL}/admin/employees/`, employeeData);
};

const getEmployeeById = (id) => {
  return axios.get(`${API_URL}/admin/employees/${id}`);
};

const updateEmployee = (id, employeeData) => {
  return axios.put(`${API_URL}/admin/employees/${id}`, employeeData);
};

const partialUpdateEmployee = (id, employeeData) => {
  return axios.patch(`${API_URL}/admin/employees/${id}`, employeeData);
};

const deleteEmployee = (id) => {
  return axios.delete(`${API_URL}/admin/employees/${id}`);
};

// Event related functions
const getAllEvents = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/admin/events/all`, { params: { skip, limit } });
};

const createEvent = (eventData) => {
  return axios.post(`${API_URL}/admin/events/`, eventData);
};

const getEventById = (id) => {
  return axios.get(`${API_URL}/admin/events/${id}`);
};

const updateEvent = (id, eventData) => {
  return axios.put(`${API_URL}/admin/events/${id}`, eventData);
};

const partialUpdateEvent = (id, eventData) => {
  return axios.patch(`${API_URL}/admin/events/${id}`, eventData);
};

const deleteEvent = (id) => {
  return axios.delete(`${API_URL}/admin/events/${id}`);
};

// Opportunity related functions
const getAllOpportunities = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/admin/opportunities/all`, { params: { skip, limit } });
};

const createOpportunity = (opportunityData) => {
  return axios.post(`${API_URL}/admin/opportunities/`, opportunityData);
};

const updateOpportunity = (id, opportunityData) => {
  return axios.put(`${API_URL}/admin/opportunities/${id}`, opportunityData);
};

const deleteOpportunity = (id) => {
  return axios.delete(`${API_URL}/admin/opportunities/${id}`);
};

// Notification related functions
const createNotification = (notificationData) => {
  return axios.post(`${API_URL}/admin/notifications/`, notificationData);
};

const deleteNotification = (id) => {
  return axios.delete(`${API_URL}/admin/notifications/${id}`);
};

// User related functions (already updated)
const createUser = (userData) => {
  return axios.post(`${API_URL}/admin/users/`, userData);
};

const getUsers = (skip = 0, limit = 100) => {
  return axios.get(`${API_URL}/admin/users/`, { params: { skip, limit } });
};

const getUserById = (userId) => {
  return axios.get(`${API_URL}/admin/users/${userId}`);
};

const updateUser = (userId, userData) => {
  return axios.put(`${API_URL}/admin/users/${userId}`, userData);
};

const deleteUser = (userId) => {
  return axios.delete(`${API_URL}/admin/users/${userId}`);
};

const getDashboardStats = () => {
  return axios.get(`${API_URL}/admin/dashboard`);
};

const adminService = {
  getDashboardStats,
  getConfirmedStudents,
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  partialUpdateEmployee,
  deleteEmployee,
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  partialUpdateEvent,
  deleteEvent,
  getAllOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  createNotification,
  deleteNotification,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default adminService;
