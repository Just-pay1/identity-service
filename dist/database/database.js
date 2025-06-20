"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Function to get Sequelize configuration
const getSequelizeConfig = () => {
    const env = process.env.DB_ENV;
    if (!['local', 'remote'].includes(env)) {
        throw new Error('Invalid DB_ENV value. Must be "local" or "remote".');
    }
    // Common configuration for both local and remote
    const commonConfig = {
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: console.log, // Optional: Enable logging
    };
    if (env === 'remote') {
        // Remote database configuration
        return new sequelize_1.Sequelize(process.env.DB_NAME_REMOTE, process.env.DB_USER_REMOTE, process.env.DB_PASSWORD_REMOTE, Object.assign({ host: process.env.DB_HOST_REMOTE, port: 3306, dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: true,
                },
            } }, commonConfig));
    }
    else {
        // Local database configuration
        return new sequelize_1.Sequelize(process.env.DB_NAME_LOCAL, process.env.DB_USER_LOCAL, process.env.DB_PASSWORD_LOCAL, Object.assign({ host: process.env.DB_HOST_LOCAL }, commonConfig));
    }
};
// Create the Sequelize instance
const sequelize = getSequelizeConfig();
sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
exports.default = sequelize;
