"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const metrics_1 = __importStar(require("./routes/metrics"));
const PORT = process.env.PORT || 3000;
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const otpRoute = require('./routes/otp');
const walletConfRoute = require('./routes/walletConfRoutes');
const requestRoute = require('./routes/request').default;
app.use(bodyParser.json()); // For JSON
app.use(bodyParser.urlencoded({ extended: true })); // For form-encoded dataapp.use(express.json());
// Add metrics tracking middleware
app.use(metrics_1.trackHttpRequests);
// Routes
app.use('/', metrics_1.default);
app.use('/otp', otpRoute);
app.use('/user', userRoute);
app.use('/walletConfig', walletConfRoute);
app.use('/request', requestRoute);
app.use('/', authRoute);
// User.associate();
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
