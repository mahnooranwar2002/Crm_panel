export function handleApiError(error: { response: { data: { message: any; statusCode: any; }; }; request: any; message: any; }) {
  if (error.response) {
    // Response received with error status
    const { message, statusCode } = error.response.data;
    console.error(`[${statusCode}] ${message}`);
    return message;
  } else if (error.request) {
    // No response received
    console.error('No response from server');
    return 'Network error. Please check your connection.';
  } else {
    // Request setup error
    console.error('Error:', error.message);
    return error.message;
  }
}
