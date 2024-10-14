import { Request, Response } from 'express';
const user = require('../models/user');

interface Iuser {
    id: number,
    name: string,
    email: string,
    password: string,
    phone: number
}

const createUser = async (req: Request, res: Response) => {
    try {
        const { id, name, email, password, phone }: Iuser = req.body as Iuser;

        const newUser = await user.create({ id, name, email, password, phone });

        res.status(200).json({ message: 'User created successfully', newUser });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
