import express from 'express';
import user from './routes/user';

const app: express.Express = express();

app.use(express.urlencoded({ extended: false} ));
app.use(express.json());

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type,Accept,Autherization');
    next();
});

app.use('/user', user);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {    
    const error = new Error('Not Found');
    next(error);
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(400).json({
        message: err.message,
    });
});

export default app;