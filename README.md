# projectBasmach
dress for u😀😀😀

# Fullstack project with React, Node.js and MongoDB

This is a fullstack project that uses React for the frontend, Node.js for the backend, and MongoDB for the database. The project allows users to create, read, update and delete items from a database.

## Starting

To get started with this project, follow these steps:

1. Copy the repository to your local computer
2. Install the dependencies for the frontend and backend by running npm install on the client and server directories
3. Start the front-end and back-end servers by running npm start on the client and server directories

## Fronted

The front end of this project is built with React and allows users to interact with the database through a user interface. The frontend is located in the client directory.

### dependency

The front-end dependencies are listed in the client/package.json file and include:

- react and react-dom for building the user interface
- axios for making HTTP requests to the back-end API
- react-router-dom to handle client-side routing
- bootstrap for designing the user interface

### Starting the frontend

To start the frontend, run npm start in the client directory. This will start the development server and open the app in your default browser.

## Backend

The backend of this project is built with Node.js and uses MongoDB as the database. The backend is located in the server directory.

### dependency

The backend dependencies are listed in the server/package.json file and include:

- express for building the server and handling HTTP requests
- mongoose to interact with the MongoDB database
- cors to handle cross origin requests

### Starting the backend

To start the backend, run npm start in the server directory. This will start the server and listen for HTTP requests on port 5000.

## API

The backend API allows users to create, read, update, and delete items from the database. The API endpoints are:

- GET /items - Get all items from the database
- POST /items - Create a new item in the database
- GET /items/:id - Get a single item from the database by id
- PUT /items/:id - Update a single item in the database by id
- DELETE /items/:id - Delete a single item from the database by id

## Database

This project uses MongoDB as the database. The database is hosted on MongoDB Atlas and can be accessed using the connection string in the server/config/db.js file.

## Summary

that's it! You should now have a working fullstack project using React, Node.js and MongoDB. Feel free to modify the code and experiment with different features.
