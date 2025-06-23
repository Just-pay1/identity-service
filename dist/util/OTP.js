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
const rabbitmq_1 = __importDefault(require("./rabbitmq"));
exports.sendOTPEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const rabbitMq = yield rabbitmq_1.default.getInstance();
    const mailObj = {
        to: email,
        subject: 'justPay - OTP Code',
        content: `Your OTP code is ${otp}.`
    };
    rabbitMq.sendMail(mailObj);
});
// const nodemailer = require('nodemailer');
// require("dotenv").config();
// const mailtrapUser = process.env.MAIL_TRAP_USER;
// const mailtrapPassword = process.env.MAIL_TRAP_PASSWORD;
// const mailtrapPort = process.env.MAIL_TRAP_PORT
// exports.sendOTPEmail = async (email: any, otp: string) => {
//     var transport = nodemailer.createTransport({
//         host: "sandbox.smtp.mailtrap.io",
//         port: mailtrapPort,
//         auth: {
//             user: mailtrapUser,
//             pass: mailtrapPassword
//         }
//     });
//     const mailOptions = {
//         from: 'justPay@gmail.com',
//         to: email,
//         subject: 'justPay - OTP Code',
//         text: `Your OTP code is ${otp}.`,
//     };
//     await transport.sendMail(mailOptions);
// }
