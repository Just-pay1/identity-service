import { Request, Response } from 'express';
import User from '../models/userModel';
import createUserSchema from '../models/userModel'
import updateUserSchema from '../models/userModel'
//import validator  from '../models/userModules';
const bcrypt = require('bcrypt');
interface Iuser {
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    city: string
}

exports.createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, city }: Iuser = req.body as Iuser;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email, password: hashedPassword, phone, city });

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

exports.searchUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        const authenticatedUserId = req.userId; // From auth middleware

        // Find the user by username
        const searchedUser = await User.findOne({
            where: { username: username },
            attributes: ['id', 'name', 'username'] // Only return safe fields
        });

        // If user not found
        if (!searchedUser) {
            return res.status(404).json({
                error: "Not found user with this username."
            });
        }

        // If authenticated user is searching for themselves
        if (searchedUser.id.toString() === authenticatedUserId?.toString()) {
            return res.status(400).json({
                error: "You are searching for yourself."
            });
        }

        // Return the found user (different user)
        res.status(200).json({
            id: searchedUser.id,
            name: searchedUser.name
            ,username: searchedUser.username
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
