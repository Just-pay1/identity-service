"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const bodyParser = require('body-parser');
const database_1 = __importDefault(require("./database/database"));
const PORT = process.env.PORT || 3000;
const userRoute = require('./routes/user');
const cardRoute = require('./routes/card');
const authRoute = require('./routes/auth');
const otpRoute = require('./routes/otp');
const walletConfRoute = require('./routes/walletConfRoutes');
app.use(bodyParser.json()); // For JSON
app.use(bodyParser.urlencoded({ extended: true })); // For form-encoded dataapp.use(express.json());
app.use('/otp', otpRoute);
app.use('/user', userRoute);
app.use('/cards', cardRoute);
app.use('/walletConfig', walletConfRoute);
app.use('/', authRoute);
// User.associate();
// Card.associate();
// sequelize.sync({ alter: true })
database_1.default.sync()
    // sequelize.sync()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
