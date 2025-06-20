"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.ForgetPasswordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ForgetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
}).unknown(false);
exports.resetPasswordSchema = joi_1.default.object({
    newPassword: joi_1.default.string().min(8).max(30).required(),
    confirmedPassword: joi_1.default.string().min(8).max(30).required(),
}).unknown(false);
