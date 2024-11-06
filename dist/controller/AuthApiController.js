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
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOTP = require('../util/OTP').generateOTP;
const setExpirationTime = require('../util/OTP').setExpirationTime;
const sendOTPEmail = require('../util/OTP').sendOTPEmail;
const JWT_SECRET = process.env.JWT_SECRET;
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = generateOTP();
        const otpExpiredAt = setExpirationTime();
        const { name, email, password, phone } = req.body;
        const hashedPassword = yield bcrypt.hash(password, 10);
        const user = new userModel_1.default({ name, email, phone, password: hashedPassword, otp, otp_expired_at: otpExpiredAt });
        yield sendOTPEmail(email, otp);
        yield user.save();
        const token = generateToken(user);
        res.status(200).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        // res.send(await bcrypt.compare(password, user.password))
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const token = generateToken(user);
        res.status(200).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});
const generateToken = (user) => {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30m" });
};
