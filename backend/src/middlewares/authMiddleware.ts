/**
 * JWT 인증 미들웨어
 * - 요청 헤더의 Authorization: Bearer <token> 검증
 */
import express from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'usdqs_quantum_safe_default_dev_secret_2026';

export interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export const signAccessToken = (payload: { id: string; username: string; role: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
};

export const requireAuth = (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
      return;
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다.' });
  }
};

