"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(30).required(),
    password: joi_1.default.string().min(8).max(30).required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
}).unknown(false);
exports.updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(30),
    email: joi_1.default.string().email(),
    phone: joi_1.default.string(),
}).unknown(false);
