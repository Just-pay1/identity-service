import express from 'express';
const router = express.Router();
const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'justpay-identity-service'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Custom metrics for JustPay application
const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
});

const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    registers: [register]
});

const activeUsers = new client.Gauge({
    name: 'active_users_total',
    help: 'Total number of active users',
    registers: [register]
});

const databaseConnections = new client.Gauge({
    name: 'database_connections_active',
    help: 'Number of active database connections',
    registers: [register]
});

const otpRequests = new client.Counter({
    name: 'otp_requests_total',
    help: 'Total number of OTP requests',
    labelNames: ['type'],
    registers: [register]
});

const authenticationAttempts = new client.Counter({
    name: 'authentication_attempts_total',
    help: 'Total number of authentication attempts',
    labelNames: ['type', 'status'],
    registers: [register]
});

// Middleware to track HTTP requests
const trackHttpRequests = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        
        httpRequestsTotal.inc({
            method: req.method,
            route: req.route?.path || req.path,
            status_code: res.statusCode
        });
        
        httpRequestDuration.observe(
            {
                method: req.method,
                route: req.route?.path || req.path,
                status_code: res.statusCode
            },
            duration
        );
    });
    
    next();
};

// Metrics endpoint
router.get('/metrics', async (req, res) => {
    try {
        // Return all metrics in the Prometheus exposition format
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.send(metrics);
    } catch (error) {
        res.status(500).send('Error retrieving metrics');
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

export {
    register,
    httpRequestsTotal,
    httpRequestDuration,
    activeUsers,
    databaseConnections,
    otpRequests,
    authenticationAttempts,
    trackHttpRequests
};

export default router; 