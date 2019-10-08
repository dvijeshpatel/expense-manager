import 'reflect-metadata';
import { createConnection } from 'typeorm';
import http from 'http';
import app from './app';
 
createConnection().then(() => {
    const server: http.Server = http.createServer(app);
    server.listen(process.env.PORT, () => {
        console.log('Server is started on PORT', process.env.PORT);
    });
}).catch(error => console.log(error));