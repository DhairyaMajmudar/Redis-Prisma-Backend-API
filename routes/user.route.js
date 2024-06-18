import { Router } from "express";
import AuthController from "../controllers/userAuth.contoller.js";
import authMiddleware from "../middleware/userAuth.middleware.js";
import profileContoller from "../controllers/userProfile.controller.js";

const router = Router()

router.post('/auth/register', AuthController.register)
router.post('/auth/login', AuthController.login)

router.get('/profile/all', profileContoller.allProfiles) // public route
router.get('/profile', authMiddleware, profileContoller.index) // Protected route
router.put('/profile/:id', authMiddleware, profileContoller.update) // Protected route

export default router