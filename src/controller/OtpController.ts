import { Request, Response } from 'express';
import User from '../models/userModel';
const bcrypt = require('bcrypt');

exports.generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.setExpirationTime = () => {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 15); // OTP valid for 15 minutes
    return expiration;
};


exports.verifyOtp = async(req: Request, res: Response) => {
    try{
        const otp = req.body.otp;
        const user = await User.findOne({ where: { id: req.userId } });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
 
        if (!user.otp || !user.otp_expired_at || user.otp_expired_at.getTime() < Date.now()) {
            return res.status(401).json({ error: 'OTP expired or invalid. Please request a new one.' });
        }
        const isOtpCorrect = await bcrypt.compare(otp, user.otp);
        if (isOtpCorrect) {
            user.otp = null;
            user.otp_expired_at = null; 
            await user.save(); 
            return res.status(200).json({ message: 'OTP verified successfully' });
        }
        return res.status(401).json({ error: 'Invalid OTP' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    
};

