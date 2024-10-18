import express from "express";
const userController = require('../controller/UserController')
const router = express.Router();

router.get('/',userController.getAllUser);
router.get('/:id',userController.getUserById);
router.post('/',userController.createUser);
router.put('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser);


module.exports = router;
