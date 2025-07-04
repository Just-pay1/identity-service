import { Request as ExpressRequest, Response } from 'express';
import RequestModel from '../models/requestModel';
import User from '../models/userModel';

class RequestController {
    // Create a new request
static async createRequest(req: ExpressRequest, res: Response) {
        try {
            const  message  = req.body.message;
            const user_id = req.userId;

            // Validate required fields
            if ( !message) {
                res.status(400).json({
                    success: false,
                    message: 'message is required'
                });
                return;
            }

            // Check if user exists
            const user = await User.findByPk(user_id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            // Create the request
            const newRequest = await RequestModel.create({
                user_id,
                message
            });

            res.status(201).json({
                success: true,
                message: 'Request created successfully',
                data: newRequest
            });

        } catch (error) {
            console.error('Error creating request:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    
}

export default RequestController; 