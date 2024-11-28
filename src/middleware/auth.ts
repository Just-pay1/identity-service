import jwt, {JwtPayload} from 'jsonwebtoken';
import { NextFunction, Request, Response , RequestHandler } from 'express';
const JWT_ACCESS_SECRET : any = process.env.JWT_ACCESS_SECRET;
import dotenv from 'dotenv';  

dotenv.config();
declare module 'express' {
    export interface Request {
      userId?: string; 
    }
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) throw new Error('JWT secret key is missing');
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer <token>

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, secretKey) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export default verifyToken;
