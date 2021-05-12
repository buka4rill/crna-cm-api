import { Request, Response } from 'express';
import { AppUser } from "../entities/AppUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwt as JWT } from "../config";
import { validationResult } from "express-validator";
// import { userInfo } from 'os';
import { MikroORM } from "@mikro-orm/core";
import microConfig from '../mikro-orm.config';


// @route     GET /api/user
// @desc      Admin gets logged in user
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
    return res.status(500).send({
      statusCode: 500,
      error: err.message,
      message: "Server Error",
    });
  }
}

// @route     GET /api/user/all
// @desc      Admin gets all users (with query strings)
// @access    Private
export const getAllUsersData = async (req: Request, res: Response) => {
  try {
    // Admin User
    const orm = await MikroORM.init(microConfig);
    const adminUser = await orm.em.findOne(AppUser, { id: req.user.id });

    const { school, district, country, city } = req.query;

    // Check user role
    let userRole = "";
    for (let key in adminUser?.role) {
      let user_role = adminUser?.role[key];
      userRole = user_role;
    }

    if (userRole !== "admin") {
      res.status(401).json({
        statusCode: 401,
        message: "Unauthorised! You can't get users!"
      });
    }

    // Search with query strings
    const query: any = { };

    if (school) query.school = school;
    if (district) query.district = district;
    if (country) query.country = country;
    if (city) query.city = city;

    const users = await orm.em.find(AppUser, query);

    // Check if users object is empty
    if (!users)
      return res.status(404)
        .json({
          statusCode: 404,
          message: "Users not found!"
        });

    return res.status(200)
      .json({
        statusCode: 200,
        message: "Users data gotten successfully!",
        data: { 
          users: users.map(user => {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              country: user.country,
              city: user.city,
              district: user.district, 
              school: user.school,
              role: user.role,
              isAdmin: user.isAdmin,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            }
          }) 
        }
      });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({
      statusCode: 500,
      error: err.message,
      message: "Server Error",
    });
  }
}

// @route     GET /api/user/:id
// @desc      Admin gets single user
// @access    Private
export const getSingleUserData = async (req: Request, res: Response) => {
  // user id params
  const { userId } = req.params; 

  try {
    // Admin User
    const orm = await MikroORM.init(microConfig);
    const adminUser = await orm.em.findOne(AppUser, { id: req.user.id });

    // Check user role
    let userRole = "";
    for (let key in adminUser?.role) {
      let user_role = adminUser?.role[key];
      userRole = user_role;
    }

    if (userRole !== "admin") {
      res.status(401).json({
        statusCode: 401,
        message: "Unauthorised! You can't get users!"
      });
    }

    const user = await orm.em.findOne(AppUser, { id: Number(userId) });

    if (!user)
      return res.status(404)
        .json({
          statusCode: 404,
          message: "User not found!"
        });

    // return data
    return res.status(200)
      .json({
        statusCode: 200,
        message: "Users data gotten successfully!",
        data: { 
          users: {
            id: user.id,
            name: user.name,
            email: user.email,
            country: user.country,
            city: user.city,
            district: user.district, 
            school: user.school,
            role: user.role,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({
      statusCode: 500,
      error: err.message,
      message: "Server Error",
    });
  }
}

// @route     POST /api/user
// @desc      Admin creates user
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

    // Check user role
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

    // if User is admin...create user
    const newUser = orm.em.create(AppUser, {
      name,
      email,
      password,
    });
    
    // Encrypt password
    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(password, salt);

    await orm.em.persistAndFlush(newUser);

    const payload = {
      user: {
        id: newUser.id
      }
    }

    // Return payload
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
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({
      statusCode: 500,
      error: err.message,
      message: "Server Error",
    });
  }
}

// @route     PUT /api/user/:id
// @desc      User and Admin can update user's details
// @access    Private
export const updateUserData = async (req: Request, res: Response) => {
  
  const { name, school, city, district, country, role} = req.body

  // const userFields: UserField = {};

  try {
    // User id params
    const { userId } = req.params;

    // Admin User
    const orm = await MikroORM.init(microConfig);
    const users = await orm.em.find(AppUser, { id: { $in: [req.user.id, Number(userId)]} });
    const user = await orm.em.findOne(AppUser, { id: Number(userId) });


    if (!users) {
      return res.status(404).json({
        statusCode: 404,
        message: "Sorry, user not found!",
      })
    }

    // Get User Role
    let userRole: any = [];
    users.map(user => {
      for (let key in user.role) {
        let user_role = user?.role[key];
        userRole.push(user_role);
      } 
    });
    
    let is_admin = userRole.includes('admin');
    let is_user = userRole.includes('user');
    let is_teacher = userRole.includes('teacher');

    if (!is_admin && !is_user && !is_teacher) {
      res.status(401).json({
        statusCode: 401,
        message: "Unauthorised! You can't update user!"
      });
    } else if (is_admin) {
   
      // Check for user
      if (!user) return res.status(404).json({ message: "User not found!"});

      // update user as an admin
      user.name = name;
      user.school = school;
      user.city = city;
      user.country = country;
      user.district = district;
      user.role = role;

      // Save to db
      await orm.em.persistAndFlush(user);
    } else  {
      // Check for user
      if (!user) return res.status(404).json({ message: "User not found!"});

      // Update user as a normal user
      user.name = name;
      user.school = school;
      user.city = city;
      user.country = country;
      user.district = district;
    
      // Save to db
      await orm.em.persistAndFlush(user);
    }

    return res.status(200).json({
      statusCode: 200,
      message: `user of id ${userId} updated successfully!`,
      data: {
        user: {
          name: user?.name,
          school: user?.school,
          city: user?.city,
          country: user?.country,
          district: user?.district,
          role: user?.role,
        }
      },
    });

    
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({
      statusCode: 500,
      error: err.message,
      message: "Server Error",
    });
  }
}

// @route     DELETE /api/user/:id
// @desc      Admin deletes all users
// @access    Private
export const deleteUserData = async (req: Request, res: Response) => {

  const { userId } = req.params;

  try {
    
    // Admin User
    const orm = await MikroORM.init(microConfig);
    const adminUser = await orm.em.findOne(AppUser, { id: req.user.id });

    // Check user role
    let userRole = "";
    for (let key in adminUser?.role) {
      let user_role = adminUser?.role[key];
      userRole = user_role;
    }

    if (userRole !== "admin") {
      res.status(401).json({
        statusCode: 401,
        message: "Unauthorised! You can't delete a user!"
      })
    }

    // else...if authorized
    // delete user
    await orm.em.nativeDelete(AppUser, { id: Number(userId) });

    // return
    return res.json({
      status: 200,
      message: `User of id ${userId} deleted successfully!`,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({
      statusCode: 500,
      error: err.message,
      message: "Server Error",
    });
  }
}
