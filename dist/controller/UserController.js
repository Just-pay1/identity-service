"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModules_1 = __importDefault(require("../models/userModules"));
const userModules_2 = __importDefault(require("../models/userModules"));
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let valid = new userModules_2.default(req.body);
        if (!valid) {
            return res.status(500).json({ message: 'Validation error' });
        }
        const { id, name, email, password, phone } = req.body;
        const newUser = yield userModules_1.default.create({ id, name, email, password, phone });
        res.status(200).json({ message: 'User created successfully', newUser });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userModules_1.default.findAll();
        res.status(200).json({ message: 'users retrieved successfully', allUsers });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserById = yield userModules_1.default.findByPk(req.params.id);
        res.status(200).json({ message: 'User retrieved successfully', UserById });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        let valid = new userModules_2.default(req.body);
        if (!valid) {
            return res.status(500).json({ message: 'Validation error' });
        }
        const updatedData = req.body;
        const updatedUser = yield userModules_1.default.update(updatedData, { where: { id: userId } });
        if (updatedUser[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const theNewUser = yield userModules_1.default.findOne({ where: { id: userId } });
        if (theNewUser) {
            console.log('Updated User Data:', theNewUser.get());
            res.status(200).json({ message: 'User updated successfully', theNewUser });
        }
        else {
            res.status(404).json({ message: 'User not found after update' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const deletedUser = yield userModules_1.default.destroy({ where: { id: userId } });
        if (deletedUser === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
