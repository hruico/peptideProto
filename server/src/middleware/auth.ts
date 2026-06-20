import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
  userId?: mongoose.Types.ObjectId;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    req.userId = new mongoose.Types.ObjectId(payload.sub);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  } as jwt.SignOptions);
}
