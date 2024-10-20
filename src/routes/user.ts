import express from "express";
const userController = require('../controller/UserController')
import {validateCreateUser , createUserSchema , validateupdateUser , updateUserSchema} from '../middleware/UserJoi'
const router = express.Router();

router.get('/',userController.getAllUser);
router.get('/:id',userController.getUserById);
router.post('/', validateCreateUser(createUserSchema), userController.createUser);
router.put('/:id',validateupdateUser(updateUserSchema) ,userController.updateUser);
router.delete('/:id',userController.deleteUser);


module.exports = router;
