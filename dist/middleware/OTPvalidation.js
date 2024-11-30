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
const User = require('../models/userModel');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
exports.verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { otp } = req.body;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    console.log(accessToken);
    if (!accessToken) {
        return res.status(400).json({ error: 'Access token is required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, JWT_ACCESS_SECRET);
        const userId = decoded.id;
        console.log(userId);
        if (!userId) {
            return res.status(400).json({ error: 'user ID not found' });
        }
        const user = yield User.findOne({ where: { id: userId } });
        console.log({ otp, userOtp: user === null || user === void 0 ? void 0 : user.otp, otpExpiredAt: user === null || user === void 0 ? void 0 : user.otp_expired_at });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        if (user.otp !== otp) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }
        if (new Date() > user.otp_expired_at) {
            return res.status(401).json({ error: 'OTP expired' });
        }
        user.otp = null;
        user.otp_expired_at = null;
        yield user.save();
        res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'verification failed' });
    }
});
