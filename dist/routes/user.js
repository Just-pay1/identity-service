"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = require('../controller/UserController');
const validations_1 = require("../validations");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/', userController.getAllUser);
router.get('/:id', userController.getUserById);
router.post('/', (0, validation_1.validate)(validations_1.createUserSchema), userController.createUser);
router.put('/:id', (0, validation_1.validate)(validations_1.updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);
module.exports = router;
