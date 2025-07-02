"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserSchema = exports.pincodeSchema = exports.addUsernameSchema = exports.verifyEmailUpdateSchema = exports.editInfoSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(30).required(),
    password: joi_1.default.string().min(8).max(30).required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
}).unknown(false);
exports.updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(30),
    email: joi_1.default.string().email(),
    phone: joi_1.default.string(),
}).unknown(false);
exports.editInfoSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(30).optional(),
    email: joi_1.default.string().email().optional(),
    phone: joi_1.default.string().optional(),
}).unknown(false).min(1); // At least one field must be provided
exports.verifyEmailUpdateSchema = joi_1.default.object({
    verificationId: joi_1.default.string().required(),
    otp: joi_1.default.string().length(6).pattern(/^\d+$/).required(),
}).unknown(false);
exports.addUsernameSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(30).required(),
}).unknown(false);
exports.pincodeSchema = joi_1.default.object({
    pin_code: joi_1.default.string().length(6).pattern(/^\d+$/).required(),
}).unknown(false);
exports.searchUserSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(30),
    phone: joi_1.default.string().pattern(/^\d{11}$/),
}).or('username', 'phone').unknown(false);
