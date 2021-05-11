import { Request, Response } from 'express';
import { AppUser } from "../entities/AppUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwt as JWT } from "../config";
import { validationResult } from "express-validator";
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

// @route     POST /api/user
// @desc      Admin creates
// @access    Private
export const createUser = async (req: Request, res: Response) => {
  // Validate body 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({
        statusCode: 400,
        message: "Missing fields are required",
        errors: errors.array()
      });
  }

  // else...
  const { name, email, password } = req.body;
  
  
  try {
    
    // Admin User
    const orm = await MikroORM.init(microConfig);
    const adminUser = await orm.em.findOne(AppUser, { id: req.user.id });

    // console.log("USER_ROLE: ", user?.role?.values());
    let userRole = "";
    for (let key in adminUser?.role) {
      let user_role = adminUser?.role[key];
      userRole = user_role;
    }

    if (userRole !== "admin") {
      res.status(401).json({
        statusCode: 401,
        message: "Unauthorised! You can't create user!"
      })
    }

    // Create user
    const newUser = orm.em.create(AppUser, {
      name,
      email,
      password,
    })
    

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(password, salt);

    await orm.em.persistAndFlush(newUser);

    const payload = {
      user: {
        id: newUser.id
      }
    }

    return jwt.sign(
      payload,
      JWT.SECRET_KEY,
      {
        expiresIn: JWT.EXPIRES_IN
      },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          statusCode: 201,
          message: "User created successfully",
          data: {
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
            }
          },
          token
        })
      }
    )

    // return
    // return res.json({
    //   status: 200,
    //   message: "User gotten successfully!",
    //   data: { user }
    // });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
}

// @route     GET /api/user
// @desc      Admin gets all users
// @access    Private
export const updateUserData = async (req: Request, res: Response) => {
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
// @route     GET /api/user
// @desc      Admin gets all users
// @access    Private

export const deleteUserData = async (req: Request, res: Response) => {
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
