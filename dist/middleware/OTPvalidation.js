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
Object.defineProperty(exports, "__esModule", { value: true });
const User = require('../models/userModel');
exports.verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const user = yield User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        if (new Date() > user.otp_expired_at) {
            return res.status(400).json({ error: 'OTP has expired' });
        }
        user.otp = null;
        user.otp_expired_at = null;
        yield user.save();
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'OTP verification failed' });
    }
});
