"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const bodyParser = require('body-parser');
const database_1 = __importDefault(require("./database/database"));
const userModel_1 = __importDefault(require("./models/userModel"));
const cardModel_1 = __importDefault(require("./models/cardModel"));
const PORT = process.env.PORT || 3000;
const userRoute = require('./routes/user');
const cardRoute = require('./routes/card');
const authRoute = require('./routes/auth');
app.use(bodyParser.json());
app.use(express_1.default.json());
app.use('/user', userRoute);
app.use('/cards', cardRoute);
app.use('/', authRoute);
userModel_1.default.associate();
cardModel_1.default.associate();
database_1.default.sync()
    //sequelize.sync({ alter: true })
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
