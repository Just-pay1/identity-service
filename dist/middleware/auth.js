"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(req, res, next) {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey)
        throw new Error('JWT secret key is missing');
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer <token>
    if (!token)
        return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
exports.default = verifyToken;
