import axios from 'axios';

// Request interceptor - adds auth token and logs requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config);
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - logs responses
axios.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API Error ${error.response.status}: ${error.config.method.toUpperCase()} ${error.config.url}`, error.response.data);
      
      // Handle specific error statuses
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axios;
