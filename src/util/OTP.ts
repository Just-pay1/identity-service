const nodemailer = require('nodemailer');


exports.generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

exports.setExpirationTime = () => {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 15); // OTP valid for 15 minutes
    return expiration;
};

exports.sendOTPEmail = async (email: any, otp: string) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "957613635ef39e",
            pass: "7c9ed6d7a6c249"
        }
    });

    const mailOptions = {
        from: 'youssefmoghazy55@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}.`,
    };

    await transport.sendMail(mailOptions);
}

