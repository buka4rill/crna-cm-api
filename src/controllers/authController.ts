import { Request, Response } from 'express';
import { AppUser } from "../entities/AppUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
// import { userInfo } from 'os';
import { MikroORM } from "@mikro-orm/core";
import microConfig from '../mikro-orm.config';
import { jwt as JWT } from '../config';
// import { MyContext } from '../types';
// import { IGetUserAuthInfo } from '../middleware/auth';


// @route     POST /api/auth/login
// @desc      Login User
// @access    Public
export const loginUser = async (req: Request, res: Response) => {
  // Check for errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      statusCode: 400,
      errors: errors.array()
    });
  }

  // else
  const { email, password } = req.body;
  console.log("password: ", password);
  try {
    
    const orm = await MikroORM.init(microConfig);
    let user = await orm.em.findOne(AppUser, { email });

    console.log(user);

    if (!user) 
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid credentials!"
      });

    // else
    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid credentials"
      });

    // else...it matches, send token
    // Send payload and signed token
    
    const payload = {
      user: {
        id: user.id,
      }
    };

    return jwt.sign(
      payload,
      JWT.SECRET_KEY,
      {
        expiresIn: JWT.EXPIRES_IN,
      },
      (err, token) => {
        if (err) throw err;

        res.json({
          statusCode: 200,
          message: "Logged in successfully!",
          data:{
            user: {
              name: user?.name,
              email: user?.email,
              isAdmin: user?.isAdmin
            }
          },
          token,
        });
      }
    )
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
}
