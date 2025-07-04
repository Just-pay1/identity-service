import express from 'express';
import RequestController from '../controller/RequestController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// Create a new request
router.post('/create', authMiddleware,RequestController.createRequest); 



export default router; 