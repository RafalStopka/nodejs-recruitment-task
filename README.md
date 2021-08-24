# Node.js recruitment task

## Basic informations
  
  1. To start the project:
    i. Copy this repository
    ii. In the repository catalog, run
      ```
        docker-compose up
      ```
    iii. To modify enviroments variables, modify the .env file or run e.g
      JWT_SECRET=your_secret docker-compose
  2. To stop the project, run
    ```
      docker-compose down
    ```
     
## API DOCUMENTATION

  1. For all endpoints you have to provide body containing
    ```
    {
      username: username
      password: password
    }
    ```
    If this data is empty or incorrect, you will get 401 error status as response
  2. POST /movies
    i. Creates new movie. Basic users can create up to 5 movies per account. Premium users have no limits
    ii. You must provide additional parameter in the body:
    {
      ...
      title: title
    }
    iii. If the movie already exists, you will get 409 error status as response
    iv. After succesfully adding a movie, you will get 200 status as response
  3. GET /movies
    i. Returns all movies created by user.
    ii. If you are authorized, you will get status 200 and array of object of following type
      ```
        {
            "id": 7,
            "title": "Amazing SpiderMan2",
            "users_id": 434
        }
      ```

## Note

  The rules of the task and documentation of the auth service are on:
  https://github.com/netguru/nodejs-recruitment-task

  Due to problems with api keys on https://omdbapi.com/, I did not implement point 2 of the 
  `POST /movies` task.
    