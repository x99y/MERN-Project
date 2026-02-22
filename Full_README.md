
## MESSAGE APP (MERN Project)

This project is a **backend API** that provides profile management, connections, user authotentication and real time chats. 
Is built for a MERN (MongoDB, Express, React, NodeJS) based Message app.
 
-----------------------------------------------
### Overview

The app allows users to:
- Connect with other users.
- Create, update and delete room chat.
- Join room chat and chat in real time using Socket.IO
- Upload and update images for profiles using Multer.
- Create, update and delete user profile.


-----------------------------------------------
### **Dependent Software and Packages**
-----------------------------------------------
| Technology | Fuction | License | Alternatives 
|------------|---------|---------| ----------| 
|**NodeJS / ExpressJS**| Main framework for middleware, handling routes and APIs.| MIT | Koa, Fastify, Hapi |
|**CORS**| Manages request between frontend and backend | MIT | 
|**Helmet**| Adds HTTP headers for more API security and access control| MIT |
|**Socket.IO**| Enables real time chats with a communication between users and the server | MIT | Websocket API, Pusher |
|**Mongoose**| Give structure and validation for MongoDB data simplifing data modeling| MIT | MySQL, PostgreSQL |
|**JSON Web Token (JWT)**| To ensure authentication and input handling | MIT |
|**Multer**| For profile pictures and simpler file and media handling| MIT | Formidable, Busboy |
|**Jest and Supertest**| for testing and simulating functions| MIT | vitest, mocha |
|**Validators**| Serves a secure input handling like JWT | MIT |



#### Node.Js
Core environment of the backend. Allows JavaScript to run in the app outside of the browser so we can use the same languague in the backend and frontend. Provides asynchonus, event-driven architecture that ensures very efficient handling of mutiple requests at the same time. We choosed Node.js instead of other technolies like Flask or Django because its one the most widely used backend techonolies right now and is ideal for this prject idea of a chatting real time chatting app where the data is processed and transmitted between users in instants. 

#### Express.Js
Framework for web applications used to handle server logic, routing and middleware within the Node environment. Manages HTTP request and responses, and defines the API endpoints in a simplier way. We used for the foundations of the server.js and the routes of this prject like /users, /profiles, /connection. And the implementation of athentification, session and error handling. We choosed Express instead of Koa or Fastify because is the most advance and supported by the community, it's simple and easy to use.

#### MongoDB and Mongoose
For our project database we used MongoDB(NoSQL) connected through the object data modelling library Mongoose, that simplifies data handling in Node. MongoDB stores data in a free schema and scalable data management way in form of flexible JSON files making it perfect for aplications where user profiles and their messages can have different structures. With Mongoose we could implement schemas, validations and relationships.
MongoDB offers better performance for dynamic and realtime data models and operations, because of that we choosed this technology and not others like PostgreSQL or MySQL.

#### Helmet and CORS
Helmet set configurations for HTTP response headers to protect the server from web vulnerabilities. Meanwhile, CORS controls which client domains are permitted to interact with our API, meaning only authorized external sourced can access. Both technologies reinforce this project security infrasctructure.

#### JWT - Jsonwebtoken
This package implements athentification using JSON Web Tokens. Allowing verification of users identities by joining user data with encrypted tokens signed with a secret key. JWT doesn't require server storage of session helping the app to run on better performance. Other alternatives to this are AuthO and PassportJS.

#### Jest nad SuperTest
This are testing tools, Jest is used for mainly testing framework with a fast and reliable integration testing with built in mocking options. Supertest is an extension of Jest that adds direct HTTP assertions on Express endpoints for an end to end API testing in a controlled environment.

#### Cookie Parser and Validator
Cookie Parser parses the cookies sent by clients, allowing easy access to their session and is a solution for cookie based authentification. On the other hand, Validator library is used to ensure that user data meets specific format and/or requirements, like checking if the email is valid before adding it to the database for example.

#### Multer
Is used to manage file uploads in the application, primarily for profile images and chat media. Defines destination paths and naming conventions for stored files. There are alternatives like Formidable or Busboy but they require more manual setup, Multer's is efficient and easy to use.

**ALL DEPENDENCIES USED ARE LICENSED UNDER THE MIT LICENSE, WITH AND OPEN-SOURCE NATURE AND INDUSTRY RELEVANCE**


---------------------

### INSTALLATION GUIDE

#### Hardware and System Requirements
To run this application you need minimal hardware. A 64-bit operation system (MacOS, Windows10 or Linux) with a at least 4gb of RAM to run Node.Js and MongoDB in comftable way, and a stable internet connection to support local server execution and Websocket communication. Plus a minimun of 2gb storage for dependencies and database storage.
Node.JS (v18 or later recommended), it's package manager (npm) and MongoDB must be installed.


--------------------------
#### 1 - Install Node.JS
You'll need to have homebrew installed in your system for mac and linux and input:
    
    brew install node
in your terminal. For windows you can use WSL to install homebrew or download directly from the node offical website (link: https://nodejs.org/es) this is the easiest way.

After the installation is completed.

    node -v npm -v
To check the version and confirm it's been installed succesfully.

-------------------------
#### 2 - Install MongoDB
For MongoDB you can user a cloud database with MongoDB Atlas or if you wish to install it locally you can download it from the MongoDB official website (link:https://www.mongodb.com/try/download/community).

-------------------------
#### 3 - Cloning the Repository to your local system
Open the terminal and run:

    git clone https://github.com/maxmoeller-147/MERN-Project.git

Once you have a local copy of the project. navigate into the project directory to install the packages and dependencies.

-------------------------
#### 4 - Install Packages and Dependencies
In the project directory terminal run: 
    
    npm install

This will automatically download and install all the necessary packages and create a node_modules folder in your directory. If an error occur just delete the node_modules folder and package-lock.json files and run 'npm install' again.

--------------------------
#### 5 - Environment Configuration
Database connection and authentification requires environment variables configuration. Create a file named '.env' in the project root directory and then you can copy this:

    PORT=3000
    MONGO_URI=mongodb://127.0.0.1:27017/DatingAppDatabase
    JWT_SECRET=your_secret_key

This is a typical setting file. 

---------------------------
#### 6 - Run Application
After all the prevoius steps are finished, the app is ready to start. 
    
    npm run dev

To start the server with auto reaload on changes. The app can be accessed here: (link:http://localhost:3000)
   
    npm start
To run the server in production mode.
   
    npm test
   
To run the Jest test for testing of different features the app has to offer.

If MongoDB is running locally, ensure it is active before launching the server.

To ensure MondoDB is connected correctly, Access (link: http://localhost:3000/databaseHealth) in the browser or a tool like Postman or Insomnia. This returns a JSON file that contains the connection status, database name and host details.  



---------------------
### Programming style
This project used W3school JavaScript style guide (link: https://www.w3schools.com/js/js_conventions.asp). The style guide describes the general Javascript code conventions, including:
* Naming and declaration rules for variables and functions.
* Rules for the use of white space, indentation, and comments.
* Programming practices and principles.

Please follow this style guide when you contribute to the project. This ensure code readbility and ensure coding style consistent. Thank you for your support!


-----------------------
### Contributors:
* Phoung(link:https://github.com/phuongle1911)
* Jack(link:https://github.com/x99y)
* Max(link:https://github.com/maxmoeller-147)
