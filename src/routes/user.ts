import { Router } from 'express';
import auth from '../middleware/auth';
import { check } from 'express-validator';

const router = Router();

// User controller
import { createUser, deleteUserData, getUserData, updateUserData }  from '../controllers/usersController';

// Admin create user route
router.get("/api/user", auth, getUserData);

// Admin create user route
router.post(
  "/api/user", 
    
    auth,
    [
      check('name', "Name is required!").not().isEmpty(),
      check('email', 'Please enter a valid email').isEmail(),
      check("password", "Please enter a valid password").exists(),
    ],

  createUser
);

// Admin update user route
router.put("/api/user/:id", updateUserData);

// Admin delete user route
router.delete("/api/user/:id", auth, deleteUserData);

export { router as usersRouter }