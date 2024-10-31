import { Request, Response } from 'express';
import User from '../models/userModel';
import { where } from 'sequelize';
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body;
        const unique = await isEmailUnique(email)
        if (!unique) {
            res.status(409).json({ error: 'This email address is already registered. Please use a different email or log in.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, phone, password });
        await user.save();
        const token = generateToken(user);
        res.status(200).json({ user, token });    
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
}


exports.login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({where :{ email}});
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
      
        // res.send(await bcrypt.compare(password, user.password))
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
  
}

const generateToken = (user : any) => {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30m' });
}

const isEmailUnique = async(email : string) => {
    const user = await User.findOne({ 
        where: { email: email}
    });
    return !user;
}

