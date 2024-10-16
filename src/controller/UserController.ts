import { Request, Response } from 'express';
import User from '../models/user';

interface user {
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string
}

exports.createUser = async (req: Request, res: Response) => {
    try {
        const { id, name, email, password, phone }: user = req.body as user;

        const newUser = await User.create({ id, name, email, password, phone });

        res.status(200).json({ message: 'User created successfully', newUser });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
