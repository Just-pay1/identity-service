"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const bodyParser = require('body-parser');
const database_1 = __importDefault(require("./database/database"));
const rabbitmq_1 = __importDefault(require("./util/rabbitmq"));
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
    app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Server is running on http://localhost:${PORT}`);
        const rabbitMQ = yield rabbitmq_1.default.getInstance();
    }));
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
