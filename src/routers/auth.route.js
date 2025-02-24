import express from 'express';
import { signup, login, logout, updateProfiel } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controller.js";


const router=express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/update-profiel', protectRoute, updateProfiel);

router.get('/check-auth', protectRoute, checkAuth);




export default router;