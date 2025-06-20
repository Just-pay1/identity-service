"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authMiddleware = (req, res, next) => {
    const secretKey = process.env.JWT_ACCESS_SECRET;
    // console.log('auth validat')
    if (!secretKey) {
        throw new Error('JWT_SECRET is missing. Please add it to your environment variables.');
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(402).json({ error: 'Access denied. No token provided.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.userId = decoded.user_id;
        // console.log(req.userId)
        // console.log(decoded.id); 
        next();
    }
    catch (error) {
        res.status(402).json({ error: 'Invalid or expired token.' });
    }
};
exports.default = authMiddleware;
