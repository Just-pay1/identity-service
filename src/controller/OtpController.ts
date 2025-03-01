import { Request, Response } from 'express';
import User from '../models/userModel';
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import OTPService from "../services/otpService";
require('dotenv').config();

const sendOTPEmail = require('../util/OTP').sendOTPEmail;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_secret';

exports.verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp, flow } = req.body;
        // console.log("Request body:", req.body);

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check OTP expiration
        if (!user.otp || !user.otp_expired_at || user.otp_expired_at.getTime() < Date.now()) {
            return res.status(401).json({ error: 'OTP expired or invalid. Please request a new one.' });
        }

        // Compare OTP
        const isOtpCorrect = await bcrypt.compare(otp, user.otp);
        if (!isOtpCorrect) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }

        // ✅ Handle Reset Password Flow
        if (flow === 'reset_password') {
            const resetToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_ACCESS_SECRET,
                { expiresIn: '15m' } // Reset token expires in 15 min
            );

            // ✅ Clear OTP to prevent reuse
            await user.update({ otp: null, otp_expired_at: null });

            return res.status(221).json({ message: 'OTP verified. Use this token to reset your password.', resetToken });
        }

        // ✅ Handle Normal Register Flow
        await user.update({ otp: null, otp_expired_at: null });

        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.resendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const otp = OTPService.generateOTP();
        const otpExpiredAt = OTPService.setExpirationTime();
        const otp_hashed = await bcrypt.hash(otp, 10);

        // Update OTP
        await user.update({ otp: otp_hashed, otp_expired_at: otpExpiredAt });

        // Send OTP via email
        await sendOTPEmail(user.email, otp);
        return res.status(200).json({ message: 'The OTP has been resent successfully' });
    } catch (error) {
        console.error('Error Resending OTP:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


