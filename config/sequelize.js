import { Sequelize } from 'sequelize';

export default new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: 'postgres',
    logging: false,
  }
);
