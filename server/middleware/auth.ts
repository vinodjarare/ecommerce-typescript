import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import asyncError from '../utils/asyncError';
import User from '../models/UserModel';

const isAuthenticated = asyncError(
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
