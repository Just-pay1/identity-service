import { Request, Response } from 'express';
import User from '../models/userModel';
import { where } from 'sequelize';

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME;
const REFRESH_TOKEN_LIFETIME = process.env.REFRESH_TOKEN_LIFETIME;
const generateOTP = require('../util/OTP').generateOTP;
const setExpirationTime = require('../util/OTP').setExpirationTime;
const sendOTPEmail = require('../util/OTP').sendOTPEmail;



exports.register = async (req: Request, res: Response) => {
    try {
        const otp = generateOTP();
        const otpExpiredAt = setExpirationTime();
        const { name, email, password, phone } = req.body;
        const unique = await isEmailUnique(email)
        if (!unique) {
            res.status(409).json({ error: 'This email address is already registered. Please use a different email or log in.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, phone, password: hashedPassword, otp, otp_expired_at: otpExpiredAt });
        
        // sendOTPEmail(email, otp);

        await user.save();
        // res.send('here')

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).json({ user, accessToken, refreshToken });  
    } catch (error: any) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
};

exports.login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({where :{ email}});
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
      
        // res.send(await bcrypt.compare(password, user.password))
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
  
}

exports.refreshToken = async (req : Request, res: Response) => {
    const { refreshToken} = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    try{
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {id : string};
        const user = await User.findByPk(decoded.id)
        if (!user) return res.status(401).json({ error: 'Invalid refresh token' });
        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
}

const generateAccessToken = (user : any) => {
    return jwt.sign({ id: user.id }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
}
const generateRefreshToken = (user : any) => {
    return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME });
}

const isEmailUnique = async(email : string) => {
    const user = await User.findOne({ 
        where: { email: email}
    });
    return !user;
}
