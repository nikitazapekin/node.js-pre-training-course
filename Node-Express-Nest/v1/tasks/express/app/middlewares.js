 
const metrics = {
  totalRequests: 0,
  totalResponseTime: 0,
  requestsByMethod: {},
  requestsByPath: {},
  startTime: new Date().toISOString()
};

function getMetrics() {
  const avgResponseTime = metrics.totalRequests > 0 
    ? metrics.totalResponseTime / metrics.totalRequests 
    : 0;
  return {
    ...metrics,
    averageResponseTime: parseFloat(avgResponseTime.toFixed(2))
  };
}

function resetMetrics() {
  metrics.totalRequests = 0;
  metrics.totalResponseTime = 0;
  metrics.requestsByMethod = {};
  metrics.requestsByPath = {};
  metrics.startTime = new Date().toISOString();
}
 
function loggerMiddleware(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[LOGGER] ${timestamp} - ${req.method} ${req.originalUrl}`);
  next();
}
 
function timerMiddleware(req, res, next) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[TIMER] ${req.method} ${req.originalUrl} completed in ${duration}ms`);
  });
  
  next();
}
  
function customHeaderInjectorMiddleware(req, res, next) {
  res.setHeader('X-Custom-Header', 'Express-Todo-App');
  res.setHeader('X-Request-ID', generateRequestId());
  res.setHeader('X-Timestamp', new Date().toISOString());
  console.log(`[HEADER INJECTOR] Added custom headers to ${req.method} ${req.originalUrl}`);
  next();
}

function generateRequestId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
 
function requestLoggingMiddleware(req, res, next) {
  const startTime = Date.now();
  const logId = generateRequestId();
  
  console.log(`\n[REQUEST LOG] ${logId}`);
  console.log(`  Method: ${req.method}`);
  console.log(`  URL: ${req.originalUrl}`);
  console.log(`  IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`  User-Agent: ${req.get('User-Agent') || 'Unknown'}`);
  console.log(`  Body: ${JSON.stringify(req.body) || 'empty'}`);
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[RESPONSE LOG] ${logId} - Status: ${res.statusCode}, Duration: ${duration}ms`);
  });
  
  next();
}
 
function metricsTrackingMiddleware(req, res, next) {
  const startTime = Date.now();
   
  metrics.totalRequests++;
   
  metrics.requestsByMethod[req.method] = (metrics.requestsByMethod[req.method] || 0) + 1;
   
  const normalizedPath = req.path.replace(/\/\d+/g, '/:id');
  metrics.requestsByPath[normalizedPath] = (metrics.requestsByPath[normalizedPath] || 0) + 1;
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    metrics.totalResponseTime += duration;
  });
  
  next();
}
 
function sequenceLoggerMiddleware(req, res, next) {
  if (!req.middlewareSequence) {
    req.middlewareSequence = [];
  }
  req.middlewareSequence.push('sequenceLogger');
  console.log(`[SEQUENCE] Current middleware chain: ${req.middlewareSequence.join(' -> ')}`);
  next();
}

module.exports = {
  loggerMiddleware,
  timerMiddleware,
  customHeaderInjectorMiddleware,
  requestLoggingMiddleware,
  metricsTrackingMiddleware,
  sequenceLoggerMiddleware,
  getMetrics,
  resetMetrics
};
