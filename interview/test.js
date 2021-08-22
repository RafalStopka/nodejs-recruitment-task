const mysql = require('mysql2/promise');

let connection;

async function createConnection(){
    try{
        // connection = await mysql.createConnection(config);
        connection = await mysql.createConnection({
            host: 'database',
            user: process.env.DATABASE_USER,
            database: process.env.DATABASE_NAME
        });

        let [result] = await connection.query(`SELECT * FROM users`);
        console.log(result);
    }
    catch(error){
        console.log(`Cannot connect to database. Reason: \n${error}`)
    }
}

async function insertMovie(title, userID){
    let result = await connection.query('INSERT INTO movies VALUES (?,?)', [])
}

async function getMovies(userID){
    let result = await connection.query('SELECT * FROM movies WHERE users_id = ?', [userID])
}

async function main(){
    await createConnection();
}

main();
