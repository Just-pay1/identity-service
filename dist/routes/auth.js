"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth = require('../controller/AuthApiController');
const auth_1 = __importDefault(require("../middleware/auth"));
const validation_1 = require("../middleware/validation");
const validations_1 = require("../validations");
const router = express_1.default.Router();
router.post('/register', (0, validation_1.validate)(validations_1.createUserSchema), Auth.register);
router.post('/login', (0, validation_1.validate)(validations_1.loginSchema), Auth.login);
router.post('/refreshToken', Auth.refreshToken);
router.post('/forgetPassword', (0, validation_1.validate)(validations_1.ForgetPasswordSchema), Auth.forgetPassword);
router.post('/resetPassword', (0, validation_1.validate)(validations_1.resetPasswordSchema), auth_1.default, Auth.resetPassword);
// New endpoints for editing user information
router.put('/edit_info', auth_1.default, (0, validation_1.validate)(validations_1.editInfoSchema), Auth.edit_info);
router.post('/verify_email_update', (0, validation_1.validate)(validations_1.verifyEmailUpdateSchema), Auth.verify_email_update);
router.get('/generate', (req, res) => {
    const crypto = require('crypto');
    const JWT_SECRET = crypto.randomBytes(32).toString('hex');
    console.log(JWT_SECRET);
});
module.exports = router;
