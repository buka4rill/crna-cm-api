import { Router } from 'express';
import auth from '../middleware/auth';
import { 
  createCourse, 
  deleteCourseData, 
  getCourses, 
  getSingleCourse, 
  updateCourseData 
} from '../controllers/courseController';
import { check } from 'express-validator';

const router = Router();

// Get all courses
router.get("/api/course/all", auth, getCourses);

// Get a course
router.get("/api/course/:courseId", auth, getSingleCourse);

// Admin & teacher create a course
router.post(
  "/api/course", 
  auth, 
  [
    check("title", "Title is required").not().isEmpty(),
    check("shortDescription", "Please add a description of more that 12 characters")
      .isLength({ min: 12 }),
    check("fullDescription", "Please add a text of more that 16 characters")
      .isLength({ min: 16 })
  ],
  createCourse
);


// Update a course
router.put("/api/course/:courseId", auth, updateCourseData);

// Delete a course
router.delete("/api/course/:courseId", auth, deleteCourseData)


export { router as courseRouter };