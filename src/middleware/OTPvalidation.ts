const User = require('../models/userModel');
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

exports.verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  const { otp } = req.body;
  const accessToken = req.headers.authorization?.split(' ')[1];
  console.log(accessToken);

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }
  try {
    const decoded: any = jwt.verify(accessToken, JWT_ACCESS_SECRET);
    const userId = decoded.id;
    console.log(userId);

    if (!userId) {
      return res.status(400).json({ error: 'user ID not found' });
    }
    const user = await User.findOne({ where: { id: userId } });
    console.log({ otp, userOtp: user?.otp, otpExpiredAt: user?.otp_expired_at });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    if (new Date() > user.otp_expired_at) {
      return res.status(401).json({ error: 'OTP expired' });
    }

    user.otp = null;
    user.otp_expired_at = null;
    await user.save();
    res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    res.status(500).json({ error: 'verification failed' });
  }
};


