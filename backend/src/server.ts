import 'reflect-metadata';
import {createConnection} from 'typeorm';
import http from 'http';
import app from './app';

// import { createConnection, getConnection } from './connection';

// (async () => {
//     await createConnection();
//     //console.log(getConnection());
//     const port: number = 3000;
//     const server: http.Server= http.createServer(app);
//     server.listen(port, () => {
//     console.log("Server is started on PORT", port);
//     });
// })();
 
createConnection().then(connection => {
    const port: number = 3000;
    const server: http.Server = http.createServer(app);
    server.listen(port, () => {
    console.log('Server is started on PORT', port);
    });
}).catch(error => console.log(error));