import { Router } from 'express';
import auth from '../middleware/auth';

const router = Router();

// User controller
import { getUserData }  from '../controllers/usersController';


router.get("/api/user", auth, getUserData);

export { router as usersRouter }