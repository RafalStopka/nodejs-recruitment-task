const { request } = require('express');
const chai = require('chai')
const chaiHttp = require('chai-http');
const { insertMovie, getMovies, getMoviesNumber, checkIfMovieAlreadyExists, insertDetails,
     incrementMoviesNumber, createConnection } = require('./connection.js');

const { app } = require('./server.js')

const databaseConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME
}

chai.use(chaiHttp);

describe('Interview application', ()=>{
    
    let connection;

    before( async () =>{
        connection = await createConnection(databaseConfig);
        if(!connection) throw new Error('Application should connect to the database');
    });

    it('Should add data assosiated with the test user', async ()=>{
        let addMovie = await insertMovie('some title', 1);
        if(!addMovie.insertId) throw new Error('Application should add new movie');
        const addDetails = await insertDetails(['1970-01-01', 'some genre', 'some director'], addMovie.insertId);
        if(!addDetails) throw new Error('Application should add details to new movie');
        const increment = await incrementMoviesNumber(1);
        if(!increment) throw new Error('Application should increment number of movies on user account');
    });

    it('Should get data assosiated with the test user', async ()=>{
        const moviesNumber = await getMoviesNumber(1);
        if(!moviesNumber) throw new Error('Application should add new movie');
        const movies = await getMovies(1);
        if(!movies) throw new Error('Application should add details to new movie');
    });

    it('Should detect that movie already exist on user account', async ()=>{
        const copy = await checkIfMovieAlreadyExists('some title', 1);
        if(!copy) throw new Error('Application should detect existance of movie with the same title on this user account');
    });

    it('Should reject unautharized user request', async ()=>{
        chai.request(app)
            .get('/movies')
            .send({password: '', login: ''})
            .end((error, response)=>{
                chai.expect(response.status).to.be.within(400, 404);
            })
    });

    it('Should accept autharized user request', async ()=>{
        chai.request(app)
        .get('/movies')
        .set('content-type', 'application/json')
        .send({password: 'sR-_pcoow-27-6PAwCD8', username: 'basic-thomas'})
        .end((error, response)=>{
            chai.expect(response).to.have.status(200);
        })
    });
});