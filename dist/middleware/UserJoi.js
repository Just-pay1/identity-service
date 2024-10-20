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
exports.updateUserSchema = exports.createUserSchema = exports.validateupdateUser = exports.validateCreateUser = void 0;
const joi_1 = __importDefault(require("joi"));
// Middleware function for validating createUser request
const validateCreateUser = (createUserSchema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate request body
            yield createUserSchema.validateAsync(req.body);
            next();
        }
        catch (error) {
            console.log(error);
            res.status(422).json({ message: 'Validation error', details: error.details });
        }
    });
};
exports.validateCreateUser = validateCreateUser;
const validateupdateUser = (updateUserSchema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate request body
            yield updateUserSchema.validateAsync(req.body);
            next();
        }
        catch (error) {
            console.log(error);
            res.status(422).json({ message: 'Validation error', details: error.details });
        }
    });
};
exports.validateupdateUser = validateupdateUser;
// Create user schema
exports.createUserSchema = joi_1.default.object({
    name: joi_1.default.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: joi_1.default.string()
        .min(8)
        .max(30)
        .required(),
    email: joi_1.default.string()
        .email()
        .required(),
    phone: joi_1.default.string()
        .required(),
}).unknown(false);
;
// Update user schema
exports.updateUserSchema = joi_1.default.object({
    name: joi_1.default.string()
        .alphanum()
        .min(3)
        .max(30),
    email: joi_1.default.string()
        .email(),
    phone: joi_1.default.string(),
}).unknown(false);
