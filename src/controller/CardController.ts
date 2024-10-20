import { request, Request, Response } from 'express';
const crypto = require('crypto');
import User from '../models/userModel';

exports.createCard = (req: Request, res: Response) => {
    const IIN:string = "400000" // Issuer Identification Number
    // var user_id:any = user.id
    var user_id:string = req.body.user_id
    var user_id = user_id.padStart(4, '0')
    let accountNumber = "";
    for (var i = 0; i < 5; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }
    const partialCardNumber = IIN + user_id + accountNumber
    const checkDigit = calculateLuhnCheckDigit(partialCardNumber)
    const cardNumber = partialCardNumber + checkDigit
    const expirationDate = generateExpirationDate()
    console.log(expirationDate)
    const cvc = generateCVC(cardNumber, expirationDate)
    
    return  res.status(200).json({cardNumber: cardNumber, expirationDate: expirationDate, cvc: cvc});

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

const generateExpirationDate = () : string => {
    const now = new Date()
    const expiryYear = (now.getFullYear() + 5).toString().slice(2);  
    const expiryMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${expiryMonth}/${expiryYear}`;
}

const generateCVC = (cardNumber: string, expirationDate : string): string => {
    const inputString = cardNumber + expirationDate;
    const hash = crypto.createHash('sha256').update(inputString).digest('hex');
    const hashNumber = parseInt(hash.substring(0, 6), 16); 
    const cvc = hashNumber % 1000;
    return cvc.toString().padStart(3, '0');
}