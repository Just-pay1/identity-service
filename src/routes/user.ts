import express from "express";
const userController = require('../controller/UserController')
import { createUserSchema, updateUserSchema} from '../validations'
import { validate } from "../middleware/validation";
const router = express.Router();

router.get('/',userController.getAllUser);
router.get('/:id',userController.getUserById);
router.post('/', validate(createUserSchema), userController.createUser);
router.put('/:id',validate(updateUserSchema) ,userController.updateUser);
router.delete('/:id',userController.deleteUser);


module.exports = router;
