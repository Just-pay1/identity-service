import { Request, Response } from "express";
import User from "../models/userModel";
import { where } from "sequelize";
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOTP = require('../util/OTP').generateOTP;
const setExpirationTime = require('../util/OTP').setExpirationTime;
const sendOTPEmail = require('../util/OTP').sendOTPEmail;

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req: Request, res: Response) => {
    try {
        const otp = generateOTP();
        const otpExpiredAt = setExpirationTime();
        const { name, email, password, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, phone, password: hashedPassword, otp, otp_expired_at: otpExpiredAt });
        
        // sendOTPEmail(email, otp);

        await user.save();
        // res.send('here')

        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (error: any) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
};

exports.login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Authentication failed" });
        }

        // res.send(await bcrypt.compare(password, user.password))
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Authentication failed" });
        }

        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};

const generateToken = (user: any) => {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30m" });
};
