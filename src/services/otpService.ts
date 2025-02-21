class otpService{
    public static generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    public static setExpirationTime = () => {
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 15); // OTP valid for 15 minutes
        return expiration;
    };
}
export default otpService;