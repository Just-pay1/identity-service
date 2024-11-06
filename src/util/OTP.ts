const nodemailer = require('nodemailer');


exports.generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString(); 

exports.setExpirationTime = () => {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 15); // OTP valid for 15 minutes
  return expiration;
};

exports.sendOTPEmail = async (email: any, otp: string) =>{
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

    await transport.sendMail(mailOptions);
}

