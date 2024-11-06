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
const nodemailer = require('nodemailer');
exports.generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();
exports.setExpirationTime = () => {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 15); // OTP valid for 15 minutes
    return expiration;
};
exports.sendOTPEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = nodemailer.createTransport({
        host: "live.smtp.mailtrap.io",
        port: 587,
        auth: {
            user: "api",
            pass: "ed1013e9c0130e71bffd42f7b481206a"
        }
    });
    const mailOptions = {
        from: 'youssefmoghazy55@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}.`,
    };
    yield transport.sendMail(mailOptions);
});
