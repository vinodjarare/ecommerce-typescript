import { Response } from 'express';
import { IUser } from '../types/models';
const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = user.getJWTToken();

  // options for cookie
  const COOKIE_EXPIRE = parseInt(process.env.COOKIE_EXPIRE!) || 5;

  const options = {
    expires: new Date(
      (Date.now() + COOKIE_EXPIRE * 24 * 60 * 60 * 1000) as number
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
