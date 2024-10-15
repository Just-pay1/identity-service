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
app.use(bodyParser.json());
app.use(express_1.default.json());
app.use('/user', userRoute);
database_1.default.sync()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
