import express from "express";
const Auth = require('../controller/AuthApiController')
import { validate } from "../middleware/validation";
import { createUserSchema, loginSchema} from '../validations'
const verify = require('../middleware/OTPvalidation');
const router = express.Router();


router.post('/register',validate(createUserSchema), Auth.register,verify.verifyOTP)
router.post('/login', validate(loginSchema),Auth.login)

router.get('/generate', (req, res) => {
    const crypto = require('crypto');

    const JWT_SECRET = crypto.randomBytes(32).toString('hex');
    console.log(JWT_SECRET);
})

module.exports = router;