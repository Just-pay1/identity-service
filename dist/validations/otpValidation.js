"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpSchema = exports.OtpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.OtpSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().length(6).pattern(/^\d+$/).required(),
    flow: joi_1.default.string().required().valid('register', 'reset_password'),
}).unknown(false);
exports.ResendOtpSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
}).unknown(false);
