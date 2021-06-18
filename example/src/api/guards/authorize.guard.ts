import {RequestError} from "arrow-express";
import Express from 'express';

export type UserContext = {
  userId: number
}
/**
 * Stub authorization guard
 */
export const AuthorizeGuard = async (req: Express.Request): Promise<UserContext> => {
  const authHeader = req.headers.authorization;
  try {
    // Here place your token authorization
    const token = (authHeader as string).split(' ')[1];
    if (token === 'token')
      return {
        userId: 1
      };
    else
      throw new Error();
  } catch (_) {
    throw new RequestError(401);
  }
};