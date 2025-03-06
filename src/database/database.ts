import { Sequelize, Options  } from 'sequelize';
import dotenv from 'dotenv';



dotenv.config();

// Define a type for the environment
type Environment = 'local' | 'remote';

// Function to get Sequelize configuration
const getSequelizeConfig = (): Sequelize => {
  const env: Environment = process.env.DB_ENV as Environment;

  if (!['local', 'remote'].includes(env)) {
    throw new Error('Invalid DB_ENV value. Must be "local" or "remote".');
  }

  // Common configuration for both local and remote
  const commonConfig: Options = {
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: console.log, // Optional: Enable logging
  };

  if (env === 'remote') {
    // Remote database configuration
    return new Sequelize(
      process.env.DB_NAME_REMOTE!,
      process.env.DB_USER_REMOTE!,
      process.env.DB_PASSWORD_REMOTE!,
      {
        host: process.env.DB_HOST_REMOTE!,
        port: 3306,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: true,
          },
        },
        ...commonConfig,
      }
    );
  } else {
    // Local database configuration
    return new Sequelize(
      process.env.DB_NAME_LOCAL!,
      process.env.DB_USER_LOCAL!,
      process.env.DB_PASSWORD_LOCAL!,
      {
        host: process.env.DB_HOST_LOCAL!,
        ...commonConfig,
      }
    );
  }
};

// Create the Sequelize instance
const sequelize = getSequelizeConfig();

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;