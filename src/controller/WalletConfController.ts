import { Request, Response } from "express";
import User from "../models/userModel";
import sendMessage  from '../services/rabbitmq';

exports.checkUsernameAvailability = async (req: Request, res: Response) =>{
    try {
        const { username } = req.body;
        
        if (!username){
            return res.status(400).json({ error: "Username is required" });
        }

        const user = await User.findOne({where : {username}}); 

        return res.json({ available: !user });
    }catch (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

exports.addUsername = async ( req: Request, res: Response) => {
    console.log('heer')
    try {
        const user_id = req.userId;
        // console.log(user_id)
        const { username } = req.body;
        // console.log(username);

        const user = await User.findByPk(user_id);
        if (!user){
            return res.status(404).json({ message: "User not found"});
        }
        await user.update({username: username});
        return res.status(200).json({ message: "username added successfully"});
    }catch (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
exports.addPinCode = async ( req: Request, res: Response) => {
    try {
        const user_id = req.userId;
        const { pin_code } = req.body;
        const user = await User.findByPk(user_id);
        if (!user){
            return res.status(404).json({ message: "User not found"});
        }
        await user.update({pin_code: pin_code});
        return res.status(200).json({ message: "pin_code added successfully"});
    }catch (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

exports.pinCodeConfirmation = async (req: Request, res: Response) => {
    try {
        const user_id = req.userId;
        const { pin_code :pin_code_confirmed } = req.body;
        const user = await User.findByPk(user_id);
        if (!user){
            return res.status(404).json({ message: "User not found"});
        }
        const pin_code = user.pin_code;
        console.log(pin_code);
        if (pin_code !== pin_code_confirmed){
            return res.status(400).json({ message: "Pin code Mustmatch" });
        }
        await user.update({pin_code_confirmation: true}); 
        await sendMessage('wallet_creation', { userId: user.id, username: user.username });
        return res.status(200).json({ message:"pin code confirmed" , username: user.username});
    }catch (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}