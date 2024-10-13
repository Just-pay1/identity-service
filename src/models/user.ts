import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';

class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public phone!: number;
}

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
            type: DataTypes.NUMBER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
    }
);

export default User;