const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const userController = require("./controllers/UserController")
const profileController = require("./controllers/ProfileController");
const connectionController = require("./controllers/ConnectionController");
const roomChatController = require("./controllers/RoomChatController");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");


// // Serve files from "public" folder
app.use(express.static(path.join(__dirname, "public")));


// Middleware Security Settings
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(cookieParser());

console.log("Frontend URL from env:", process.env.FRONTEND_URL);

// Allow requests only from this origins
let corsOption = { 
  credentials: true,
  origin: [
  process.env.FRONTEND_URL || "http://localhost:5173",
], optionsSuccessStatus: 200}
app.use(cors(corsOption));


// Json and form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// image storage 
const storage = multer.diskStorage({
  destination: function (request, fie, cb) {
    try {
    cb(null, '../src/public/uploads/')
    } catch (err) {
      console.log(err);
    }
  },
  filename: (request, file, cb) => {
    cb(null, file.fieldname+ '-' + Date.now())
    }
});


// Route to send the chat html page
app.get("/", (request,response) => {
  response.sendFile(path.join(__dirname, "public", "index.html"));
});


// Route to check MongoDB status
app.get("/databaseHealth", (request, response) => {
  let databaseState = mongoose.connection.readyState;
  let databaseName = mongoose.connection.name;
  let databaseModels = mongoose.connection.modelNames();
  let databaseHost = mongoose.connection.host;

  response.json({
  readyState: databaseState,
  dbName: databaseName,
  dbModels: databaseModels,
  dbHost: databaseHost
})
})

app.use("/users", userController);
app.use("/profiles", profileController);
app.use("/connection", connectionController);
app.use("/rooms", roomChatController);


// Error handler Middleware
app.use((error, request, response, next) => {
  response.json({
    error: error.message
  })
});


// 404 route  
app.all(/.*/, (request,response)=> {
  response.status(404).json({ message: " Route not found in this API",
  targetPath: request.path
  })
});


// Export the app
module.exports = {
  app, storage
}

