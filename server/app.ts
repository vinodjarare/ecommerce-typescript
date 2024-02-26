import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import errorMiddleware from './middleware/errorMiddleware';
import router from './routes/router';
import * as dotenv from 'dotenv';
import { IUser } from './types/models';
dotenv.config({ path: 'server/config/config.env' });

const app: Application = express();


declare global {
    namespace Express {
      interface Request {
        user?:  null | IUser;
      }
    }
  }

app.use(express.json());

app.use(morgan('dev'));

app.use('/api/v1', router);

app.use('/', (req: Request, res: Response) => res.send('Hello World'));
app.use(errorMiddleware);

export default app;
