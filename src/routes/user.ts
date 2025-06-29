import express from "express";
const userController = require('../controller/UserController')
import { createUserSchema, updateUserSchema, searchUserSchema } from '../validations'
import { validate } from "../middleware/validation";
import authMiddleware from "../middleware/auth";
const router = express.Router();

router.get('/', userController.getAllUser);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', validate(createUserSchema), userController.createUser);
router.post('/getUserByUsername', authMiddleware, validate(searchUserSchema), userController.searchUser);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);


module.exports = router;
