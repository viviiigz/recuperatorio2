import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
process.env.DB_NAME,
process.env.DB_USER,
process.env.DB_PASSWORD,
{
host: process.env.DB_HOST,
dialect: process.env.DB_DIALECT,

logging: false,
port: 3307 //por mi configuracion local 

});

export default sequelize;