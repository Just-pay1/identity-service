"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database/database"));
const userModel_1 = __importDefault(require("./userModel"));
class Request extends sequelize_1.Model {
}
Request.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.default,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Request',
    tableName: 'requests',
    timestamps: true,
});
// Define associations
Request.belongsTo(userModel_1.default, {
    foreignKey: 'user_id',
    as: 'user',
});
userModel_1.default.hasMany(Request, {
    foreignKey: 'user_id',
    as: 'requests',
});
exports.default = Request;
