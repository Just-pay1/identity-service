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
const requestModel_1 = __importDefault(require("../models/requestModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class RequestController {
    // Create a new request
    static createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = req.body.message;
                const user_id = req.userId;
                // Validate required fields
                if (!message) {
                    res.status(400).json({
                        success: false,
                        message: 'message is required'
                    });
                    return;
                }
                // Check if user exists
                const user = yield userModel_1.default.findByPk(user_id);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                    return;
                }
                // Create the request
                const newRequest = yield requestModel_1.default.create({
                    user_id,
                    message
                });
                res.status(201).json({
                    success: true,
                    message: 'Request created successfully',
                    data: newRequest
                });
            }
            catch (error) {
                console.error('Error creating request:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
}
exports.default = RequestController;
