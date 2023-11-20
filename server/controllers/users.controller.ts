import { Request, Response, NextFunction } from 'express';
import User from '../models/UserModel';
import { IFile, upload } from '../utils/upload';
import sendToken from '../utils/jwtToken';
import asyncError from '../utils/asyncError';
import ErrorHandler from '../utils/errorHandler';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as IFile[];
    const file =
      files && files.filter((file: IFile) => file.fieldname === 'avatar').length
        ? files.filter((file: IFile) => file.fieldname === 'avatar')[0]
        : null;

    const avatar = file && (await upload(file, 'users'));

    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      avatar,
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// user login

export const login = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorHandler('Invalid email or password', 401));
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return next(new ErrorHandler('Invalid email or password', 401));
    sendToken(user, 200, res);
  }
);
