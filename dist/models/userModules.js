"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database/database"));
const Ajv = require('ajv');
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new Ajv();
(0, ajv_formats_1.default)(ajv);
class User extends sequelize_1.Model {
}
const userSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 3, pattern: '^[A-Z][a-zA-Z]*$', },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        phone: { type: 'string', minLength: 10 }
    },
    required: ['name', 'email', 'password', 'phone'],
    additionalProperties: false
};
exports.validator = ajv.compile(userSchema);
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'User',
    timestamps: true
});
exports.default = User;
