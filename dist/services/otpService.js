"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class otpService {
}
otpService.generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
otpService.setExpirationTime = () => {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 15); // OTP valid for 15 minutes
    return expiration;
};
exports.default = otpService;
