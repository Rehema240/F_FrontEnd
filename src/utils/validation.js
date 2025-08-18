/**
 * Utility functions for validation and data formatting.
 */

/**
 * Validates if a string is a properly formatted UUID.
 * @param {string} str - The string to check
 * @returns {boolean} True if valid UUID, false otherwise
 */
export const isValidUUID = (str) => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return str && typeof str === 'string' && uuidPattern.test(str);
};

/**
 * Ensures the provided ID is in a valid UUID format.
 * If it's already valid, returns as is. Otherwise tries to fix common issues.
 * 
 * @param {string|number} id - The ID to normalize
 * @returns {string} A normalized UUID or the original ID if can't be fixed
 */
export const normalizeUUID = (id) => {
  // If already valid, return as is
  if (isValidUUID(id)) {
    return id;
  }
  
  // Convert to string if it's a number
  const strId = String(id);
  
  // Handle UUIDs without dashes
  if (/^[0-9a-f]{32}$/i.test(strId)) {
    return `${strId.slice(0, 8)}-${strId.slice(8, 12)}-${strId.slice(12, 16)}-${strId.slice(16, 20)}-${strId.slice(20)}`;
  }
  
  // For now, return the original if we can't normalize it
  return strId;
};

/**
 * Formats a date string or object into a human-readable format
 * @param {string|Date} dateValue - The date to format
 * @param {object} options - Formatting options for toLocaleDateString/toLocaleTimeString
 * @returns {string} Formatted date string
 */
export const formatDate = (dateValue, options = {}) => {
  if (!dateValue) return 'N/A';
  
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString(undefined, options);
  } catch (err) {
    console.error('Error formatting date:', err);
    return String(dateValue);
  }
};

/**
 * Formats a date-time string or object into a human-readable format
 * @param {string|Date} dateTimeValue - The datetime to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateTimeValue, options = {}) => {
  if (!dateTimeValue) return 'N/A';
  
  try {
    const date = typeof dateTimeValue === 'string' ? new Date(dateTimeValue) : dateTimeValue;
    return date.toLocaleString(undefined, options);
  } catch (err) {
    console.error('Error formatting datetime:', err);
    return String(dateTimeValue);
  }
};

/**
 * Truncates text to a specific length with ellipsis
 * @param {string} text - Text to truncate 
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default {
  isValidUUID,
  normalizeUUID,
  formatDate,
  formatDateTime,
  truncateText
};