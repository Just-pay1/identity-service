"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database/database"));
const userModel_1 = __importDefault(require("./userModel"));
class Card extends sequelize_1.Model {
    static validateAsync(body) {
        throw new Error('Method not implemented.');
    }
    toJSON() {
        const attributes = Object.assign({}, this.get());
        delete attributes.card_number; // Example of hiding the card_number field
        return attributes;
    }
    static associate() {
        Card.belongsTo(userModel_1.default, { foreignKey: 'user_id' });
    }
}
Card.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    card_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expirationDate: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: userModel_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize: database_1.default,
    modelName: 'Card',
    timestamps: true
});
exports.default = Card;
