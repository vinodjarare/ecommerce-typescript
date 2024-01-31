import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../types/models";

declare global {
  namespace Express {
    interface Request {
      user?:  null | IUser;
    }
  }
}