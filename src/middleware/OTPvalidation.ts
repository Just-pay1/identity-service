const User = require('../models/userModel');
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

// declare module 'express' {
//   export interface Request {
//     userId?: string; 
//   }
// }

export const validateOtpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;


    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing from the request.' });
    }

   
    const user = await User.findOne({ where: { id: userId } });

   
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    
    if (user.otp === null && user.otp_expired_at === null) {
      return next(); 
    }

    return res.status(403).json({
      error: 'OTP validation required or has expired.',
    });
  } catch (error) {
    console.error('Error in OTP validation middleware:', error); // Log the error for debugging
    return res.status(500).json({ error: 'Internal server error during OTP validation.' });
  }
};
export default validateOtpMiddleware;


