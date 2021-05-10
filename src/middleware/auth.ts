// Check to see if there's a token and header

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// const { SECRET }: jwt.Secret = process.env;
import { jwt as JWT } from '../config';


// type IDecoded = {
//   user: string | Object;
//   // verify: (token: string, secretOrPublicKey: jwt.Secret, options?: jwt.VerifyOptions | undefined) => void;
// }

declare global {
  namespace Express {
    export interface Request {
        user: UserType; 
    }
  }
}

type UserType = {
  id: number;
  email: string;
  password: string;
}

// export interface IGetUserAuthInfo extends Request {
//   user?: UserType;
// }



interface Token { user: UserType }

export default (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token doesn't exist
  if (!token)
    return res.status(401).json({
      status: 401,
      message: "No token, authorization denied!"
    });
  
  // else...
  try {
    const decoded = jwt.verify(token, JWT.SECRET_KEY) as Token;

    // Assign user to request obj
    req.user = decoded.user;

    return next();
  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: "Token is invalid!"
    });
  }
}