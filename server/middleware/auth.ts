import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import asyncError from '../utils/asyncError';
import User from '../models/UserModel';
import ErrorHandler from '../utils/errorHandler';

export const isAuthenticatedUser = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || req.cookies.token;
    if (!token)
      return res.status(401).json({ success: false, message: 'Unauthorized' });

    const userToken = jwt.verify(
      token,
      process.env.JWT_SECRET as Secret
    ) as JwtPayload;

    req.user = await User.findById(userToken.id);

    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
