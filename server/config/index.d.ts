/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../types/models';
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | IUser | null;
    }
  }
}
