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
const userModel_1 = __importDefault(require("../models/userModel"));
//import validator  from '../models/userModules';
const bcrypt = require('bcrypt');
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone, city } = req.body;
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(password, salt);
        const newUser = yield userModel_1.default.create({ name, email, password: hashedPassword, phone, city });
        res.status(200).json({ message: 'User created successfully', newUser });
    }
    catch (error) {
        if (error.isJoi === true) {
            res.status(422).json({ message: 'validation error' });
        }
        res.status(500).json({ message: error.message });
    }
});
exports.getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userModel_1.default.findAll();
        res.status(200).json({ message: 'users retrieved successfully', allUsers });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserById = yield userModel_1.default.findByPk(req.params.id);
        res.status(200).json({ message: 'User retrieved successfully', UserById });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser = yield userModel_1.default.update(updatedData, { where: { id: userId } });
        if (updatedUser[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const theNewUser = yield userModel_1.default.findOne({ where: { id: userId } });
        if (theNewUser) {
            console.log('Updated User Data:', theNewUser.get());
            res.status(200).json({ message: 'User updated successfully', theNewUser });
        }
        else {
            res.status(404).json({ message: 'User not found after update' });
        }
    }
    catch (error) {
        if (error.isJoi === true) {
            error.status(422).json({ message: 'validation error' });
        }
        res.status(500).json({ message: error.message });
    }
});
exports.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const deletedUser = yield userModel_1.default.destroy({ where: { id: userId } });
        if (deletedUser === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, phone } = req.body;
        const authenticatedUserId = req.userId; // From auth middleware
        if (!username && !phone) {
            return res.status(400).json({ error: "Please provide a username or phone number." });
        }
        let searchedUser = null;
        let searchType = '';
        if (phone) {
            // Validate phone is exactly 11 digits (defensive, already in Joi)
            if (!/^\d{11}$/.test(phone)) {
                return res.status(400).json({ error: "Phone number must be exactly 11 digits." });
            }
            searchedUser = yield userModel_1.default.findOne({
                where: { phone },
                attributes: ['id', 'name', 'phone', 'pin_code_confirmation']
            });
            searchType = 'phone';
        }
        else if (username) {
            searchedUser = yield userModel_1.default.findOne({
                where: { username },
                attributes: ['id', 'name', 'username', 'pin_code_confirmation']
            });
            searchType = 'username';
        }
        if (!searchedUser) {
            return res.status(404).json({
                error: "No user found with this username or phone number."
            });
        }
        if (!searchedUser.pin_code_confirmation) {
            return res.status(400).json({ error: "the user is not confirmed" });
        }
        // Prevent searching for yourself
        if (searchedUser.id.toString() === (authenticatedUserId === null || authenticatedUserId === void 0 ? void 0 : authenticatedUserId.toString())) {
            return res.status(400).json({
                error: "You cannot search for yourself."
            });
        }
        // Return the found user (different user)
        if (searchType === 'phone') {
            return res.status(200).json({
                id: searchedUser.id,
                name: searchedUser.name,
                phone: searchedUser.phone
            });
        }
        else {
            return res.status(200).json({
                id: searchedUser.id,
                name: searchedUser.name,
                username: searchedUser.username
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
