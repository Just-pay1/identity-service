import { request, Request, Response } from 'express';
import User from '../models/user';

exports.createCard = (req: Request, res: Response) => {
    const IIN:string = "400000"
    // var user_id:any = user.id
    var user_id:string = req.body.user_id
    console.log(user_id)
    var user_id = user_id.padStart(4, '0')
    let accountNumber = "";
    for (var i = 0; i < 5; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }
    const partialCardNumber = IIN + user_id + accountNumber
    const checkDigit = calculateLuhnCheckDigit(partialCardNumber)
    

    return  res.send(partialCardNumber + checkDigit);

}

const calculateLuhnCheckDigit = (number: string): number => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;

    }
    // The check digit is what makes the sum a multiple of 10
    return (sum * 9) % 10;
}