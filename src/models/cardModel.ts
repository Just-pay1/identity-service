import { Model, DataTypes } from "sequelize";
import sequelize from '../database/database';
import User from "./userModel";
class Card extends Model{
    static validateAsync(body: any) {
        throw new Error('Method not implemented.');
    }

    public id!: number;
    public card_number!: string;
    public expirationDate!: string;
    public user_id!: number;
    public active!: boolean;

    toJSON() {
        const attributes = Object.assign({}, this.get());
 
        delete attributes.card_number; // Example of hiding the card_number field
        return attributes;
    }
}

Card.init({
    id: {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
    },
    card_number: {
        type : DataTypes.STRING,
        allowNull : false,
    },
    expirationDate: {
        type : DataTypes.STRING,
        allowNull : false,
    },
    user_id: {
        type : DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    active: {
        type : DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue: false,
    }
    
    },
    {
        sequelize,
        modelName: 'Card',
        timestamps: true
})

Card.belongsTo(User,{ foreignKey: 'userId' });

export default Card;