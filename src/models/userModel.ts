import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/database';
class User extends Model {
    static validateAsync(body: any) {
        throw new Error('Method not implemented.');
    }
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public phone!: string;
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