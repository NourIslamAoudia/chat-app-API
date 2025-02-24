import express from 'express';
import { getUsersForChat, getMessages, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/users', protectRoute, getUsersForChat);

router.get('/:id', protectRoute, getMessages);//id -> userId for fetching messages

router.post('/send/:id', protectRoute, sendMessage);//id -> userId for sending messages


export default router;