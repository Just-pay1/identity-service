"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = require('../controller/UserController');
const UserJoi_1 = require("../middleware/UserJoi");
const router = express_1.default.Router();
router.get('/', userController.getAllUser);
router.get('/:id', userController.getUserById);
router.post('/', (0, UserJoi_1.validateCreateUser)(UserJoi_1.createUserSchema), userController.createUser);
router.put('/:id', (0, UserJoi_1.validateupdateUser)(UserJoi_1.updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);
module.exports = router;
