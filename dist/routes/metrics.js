"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackHttpRequests = exports.authenticationAttempts = exports.otpRequests = exports.databaseConnections = exports.activeUsers = exports.httpRequestDuration = exports.httpRequestsTotal = exports.register = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const client = require('prom-client');
// Create a Registry which registers the metrics
const register = new client.Registry();
exports.register = register;
// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'justpay-core-app'
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
exports.httpRequestsTotal = httpRequestsTotal;
const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    registers: [register]
});
exports.httpRequestDuration = httpRequestDuration;
const activeUsers = new client.Gauge({
    name: 'active_users_total',
    help: 'Total number of active users',
    registers: [register]
});
exports.activeUsers = activeUsers;
const databaseConnections = new client.Gauge({
    name: 'database_connections_active',
    help: 'Number of active database connections',
    registers: [register]
});
exports.databaseConnections = databaseConnections;
const otpRequests = new client.Counter({
    name: 'otp_requests_total',
    help: 'Total number of OTP requests',
    labelNames: ['type'],
    registers: [register]
});
exports.otpRequests = otpRequests;
const authenticationAttempts = new client.Counter({
    name: 'authentication_attempts_total',
    help: 'Total number of authentication attempts',
    labelNames: ['type', 'status'],
    registers: [register]
});
exports.authenticationAttempts = authenticationAttempts;
// Middleware to track HTTP requests
const trackHttpRequests = (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        var _a, _b;
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        httpRequestsTotal.inc({
            method: req.method,
            route: ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path,
            status_code: res.statusCode
        });
        httpRequestDuration.observe({
            method: req.method,
            route: ((_b = req.route) === null || _b === void 0 ? void 0 : _b.path) || req.path,
            status_code: res.statusCode
        }, duration);
    });
    next();
};
exports.trackHttpRequests = trackHttpRequests;
// Metrics endpoint
router.get('/metrics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Return all metrics in the Prometheus exposition format
        res.set('Content-Type', register.contentType);
        const metrics = yield register.metrics();
        res.send(metrics);
    }
    catch (error) {
        res.status(500).send('Error retrieving metrics');
    }
}));
// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
exports.default = router;
