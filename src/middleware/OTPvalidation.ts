const User = require('../models/userModel');
import { NextFunction, Request, Response } from 'express';

exports.verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.otp !== otp || new Date() > user.otp_expired_at) {
      return res.status(401).json({ error: 'verification failed' });
    }

    user.otp = null;
    user.otp_expired_at = null;
    return await user.save(); // this should be a middleware but it is the last function so i use return not next

  } catch (error) {
    res.status(500).json({ error: 'verification failed' });
  }
};


