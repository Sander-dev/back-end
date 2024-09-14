import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, 'secret_key', (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }

    req.user = decodedUser;
    next();
  });
};
