import express from "express";
const Auth = require('../controller/AuthApiController')
import authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validation";
import { createUserSchema, loginSchema, resetPasswordSchema, ForgetPasswordSchema} from '../validations'

const router = express.Router();


router.post('/register',validate(createUserSchema), Auth.register)

router.post('/login', validate(loginSchema),Auth.login)
router.post('/refreshToken',Auth.refreshToken)
router.post('/forgetPassword', validate(ForgetPasswordSchema),Auth.forgetPassword)
router.post('/resetPassword', validate(resetPasswordSchema), authMiddleware,Auth.resetPassword)

router.get('/generate', (req, res) => {
    const crypto = require('crypto');

    const JWT_SECRET = crypto.randomBytes(32).toString('hex');
    console.log(JWT_SECRET);
})

module.exports = router;