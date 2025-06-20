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
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt = require('bcrypt');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otpService_1 = __importDefault(require("../services/otpService"));
require('dotenv').config();
const sendOTPEmail = require('../util/OTP').sendOTPEmail;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
exports.verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, flow } = req.body;
        // console.log("Request body:", req.body);
        const user = yield userModel_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check OTP expiration
        if (!user.otp || !user.otp_expired_at || user.otp_expired_at.getTime() < Date.now()) {
            return res.status(401).json({ error: 'OTP expired or invalid. Please request a new one.' });
        }
        // Compare OTP
        const isOtpCorrect = yield bcrypt.compare(otp, user.otp);
        if (!isOtpCorrect) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }
        // ✅ Handle Reset Password Flow
        if (flow === 'reset_password') {
            const resetToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_ACCESS_SECRET, { expiresIn: '15m' } // Reset token expires in 15 min
            );
            // ✅ Clear OTP to prevent reuse
            yield user.update({ otp: null, otp_expired_at: null });
            return res.status(221).json({ message: 'OTP verified. Use this token to reset your password.', resetToken });
        }
        // ✅ Handle Normal Register Flow
        yield user.update({ otp: null, otp_expired_at: null });
        return res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModel_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const otp = otpService_1.default.generateOTP();
        const otpExpiredAt = otpService_1.default.setExpirationTime();
        const otp_hashed = yield bcrypt.hash(otp, 10);
        // Update OTP
        yield user.update({ otp: otp_hashed, otp_expired_at: otpExpiredAt });
        // Send OTP via email
        yield sendOTPEmail(user.email, otp);
        return res.status(200).json({ message: 'The OTP has been resent successfully' });
    }
    catch (error) {
        console.error('Error Resending OTP:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
