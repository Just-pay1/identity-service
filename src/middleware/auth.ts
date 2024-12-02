import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
declare module 'express' {
    export interface Request {
      userId?: string; 
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const secretKey = process.env.JWT_ACCESS_SECRET;
  if (!secretKey) {
    throw new Error('JWT_SECRET is missing. Please add it to your environment variables.');
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload & { userId: string }; 
    req.userId = decoded.id;
    console.log(decoded.id); 
    next(); 
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export default authMiddleware;
