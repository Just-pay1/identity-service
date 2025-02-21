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
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME;
const REFRESH_TOKEN_LIFETIME = process.env.REFRESH_TOKEN_LIFETIME;
const generateOTP = require('../controller/OtpController').generateOTP;
const setExpirationTime = require('../controller/OtpController').setExpirationTime;
const sendOTPEmail = require('../util/OTP').sendOTPEmail;
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = generateOTP();
        const otpExpiredAt = setExpirationTime();
        const { name, email, password, phone } = req.body;
        const unique = yield isEmailUnique(email);
        if (!unique) {
            res.status(409).json({ error: 'This email address is already registered. Please use a different email or log in.' });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const user = new userModel_1.default({ name, email, phone, password: hashedPassword, otp, otp_expired_at: otpExpiredAt });
        yield sendOTPEmail(email, otp);
        yield user.save();
        // res.send('here')
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.set('Authorization', `Bearer ${accessToken}`);
        res.status(200).json({ user, refreshToken });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        // res.send(await bcrypt.compare(password, user.password))
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).json({ user, accessToken, refreshToken });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(401).json({ error: 'Refresh token required' });
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = yield userModel_1.default.findByPk(decoded.id);
        if (!user)
            return res.status(401).json({ error: 'Invalid refresh token' });
        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
});
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME });
};
const isEmailUnique = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({
        where: { email: email }
    });
    return !user;
});
