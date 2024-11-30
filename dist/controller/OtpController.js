"use strict";
exports.generateOTP = () => Math.floor(100000 + Math.random() * 999999).toString();
exports.setExpirationTime = () => {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 15); // OTP valid for 15 minutes
    return expiration;
};
