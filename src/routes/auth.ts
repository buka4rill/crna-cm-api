import { Router } from 'express';
// import auth from '../middleware/auth';
import { check } from 'express-validator';

const router = Router();

// User controller
import { loginUser }  from '../controllers/authController';


router.post(
  "/api/auth/login", 
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "A valid password is required").exists(),
  ], 
  loginUser
);

export { router as authRouter };