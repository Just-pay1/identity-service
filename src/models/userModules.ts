import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/database';
const Ajv = require('ajv');
import addFormats from 'ajv-formats';
const ajv = new Ajv();
addFormats(ajv);
class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public phone!: string;
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

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true
    }
);

export default User;