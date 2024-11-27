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
            return res.status(401).json({ error: 'no user with this email' });
        }
        if (!user || user.otp !== otp || new Date() > user.otp_expired_at) {
            return res.status(401).json({ error: 'verification failed' });
        }
        user.otp = null;
        user.otp_expired_at = null;
        yield user.save();
        res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'verification failed' });
    }
});
