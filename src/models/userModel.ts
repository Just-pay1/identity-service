import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/database';
import Card from './cardModel';
const bcrypt = require('bcrypt');
class User extends Model {
    static validateAsync(body: any) {
        throw new Error('Method not implemented.');
    }
    public id!: number;
    public name!: string;
    public email!: string;
    public username!: string;
    public password!: string;
    public phone!: string;
    public otp!: string | null;
    public otp_expired_at!: Date | null;
    public pin_code!: string | null;
    public pin_code_confirmation!: boolean | null;

    // static associate() {
    //     User.hasMany(Card, { foreignKey: 'user_id' });
    // }

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
        username: {
            type: DataTypes.STRING,
            allowNull: true,
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
        otp: {
            type: DataTypes.STRING,
            allowNull: true,

        },
        otp_expired_at: {
            type: DataTypes.DATE,
            allowNull: true,

        },
        pin_code: {
            type: DataTypes.STRING,
            allowNull: true,

        },
        pin_code_confirmation: {
            type: DataTypes.BOOLEAN,
            allowNull: true,

        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'cairo'
        },
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true
    }
);
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});


export default User;

