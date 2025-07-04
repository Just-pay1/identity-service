import express from "express";
const app = express();
const bodyParser = require('body-parser');
import sequelize from './database/database';
import User from './models/userModel';
import Card from './models/cardModel';
import Request from './models/requestModel';
import RabbitMQ from "./util/rabbitmq";
const PORT = process.env.PORT || 3000;

const userRoute = require('./routes/user')
const cardRoute = require('./routes/card')
const authRoute = require('./routes/auth')
const otpRoute = require('./routes/otp')
const walletConfRoute = require('./routes/walletConfRoutes')
const requestRoute = require('./routes/request').default
app.use(bodyParser.json()); // For JSON
app.use(bodyParser.urlencoded({ extended: true })); // For form-encoded dataapp.use(express.json());

app.use('/otp', otpRoute);
app.use('/user', userRoute);
app.use('/cards', cardRoute);
app.use('/walletConfig', walletConfRoute);
app.use('/request', requestRoute);
app.use('/', authRoute);


// User.associate();
// Card.associate();


// sequelize.sync({ alter: true })

sequelize.sync()

    // sequelize.sync()
    .then(() => {
        app.listen(PORT, async () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            const rabbitMQ = await RabbitMQ.getInstance()
        });
    })
    .catch((err: any) => {
        console.error('Unable to connect to the database:', err);
    });





