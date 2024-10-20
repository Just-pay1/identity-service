import { Request, Response } from 'express';
import User from '../models/userModel';
import createUserSchema from '../models/userModel'
import updateUserSchema from '../models/userModel'
//import validator  from '../models/userModules';
interface Iuser {
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string
}

exports.createUser = async (req: Request, res: Response) => {
    try {
        const { id, name, email, password, phone }: Iuser = req.body as Iuser;

        const newUser = await User.create({ id, name, email, password, phone });

        res.status(200).json({ message: 'User created successfully', newUser });
    } catch (error: any) {
        if (error.isJoi === true) {
            res.status(422).json({ message: 'validation error' })
        }
        res.status(500).json({ message: error.message });
    }
}

exports.getAllUser = async (req: Request, res: Response) => {
    try {
        const allUsers = await User.findAll();
        res.status(200).json({ message: 'users retrieved successfully', allUsers });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

exports.getUserById = async (req: Request, res: Response) => {
    try {
        const UserById = await User.findByPk(req.params.id);
        res.status(200).json({ message: 'User retrieved successfully', UserById });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser = await User.update(updatedData, { where: { id: userId } });

        if (updatedUser[0] === 0) {
            return res.status(404).json({ message: 'User not found' })
        }

        const theNewUser = await User.findOne({ where: { id: userId } });

        if (theNewUser) {

            console.log('Updated User Data:', theNewUser.get());
            res.status(200).json({ message: 'User updated successfully', theNewUser });

        } else {
            res.status(404).json({ message: 'User not found after update' });
        }

    } catch (error: any) {
        if (error.isJoi === true) {
            error.status(422).json({ message: 'validation error' })
        }
        res.status(500).json({ message: error.message });
    }
}

exports.deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const deletedUser = await User.destroy({ where: { id: userId } });

        if (deletedUser === 0) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User deleted successfully', deletedUser });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
