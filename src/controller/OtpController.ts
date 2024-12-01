import { Request, Response } from 'express';


export const getUserProfile = (req: Request, res: Response) => {

    res.json(req.userId)

};
