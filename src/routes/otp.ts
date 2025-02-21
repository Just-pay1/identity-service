import express from 'express';
import authMiddleware from "../middleware/auth";
// import { verifyOtp } from '../controller/OtpController';
const OtpController = require('../controller/OtpController');
import { OtpSchema, ResendOtpSchema} from '../validations'
import { validate } from "../middleware/validation";

const router = express.Router();

// Protected route
router.post('/verifyOTP',validate(OtpSchema), OtpController.verifyOtp);
router.post('/resendOTP', validate(ResendOtpSchema), OtpController.resendOtp);

module.exports = router;

