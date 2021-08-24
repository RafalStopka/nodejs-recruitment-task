const mysql = require('mysql2/promise');

let connection;

const config = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME
}

async function createConnection(config){
    try{
        connection = await mysql.createConnection(config);
        return connection;
    }
    catch(error){
        console.log(`Cannot connect to database. Reason: \n${error}`)
    }
}

async function insertMovie(title, userID){
    const [rows] = await connection.query('INSERT INTO movies (title, users_id) VALUES (?,?);', [title, userID]);
    return rows;
}

async function insertDetails(details, movieID){
    const [rows] = await connection.query('INSERT INTO details (released, genre, director, movies_id) VALUES (?,?,?,?);', [...details, movieID]);
    return rows;
}

async function getMovies(userID){
    const [rows] = await connection.query('SELECT * FROM movies WHERE users_id = ?;', [userID]);
    return rows;
}

//this should be changeg to a trigger
async function incrementMoviesNumber(userID){
    const [rows] = await connection.query('UPDATE users SET movies = movies + 1 WHERE id = ?', [userID]);
    return rows;
}

async function getMoviesNumber(userID){
    const [rows] = await connection.query('SELECT movies FROM users WHERE id = ?;', [userID]);
    return rows;
}

async function checkIfMovieAlreadyExists(title, userID){
    const [rows] = await connection.query(`
        SELECT movies.title
        FROM movies
        INNER JOIN users
        ON movies.users_id = users.id
        WHERE movies.users_id = ?
        AND movies.title = ?;`,
        [userID, title]);
    return rows;
}

async function main(){
    await createConnection(config);
}

main();

module.exports = {
    createConnection,
    insertMovie,
    getMovies,
    getMoviesNumber,
    insertDetails,
    checkIfMovieAlreadyExists,
    incrementMoviesNumber,
}
