export function handleApiError(error: any) {
  console.error('🔴 API Error Handler - Full error:', error);
  
  if (error.response) {
    // Response received with error status
    const { message, statusCode } = error.response.data;
    console.error(`[${statusCode}] ${message}`);
    return message;
  } else if (error.status) {
    // Modern error with status field
    const statusCode = error.status;
    const message = error.message || `HTTP ${statusCode} Error`;
    console.error(`[${statusCode}] ${message}`);
    
    if (statusCode === 403) {
      return `Access Denied: ${message}. Check that your user account has the required role to perform this action.`;
    } else if (statusCode === 401) {
      return 'Your session has expired. Please log in again.';
    }
    return message;
  } else if (error.request) {
    // No response received
    console.error('No response from server');
    return 'Network error. Please check your connection.';
  } else {
    // Request setup error
    console.error('Error:', error.message);
    return error.message || 'An unexpected error occurred';
  }
}
