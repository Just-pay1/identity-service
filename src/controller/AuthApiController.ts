import { Request, Response } from 'express';
import User from '../models/userModel';
import { where } from 'sequelize';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';


exports.login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({where :{ email}});
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
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

