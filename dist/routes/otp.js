"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { verifyOtp } from '../controller/OtpController';
const OtpController = require('../controller/OtpController');
const validations_1 = require("../validations");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Protected route
router.post('/verifyOTP', (0, validation_1.validate)(validations_1.OtpSchema), OtpController.verifyOtp);
router.post('/resendOTP', (0, validation_1.validate)(validations_1.ResendOtpSchema), OtpController.resendOtp);
module.exports = router;
