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
const metrics_1 = require("../routes/metrics");
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME;
const REFRESH_TOKEN_LIFETIME = process.env.REFRESH_TOKEN_LIFETIME;
const otpService_1 = __importDefault(require("../services/otpService"));
const sendOTPEmail = require('../util/OTP').sendOTPEmail;
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        metrics_1.authenticationAttempts.inc({ type: 'register', status: 'attempt' });
        const otp = otpService_1.default.generateOTP();
        const otpExpiredAt = otpService_1.default.setExpirationTime();
        const { name, email, password, phone } = req.body;
        const unique = yield isEmailUnique(email);
        if (!unique) {
            metrics_1.authenticationAttempts.inc({ type: 'register', status: 'failed' });
            return res.status(409).json({ error: 'This email address is already registered. Please use a different email or log in.' });
        }
        const otp_hashed = yield bcrypt.hash(otp, 10);
        const user = new userModel_1.default({ name, email, phone, password, otp: otp_hashed, otp_expired_at: otpExpiredAt });
        yield sendOTPEmail(email, otp);
        metrics_1.otpRequests.inc({ type: 'registration' });
        yield user.save();
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        metrics_1.authenticationAttempts.inc({ type: 'register', status: 'success' });
        return res.status(200).json({ user, accessToken, refreshToken });
    }
    catch (error) {
        metrics_1.authenticationAttempts.inc({ type: 'register', status: 'error' });
        return res.status(500).json({ error: 'Registration failed' });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        metrics_1.authenticationAttempts.inc({ type: 'login', status: 'attempt' });
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ where: { email } });
        if (!user) {
            metrics_1.authenticationAttempts.inc({ type: 'login', status: 'failed' });
            return res.status(401).json({ error: 'Invalid Email or Password' });
        }
        // res.send(await bcrypt.compare(password, user.password))
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            metrics_1.authenticationAttempts.inc({ type: 'login', status: 'failed' });
            return res.status(401).json({ error: 'Invalid Email or Password' });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        metrics_1.authenticationAttempts.inc({ type: 'login', status: 'success' });
        res.status(200).json({ user, accessToken, refreshToken });
    }
    catch (error) {
        metrics_1.authenticationAttempts.inc({ type: 'login', status: 'error' });
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(402).json({ error: 'Refresh token required' });
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = yield userModel_1.default.findByPk(decoded.id);
        if (!user)
            return res.status(402).json({ error: 'Invalid refresh token' });
        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (error) {
        res.status(402).json({ error: 'Invalid or expired refresh token' });
    }
});
// const generateAccessToken = (user : any) => {
//     return jwt.sign({ id: user.id }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
// }
const generateAccessToken = (user) => {
    // console.log(user.id)
    return jwt.sign({
        user_id: user.id,
        username: "static_username",
        iss: "identity", // 👈 This must match the `key` in your Kong config
        exp: Math.floor(Date.now() / 1000) + 60 * 60
    }, JWT_ACCESS_SECRET, {
        algorithm: "HS256"
    });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME });
};
const isEmailUnique = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({
            where: { email: email }
        });
        if (!user) {
            return true;
        }
        if (user.otp !== null) {
            yield user.destroy();
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('Error checking email uniqueness:', error);
        throw new Error('Failed to check email uniqueness');
    }
});
exports.forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModel_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        // Generate OTP
        const otp = otpService_1.default.generateOTP();
        const otpExpiredAt = otpService_1.default.setExpirationTime();
        const otp_hashed = yield bcrypt.hash(otp, 10);
        // Save OTP in user record
        yield user.update({ otp: otp_hashed, otp_expired_at: otpExpiredAt });
        // Send OTP to email
        yield sendOTPEmail(user.email, otp);
        metrics_1.otpRequests.inc({ type: 'password_reset' });
        return res.status(200).json({ message: 'OTP sent successfully for password reset' });
    }
    catch (error) {
        console.error('Error in forgetPassword:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { newPassword, confirmedPassword } = req.body;
    try {
        if (newPassword !== confirmedPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        const user = yield userModel_1.default.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const passwordMatch = yield bcrypt.compare(newPassword, user.password);
        if (passwordMatch) {
            return res.status(400).json({ error: "New password must be different to the old password" });
        }
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(newPassword, salt);
        user.update({ password: hashedPassword });
        return res.status(200).json({ message: "Password updated successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
});
// Temporary storage for email verification (in production, use Redis or database)
const emailVerificationStore = new Map();
exports.edit_info = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { name, email, phone } = req.body;
    if (!userId) {
        return res.status(401).json({ error: "User ID not found" });
    }
    try {
        const user = yield userModel_1.default.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Check if email is being updated
        if (email && email !== user.email) {
            // Check if new email is already taken by another user
            const existingUser = yield userModel_1.default.findOne({ where: { email } });
            if (existingUser && existingUser.id !== parseInt(userId)) {
                return res.status(409).json({ error: "This email address is already registered by another user" });
            }
            // Generate OTP for email verification
            const otp = otpService_1.default.generateOTP();
            const otpExpiredAt = otpService_1.default.setExpirationTime();
            // Store verification data temporarily
            const verificationId = Math.random().toString(36).substring(2, 15);
            emailVerificationStore.set(verificationId, {
                email,
                otp,
                userId,
                expiresAt: otpExpiredAt
            });
            // Send OTP to new email
            yield sendOTPEmail(email, otp);
            // Update other fields immediately
            const updateData = {};
            if (name)
                updateData.name = name;
            if (phone)
                updateData.phone = phone;
            if (Object.keys(updateData).length > 0) {
                yield user.update(updateData);
            }
            return res.status(200).json({
                message: "Verification code sent to new email address. Please verify to complete email update.",
                verificationId,
                updatedFields: Object.keys(updateData)
            });
        }
        else {
            // No email update, update other fields directly
            const updateData = {};
            if (name)
                updateData.name = name;
            if (phone)
                updateData.phone = phone;
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: "No fields to update" });
            }
            yield user.update(updateData);
            return res.status(200).json({
                message: "User information updated successfully",
                updatedFields: Object.keys(updateData)
            });
        }
    }
    catch (error) {
        console.error('Error in edit_info:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.verify_email_update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verificationId, otp } = req.body;
    try {
        const verificationData = emailVerificationStore.get(verificationId);
        if (!verificationData) {
            return res.status(400).json({ error: "Invalid verification ID" });
        }
        if (new Date() > verificationData.expiresAt) {
            emailVerificationStore.delete(verificationId);
            return res.status(400).json({ error: "Verification code has expired" });
        }
        if (verificationData.otp !== otp) {
            return res.status(400).json({ error: "Invalid verification code" });
        }
        // Update user's email
        const user = yield userModel_1.default.findOne({ where: { id: verificationData.userId } });
        if (!user) {
            emailVerificationStore.delete(verificationId);
            return res.status(404).json({ error: "User not found" });
        }
        yield user.update({ email: verificationData.email });
        // Clean up verification data
        emailVerificationStore.delete(verificationId);
        return res.status(200).json({
            message: "Email updated successfully",
            updatedEmail: verificationData.email
        });
    }
    catch (error) {
        console.error('Error in verify_email_update:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { oldPassword, newPassword, confirmedPassword } = req.body;
    const user = yield userModel_1.default.findOne({ where: { id: userId } });
    const userPassword = user === null || user === void 0 ? void 0 : user.password;
    const passwordMatch = yield bcrypt.compare(oldPassword, userPassword);
    if (!passwordMatch) {
        return res.status(400).json({ error: "Old password is incorrect" });
    }
    if (newPassword === oldPassword) {
        return res.status(400).json({ error: "New password must be different to the old password" });
    }
    if (newPassword !== confirmedPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }
    const salt = yield bcrypt.genSalt(10);
    const hashedPassword = yield bcrypt.hash(newPassword, salt);
    user === null || user === void 0 ? void 0 : user.update({ password: hashedPassword });
    return res.status(200).json({ message: "Password updated successfully" });
});
//     } catch (error: any) {
//         console.error("Registration error:", error);
//         res.status(500).json({ error: "Registration failed", details: error.message });
//     }
