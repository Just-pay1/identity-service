const { Sequelize } = require('sequelize'); 

const sequelize = new Sequelize('just-pay', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;