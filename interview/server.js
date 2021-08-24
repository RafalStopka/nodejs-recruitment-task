const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const { insertMovie, getMovies, getMoviesNumber, checkIfMovieAlreadyExists, insertDetails, incrementMoviesNumber } = require('./connection.js');

const app = express();

const PORT = 3001;

app.use(bodyParser.json());

async function auth(request, response, next){
    try{
        const { username, password } = request.body;
        await axios.post('http://auth:3000/auth',{
            username: username,
            password: password,
        })
        .then(result => {
            if(result.status === 200){
                request.token = result.data.token;
                next();
            } 
            else return response.status(404).json('No token in response');
        })
        .catch(error=>{
            return response.status(error.response.status).json(error.response.data);
        });
    }
    catch(error){
        console.error(`Error in auth()`);
        next(error);
    }
}

function decodeToken(request, _, next){
    try{
        const { token } = request;
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = decoded;
        }
        next();
    }
    catch(error){
        console.error(`Error in decodeToken()`);
        console.log(error);
    }
}

async function checkIfMovieExistsAndAdd(title, userID){
    try{
        let movieAlreadyExists = await checkIfMovieAlreadyExists(title, userID);
        if(movieAlreadyExists.length) return -1;
        let movieID = (await insertMovie(title, userID)).insertId;
        await insertDetails(['1970-01-01','Some genre','Some director'], movieID);
        await incrementMoviesNumber(userID);
    }
    catch(error){
        console.error(`Error in checkIfMovieExistsAndAdd()`);
        console.log(error);
    }
}

const middleware = [auth, decodeToken];

app.post("/movies", middleware, async(request, response, next) => {
    try {
        const { user } = request;
        const { title } = request.body;

        if(user){
            switch(user.role){
                case 'basic':
                    const movies = await getMoviesNumber(user.userId);
                    if(movies[0].movies >= 5) return response.status(409).json({message: 'You have reached the limit of movies on the basic account'});
                break;
            }
            const canAdd = await checkIfMovieExistsAndAdd(title, user.userId);
            if(canAdd == -1) return response.status(409).json({message: 'This movie already exists on your account'});
            return response.status(200).json({message: 'Movie added to your account'});
        }
        return response.status(404).json({message: 'No user found'});
    }
    catch (error) {
        next(error);
    }
});

app.get("/movies", middleware, async(request, response, next) => {
    const { user } = request;
    if(user){
        const movies = await getMovies(user.userId);
        return response.status(200).json({movies: movies});
    }
    return response.status(404).json({message: 'No user found'});
});

app.use((error, _, response, __) => {
    console.error(`Error processing request ${error}. See next message for details`);
    console.error(error);
    return response.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Interview service is running at port ${PORT}`);
});

module.exports = {
    app,
}