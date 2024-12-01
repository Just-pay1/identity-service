import express from 'express';
import authMiddleware from "../middleware/auth";
import { getUserProfile } from '../controller/OtpController';

const router = express.Router();

// Protected route
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
