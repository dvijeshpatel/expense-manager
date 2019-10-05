import mysql from 'mysql';

let connection: any;

const createConnection = () => {
    connection = mysql.createConnection({
        user: 'root',
        password: 'dvijesh123',
        host: '127.0.0.1',
        database : 'expense-manager',
    });
    connection.connect();
};

function getConnection() {
    return connection;
}

export {
    createConnection,
    getConnection,
};