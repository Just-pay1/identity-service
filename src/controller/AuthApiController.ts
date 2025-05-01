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

import OTPService from "../services/otpService";
const sendOTPEmail = require('../util/OTP').sendOTPEmail;




exports.register = async (req: Request, res: Response) => {
    try {
        const otp = OTPService.generateOTP();
        const otpExpiredAt = OTPService.setExpirationTime();
        const { name, email, password, phone } = req.body;
        const unique = await isEmailUnique(email)
        if (!unique) {
            return res.status(409).json({ error: 'This email address is already registered. Please use a different email or log in.' });
        }

        const otp_hashed = await bcrypt.hash(otp, 10);
        const user = new User({ name, email, phone, password, otp: otp_hashed, otp_expired_at: otpExpiredAt });

        await sendOTPEmail(email, otp);

        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        return res.status(200).json({ user, accessToken, refreshToken });   
    } catch (error) {
        return res.status(500).json({ error: 'Registration failed' });
    }
}




exports.login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid Email or Password' });
        }

        // res.send(await bcrypt.compare(password, user.password))
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid Email or Password' });
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
    if (!refreshToken) return res.status(402).json({ error: 'Refresh token required' });

    try{
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {id : string};
        const user = await User.findByPk(decoded.id)
        if (!user) return res.status(402).json({ error: 'Invalid refresh token' });
        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(402).json({ error: 'Invalid or expired refresh token' });
    }
}

// const generateAccessToken = (user : any) => {
//     return jwt.sign({ id: user.id }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
// }

const generateAccessToken = (user: any) => {
    console.log(user.id)

    return jwt.sign(
        {
            user_id: user.id ,
            username: "static_username",
            iss: "identity", // 👈 This must match the `key` in your Kong config
            exp: Math.floor(Date.now() / 1000) + 60 * 60 
        },
        JWT_ACCESS_SECRET,
        {
            algorithm: "HS256"
        }
    );
};

const generateRefreshToken = (user : any) => {
    return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME });
}

const isEmailUnique = async(email : string) => {
    try {
        const user = await User.findOne({ 
            where: { email: email}
        });
        if (!user) {
            return true;
        }
        if(user.otp !== null ) {
            await user.destroy();
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error checking email uniqueness:', error);
        throw new Error('Failed to check email uniqueness');
    }
    
    
}

exports.forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Generate OTP
        const otp = OTPService.generateOTP();
        const otpExpiredAt = OTPService.setExpirationTime();
        const otp_hashed = await bcrypt.hash(otp, 10);

        // Save OTP in user record
        await user.update({ otp: otp_hashed, otp_expired_at: otpExpiredAt });

        // Send OTP to email
        await sendOTPEmail(user.email, otp);

        return res.status(200).json({ message: 'OTP sent successfully for password reset' });

    } catch (error) {
        console.error('Error in forgetPassword:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.resetPassword = async (req: Request, res: Response) => {


    const userId = req.userId;   
    const {newPassword, confirmedPassword} = req.body;

    try {
        if (newPassword !== confirmedPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        const user = await User.findOne({where :{id : userId}});
     
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(newPassword, user.password);
        if (passwordMatch) {
            return res.status(400).json({ error: "New password must be different to the old password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.update({ password: hashedPassword});

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
    

}




//     } catch (error: any) {
//         console.error("Registration error:", error);
//         res.status(500).json({ error: "Registration failed", details: error.message });
//     }