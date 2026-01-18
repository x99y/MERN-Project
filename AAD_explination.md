# Application Architecture Diagram

![Application Architecture Diagram](Application%20Architecture%20Diagram.png)

> note because we are testing it is still possible to access the backend via postman, in future we dont have to allow this

## User

The user interacts with the frontend by sending and receiving information via HTTP and HTTPS requests. This includes cookies being parsed back to the user.

The user can only access the exposed frontend, via port 5173 (http://localhost:5173)

## Frontend
Exposed on port 5173 meaning it can be accessed out of the docker container. The front end handles all requests and sends HTTP requests to the backend container via the internal docker network.

## Backend

Exposed on host port 3000, accessible directly (http://localhost:3000).

Handles all API endpoints and logic, sending and receiving information from the Mongo DB container handling it all internally.

## Mongo Database
The mongo database is only accessable internally and not exposed to outside of the docker container for safety purposes. 

The database is also persistant and will not be reset on relaunch and resets of the container

# Other notes

This setup can be directly mirrored in EC2 instances if needed to be deployed to the cloud.
