 
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}
 
function errorHandler(err, req, res, next) {
  console.error(`[ERROR HANDLER] ${new Date().toISOString()}`);
  console.error(`  Status: ${err.status || 500}`);
  console.error(`  Message: ${err.message}`);
  console.error(`  Stack: ${err.stack}`);
  
  const status = err.status || 500;
  const response = {
    status: status,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  };
   
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  
  res.status(status).json(response);
}
 
function notFoundHandler(req, res, next) {
  const err = new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`);
  next(err);
}
 
function createValidationError(message) {
  return new ApiError(400, message || 'Validation failed');
}
 
function createNotFoundError(message) {
  return new ApiError(404, message || 'Resource not found');
}
 
function createServerError(message) {
  return new ApiError(500, message || 'Internal server error');
}

module.exports = {
  errorHandler,
  notFoundHandler,
  ApiError,
  createValidationError,
  createNotFoundError,
  createServerError
};
