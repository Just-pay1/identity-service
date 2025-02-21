import express from "express";
const app = express();
const bodyParser = require('body-parser');
import sequelize from './database/database';
import User from './models/userModel';
import Card from './models/cardModel';
const PORT = process.env.PORT || 3000;

const userRoute = require('./routes/user')
const cardRoute = require('./routes/card')
const authRoute = require('./routes/auth')
const otpRoute = require('./routes/otp')
app.use(bodyParser.json()); // For JSON
app.use(bodyParser.urlencoded({ extended: true })); // For form-encoded dataapp.use(express.json());

app.use('/otp', otpRoute);
app.use('/user', userRoute);
app.use('/cards', cardRoute);
app.use('/', authRoute);


User.associate();
Card.associate();


// sequelize.sync({ alter: true })

sequelize.sync()

// sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err: any) => {
        console.error('Unable to connect to the database:', err);
    });





