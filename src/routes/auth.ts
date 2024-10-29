import express from "express";
const Auth = require('../controller/AuthApiController')
import { validate } from "../middleware/validation";
import { createUserSchema, loginSchema} from '../validations'
const router = express.Router();


router.post('/register',validate(createUserSchema), Auth.register)
router.post('/login', validate(loginSchema),Auth.login)

router.get('/generate', (req, res) => {
    const crypto = require('crypto');

    const JWT_SECRET = crypto.randomBytes(32).toString('hex');
    console.log(JWT_SECRET);
})

module.exports = router;