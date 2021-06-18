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
    const token = parseToken(authHeader);
  // Here place your token authorization
    if (token === 'token')
      return {
        userId: 1
      };
    else
      throw new RequestError(401);
};


function parseToken(authHeader: string) {
  return (authHeader as string).split(' ')[1];
}