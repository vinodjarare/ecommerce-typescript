import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncError =
  (passedFunction: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
  };

export default asyncError;
