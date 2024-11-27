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
    await user.save(); 

    res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    res.status(500).json({ error: 'verification failed' });
  }
};


