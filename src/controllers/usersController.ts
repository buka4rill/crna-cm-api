import { Request, Response } from 'express';
import { AppUser } from "../entities/AppUser";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { validationResult } from "express-validator";
// import { userInfo } from 'os';
import { MikroORM } from "@mikro-orm/core";
import microConfig from '../mikro-orm.config';
// import { IGetUserAuthInfo } from '../middleware/auth';


// @route     GET /api/user
// @desc      Admin gets all users
// @access    Private
export const getUserData = async (req: Request, res: Response) => {
  try {
    
    const orm = await MikroORM.init(microConfig);
    const user = await orm.em.findOne(AppUser, { id: req.user.id });

    // return
    return res.json({
      status: 200,
      message: "User gotten successfully!",
      data: { user }
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
}
