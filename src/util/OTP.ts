import RabbitMQ from "./rabbitmq";
import { EmailRequest } from "./shared-interfaces";

exports.sendOTPEmail = async (email: any, otp: string) => {
    const rabbitMq = await RabbitMQ.getInstance();
    const mailObj: EmailRequest = {
        to: email,
        subject: 'justPay - OTP Code',
        content: `Your OTP code is ${otp}.`
    }
    rabbitMq.sendMail(mailObj);
}

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


