"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth = require('../controller/AuthApiController');
const validation_1 = require("../middleware/validation");
const validations_1 = require("../validations");
const verify = require('../middleware/OTPvalidation');
const router = express_1.default.Router();
router.post('/register', (0, validation_1.validate)(validations_1.createUserSchema), Auth.register);
router.post('/verfiy-otp', verify.verifyOTP);
router.post('/login', (0, validation_1.validate)(validations_1.loginSchema), Auth.login);
router.get('/generate', (req, res) => {
    const crypto = require('crypto');
    const JWT_SECRET = crypto.randomBytes(32).toString('hex');
    console.log(JWT_SECRET);
});
module.exports = router;
