/**
 * Toast notification messages
 */

export const toastMessages = {
  // Todo messages
  todo: {
    created: '✅ Task created successfully!',
    updated: '✏️ Task updated successfully!',
    deleted: '🗑️ Task deleted successfully!',
    completed: '✅ Task marked as completed!',
    pending: '⏳ Task marked as pending!',
    
    // Error messages
    createError: (error: string) => `❌ Failed to create task: ${error}`,
    updateError: (error: string) => `❌ Failed to update task: ${error}`,
    deleteError: (error: string) => `❌ Failed to delete task: ${error}`,
    toggleError: (error: string) => `❌ Failed to toggle task: ${error}`,
    loadError: (error: string) => `❌ Failed to load tasks: ${error}`,
  },

  // Auth messages
  auth: {
    loginSuccess: (name: string) => `👋 Welcome back, ${name}!`,
    logoutSuccess: '👋 Logged out successfully!',
    loginError: (error: string) => `❌ ${error}`,
    sessionExpired: '🔒 Session expired. Please login again.',
  },

  // Validation messages
  validation: {
    required: (field: string) => `${field} is required`,
    minLength: (field: string, min: number) => 
      `${field} must be at least ${min} characters`,
    maxLength: (field: string, max: number) => 
      `${field} must not exceed ${max} characters`,
    invalid: (field: string) => `Invalid ${field}`,
  },

  // Network messages
  network: {
    offline: '🌐 No internet connection',
    error: '🌐 Network error. Please check your connection.',
    timeout: '⏱️ Request timeout. Please try again.',
    serverError: '⚠️ Server error. Please try again later.',
  },

  // API errors by status code
  apiError: {
    400: (message?: string) => `❌ Bad request${message ? `: ${message}` : ''}`,
    401: '🔒 Unauthorized. Please login again.',
    403: '🚫 Access forbidden.',
    404: '🔍 Resource not found.',
    500: '⚠️ Server error. Please try again later.',
    default: (message: string) => `❌ Error: ${message}`,
  },
};
