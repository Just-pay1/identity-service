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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOtpMiddleware = void 0;
const User = require('../models/userModel');
require('dotenv').config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
// declare module 'express' {
//   export interface Request {
//     userId?: string; 
//   }
// }
const validateOtpMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing from the request.' });
        }
        const user = yield User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        if (user.otp === null && user.otp_expired_at === null) {
            return next();
        }
        return res.status(403).json({
            error: 'OTP validation required or has expired.',
        });
    }
    catch (error) {
        console.error('Error in OTP validation middleware:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Internal server error during OTP validation.' });
    }
});
exports.validateOtpMiddleware = validateOtpMiddleware;
exports.default = exports.validateOtpMiddleware;
