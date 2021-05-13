import { Request, Response } from 'express';
import { Course } from "../entities/Course";
import { MikroORM } from "@mikro-orm/core";
import microConfig from '../mikro-orm.config';
import { validationResult } from 'express-validator'
import { AppUser } from '../entities/AppUser';


// @route     GET /api/course/all
// @desc      User gets all course
// @access    Private
export const getCourses = async (_: any, res: Response) => {
  // Get all courses
  try {
    const orm = await MikroORM.init(microConfig);
    const courses = await orm.em.find(Course, {});

    return res.status(200)
      .json({
        statusCode: 200,
        message: "Courses gotten successfully!",
        data: { courses }
      })
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({
      statusCode: 500,
      error: err.message,
      message: "Server Error",
    });
  }
}


// @route     GET /api/course/:couseId
// @desc      User gets single course
// @access    Private
export const getSingleCourse = async (req: Request, res: Response) => {
  // course Id param 
  const { courseId } = req.params;

  try {
    const orm = await MikroORM.init(microConfig);
    const course = await orm.em.find(Course, { id: Number(courseId) });

    if (!course)
      res.status(404)
        .json({
          statusCode: 404,
          message: "No course found!",
        });

    // else
    return res.status(200).json({
      statusCode: 200,
      message: `Course of id ${courseId} gotten successfully!`,
      data: { course }
    })
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({
      statusCode: 500,
      error: err.message,
      message: "Server Error",
    });
  }
}

// @route     POST /api/course
// @desc      Admin creates course
// @access    Private
export const createCourse = async (req: Request, res: Response) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400)
      .json({
        statusCode: 400,
        message: "Error(s) found in request",
        errors: errors.array(),
      });

  // else
  const { title, shortDescription, fullDescription } = req.body;

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
        message: "Unauthorised! You can't create course!"
      })
    }

    // if User is admin...create user
    const newCourse = orm.em.create(Course, {
      title, 
      shortDescription, 
      fullDescription
    });

    await orm.em.persistAndFlush(newCourse);

    return res.status(201).json({
      statusCode: 200,
      message: "Course created successfully!",
      data: {
        course: newCourse
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


// @route     PUT /api/course/:courseId
// @desc      Admin and teacher can update course details
// @access    Private
export const updateCourseData = async (req: Request, res: Response) => {
  const { title, shortDescription, fullDescription } = req.body;

  try {
    // Course id params
    const { courseId } = req.params;

    // Admin User
    const orm = await MikroORM.init(microConfig);
    const appUser = await orm.em.find(AppUser, { id: req.user.id });
    const course = await orm.em.findOne(Course, { id: Number(courseId) });

    if (!appUser) {
      res.status(404).json({
        statusCode: 404,
        message: "Sorry, user not found!",
      })
    }

    // Get User Role
    let userRole: any = [];
    appUser.map(user => {
      for (let key in user.role) {
        let user_role = user?.role[key];
        userRole.push(user_role);
      } 
    });
    
    let is_admin = userRole.includes('admin');
    let is_user = userRole.includes('user');
    let is_teacher = userRole.includes('teacher');

    if (!is_admin && !is_user && !is_teacher) {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorised! You can't update course!"
      });
    } else if (is_admin || is_teacher) {
    
      // Check for user
      if (!course) return res.status(404).json({ message: "Course not found!"});

      // update course as an admin or teacher
      course.title = title;
      course.shortDescription = shortDescription;
      course.fullDescription = fullDescription;

      // Save to db
      await orm.em.persistAndFlush(course);
    } else if (is_user) {
      // Check for user
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorised! You can't update course!"
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: `Course of id ${courseId} updated successfully!`,
      data: {
        course
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

// @route     DELETE /api/course/:courseId
// @desc      Admin and teacher deletes course
// @access    Private
export const deleteCourseData = async (req: Request, res: Response) => {
  
  try {
    // Course id param
    const { courseId } = req.params; 
    
    // Admin User
    const orm = await MikroORM.init(microConfig);
    const appUser = await orm.em.findOne(AppUser, { id: req.user.id });

    const course = await orm.em.findOne(Course, { id: Number(courseId) });

    let userRole = "";
    for (let key in appUser?.role) {
      let user_role = appUser?.role[key];
      userRole = user_role;
    }

    if (userRole == "user") {
      res.status(401).json({
        statusCode: 401,
        message: "Unauthorised! You can't delete a user!"
      });
    }

    // else...if authorized
    // delete course

    // Check for course
    if (!course) return res.status(404).send({
      statusCode: 404, 
      message: "Course not found!"
    });

    // Delete course
    await orm.em.nativeDelete(Course, { id: Number(courseId) });

    // return
    return res.json({
      status: 200,
      message: `User of id ${courseId} deleted successfully!`,
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