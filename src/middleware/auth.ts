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

const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer <token>
  
  if (!token) { 
    res.status(401).json({ error: 'Access denied' });
    return;
  }
  if (!JWT_ACCESS_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export default verifyToken;
