import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(helmet());

app.use(cors({
    origin:process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials:true
}));

app.use(express.json());

app.use(express.urlencoded({ extended : true}));

if(process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'));
}

app.use('/api',routes);

app.get('/',(req,res)=>{
    res.status(401).json({
        success:false,
        message:'Route not found'
    });
});
app.use(errorHandler);

export default app;