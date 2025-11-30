import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        dialect:'postgres',
        logging:false,
        pool:{
            max:5,
            min:0,
            idle:10000,
            acquire:30000
        }
    }
);

const testConnection = async ()=>{
    try{
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    }catch(error){
        console.log('Failed to initialize database connection',error.message);
        process.exit(1);
    }
};

export { sequelize, testConnection };