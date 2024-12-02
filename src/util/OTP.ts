const nodemailer = require('nodemailer');
require("dotenv").config();

const mailtrapUser = process.env.MAIL_TRAP_USER;
const mailtrapPassword = process.env.MAIL_TRAP_PASSWORD;
const mailtrapPort = process.env.MAIL_TRAP_PORT


exports.sendOTPEmail = async (email: any, otp: string) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: mailtrapPort,
        auth: {
            user: mailtrapUser,
            pass: mailtrapPassword
        }
    });

    const mailOptions = {
        from: 'justPay@gmail.com',
        to: email,
        subject: 'justPay - OTP Code',
        text: `Your OTP code is ${otp}.`,
    };

    await transport.sendMail(mailOptions);
}


