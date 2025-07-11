import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Extend the Express Request object to include `userId` and `email`
declare module 'express' {
  export interface Request {
    userId?: string;
    email?: string;
  }
}

const resetTokenAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const secretKey = process.env.JWT_ACCESS_SECRET;
  
  if (!secretKey) {
    throw new Error('JWT_ACCESS_SECRET is missing. Please add it to your environment variables.');
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. No reset token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload & { id: string; email: string };
    req.userId = decoded.id;
    req.email = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired reset token.' });
  }
};

export default resetTokenAuthMiddleware; 