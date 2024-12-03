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

const generateOTP = require('../controller/OtpController').generateOTP;
const setExpirationTime = require('../controller/OtpController').setExpirationTime;
const sendOTPEmail = require('../util/OTP').sendOTPEmail;




exports.register = async (req: Request, res: Response) => {
    try {
        const otp = generateOTP();
        const otpExpiredAt = setExpirationTime();
        const { name, email, password, phone } = req.body;
        const unique = await isEmailUnique(email)
        if (!unique) {
            return res.status(409).json({ error: 'This email address is already registered. Please use a different email or log in.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp_hashed = await bcrypt.hash(otp, 10);
        const user = new User({ name, email, phone, password: hashedPassword, otp: otp_hashed, otp_expired_at: otpExpiredAt });

        await sendOTPEmail(email, otp);

        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        return res.status(200).json({ user, accessToken, refreshToken });   
    } catch (error) {
        return res.status(500).json({ error: 'Registration failed' });
    }
}


//         const accessToken = generateAccessToken(user);
//         const refreshToken = generateRefreshToken(user);
//         res.set('Authorization', `Bearer ${accessToken}`);
//         res.status(200).json({ user, refreshToken });
//     } catch (error: any) {
//         console.error("Registration error:", error);
//         res.status(500).json({ error: "Registration failed", details: error.message });
//     }
// };

exports.login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
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

// exports.refreshToken = async (req: Request, res: Response) => {
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

//     try {
//         const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };
//         const user = await User.findByPk(decoded.id)
//         if (!user) return res.status(401).json({ error: 'Invalid refresh token' });
//         const newAccessToken = generateAccessToken(user);
//         res.status(200).json({ accessToken: newAccessToken });
//     } catch (error) {
//         res.status(401).json({ error: 'Invalid or expired refresh token' });
//     }
// }


// const generateAccessToken = (user: any) => {
//     return jwt.sign({ id: user.id }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
// }
// const generateRefreshToken = (user: any) => {
//     return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME });
// }

// const isEmailUnique = async (email: string) => {
//     const user = await User.findOne({
//         where: { email: email }
//     });
//     return !user;
// }

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

const generateAccessToken = (user : any) => {
    return jwt.sign({ id: user.id }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
}
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


// const express = require('express');
// const jwt = require('jsonwebtoken');

// const app = express();
// app.use(express.json()); // Middleware to parse JSON request bodies

// const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret'; // Replace with your actual refresh token secret
// const ACCESS_TOKEN_SECRET = 'your-access-token-secret'; // Replace with your actual access token secret

// app.post("/refresh", (req, res) => {
//   const oldToken = req.body.refreshToken; // Get the refresh token from the request body

//   if (!oldToken) {
//     return res.status(406).json({
//       success: false,
//       message: "Unauthorized",
//     });
//   }

//   jwt.verify(oldToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       // Invalid token
//       return res.status(406).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const userId = decoded.id;

//     // Token is valid, send a new access token
//     const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
//       expiresIn: "1m",
//     });

//     return res.json({
//       success: true,
//       data: {
//         accessToken,
//       },
//     });
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

