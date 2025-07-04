import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/database';
import User from './userModel';

class Request extends Model {
    public id!: number;
    public user_id!: number;
    public message!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Association methods
    public getUser!: () => Promise<User>;
    public setUser!: (user: User) => Promise<void>;
}

Request.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Request',
        tableName: 'requests',
        timestamps: true,
    }
);

// Define associations
Request.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

User.hasMany(Request, {
    foreignKey: 'user_id',
    as: 'requests',
});

export default Request; 