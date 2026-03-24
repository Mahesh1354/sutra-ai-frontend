export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new AppError(data.error || 'Bad request', status);
      case 401:
        return new AppError('Session expired. Please login again.', status);
      case 403:
        return new AppError('You don\'t have permission to perform this action.', status);
      case 404:
        return new AppError('Resource not found.', status);
      case 429:
        return new AppError('Too many requests. Please try again later.', status);
      case 500:
        return new AppError('Server error. Please try again later.', status);
      default:
        return new AppError(data.error || 'An error occurred', status);
    }
  } else if (error.request) {
    // Request made but no response
    return new AppError('Network error. Please check your connection.', 0);
  } else {
    // Something else happened
    return new AppError(error.message || 'An unexpected error occurred', 0);
  }
};

export const showErrorToast = (error, toast) => {
  const appError = handleApiError(error);
  toast.error(appError.message);
  return appError;
};