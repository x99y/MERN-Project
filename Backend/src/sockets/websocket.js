const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { MessageModel } = require("../database/entities/Message");
const { UserModel } = require('../database/entities/User');
const { RoomChatModel } = require('../database/entities/RoomChat');
const { ProfileModel } = require('../database/entities/Profile');
const { validateJWT } = require("../middleware/jwtFunctions");
const cookie = require("cookie");

// Initiates Socket.IO with the HTTP server with cors that defines the origins that can connect via WebSocket
module.exports = (server) => {
  
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: [ "GET" , "POST" ],
      credentials: true //Do this to accept cookies with the socket connection
    }
  });

  //Using a map for fast lookup
  const connectedUsers = new Map();

  function broadcastOnlineUsers() {
    const onlineList = Array.from(connectedUsers.keys());
    io.emit("onlineUsers", onlineList)
  }

  const findUserData = async (userId, msg) =>{

    let sendData = {
      content: msg,
      username : "User",
      profilePic : null,
      userId: userId
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user id');
      return sendData;
    }

    //Find the user creating the room
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      console.log('Cannot find user');
      return sendData;
    }

    sendData.username = user.username

    //Find the user creating the room
    const profile = await ProfileModel.findOne({ userId: userId }).exec();
    if (!profile) {
      console.log('Cannot find profile');
      return sendData;
    }

    sendData.profilePic = profile?.image || null;

    return sendData;

  };

  //Use middleware to check jwt cookies
  io.use( async (socket, next) => {
    try {
      const cookies = socket.request.headers.cookie;

      if (!cookies) {
        next(new Error('No cookies provided')); 
      }
      
      const parsedCookies = cookie.parse(cookies);

      //Find the auth cookie
      const authCookie = parsedCookies.authcookie || null

      if (!authCookie) {
        return next(new Error("No auth cookie data given"));
      }

      const userData = await validateJWT(authCookie);
        
      socket.user = userData.decodedValidToken.userId;

      console.log('User verified:', socket.user);

      next(); 
    } catch (error) {
      // reject connection
      console.log("Socket Authentication failed:", error);
      return next(new Error("Authentication error"));
    }
  })

  // Event Connection that triggers each time a new client connects to the server.
  io.on('connection',async (socket) => {
    console.log('a user connected:', socket.id, 'user:', socket.user);
    
    //Check if the user is already connected
    if (connectedUsers.has(socket.user)) {
      // disconnect the socket
      console.log('Already connected from another window');
      socket.emit("forceDisconnect", 'Already connected with this account');
      socket.disconnect(true);
      return;
    }

    
    //If not add user to the socket map
    connectedUsers.set(socket.user, socket.id);
    //console.log('a user connected:', socket.id);

    // broadcastOnlineUsers();


    socket.on("joinRoom", async (roomId) =>{
      try{
        // Validate that its a valid id
        const findRoom = await RoomChatModel.findById(roomId).exec();
        if (!roomId || !findRoom) {
          return new Error("Cannot find room");
        }

        console.log(`${socket.id} joined ${roomId}`);       
        
        //Group all sockets in the same room together
        socket.join(roomId);

        //Get the current rooms message history and sort it by date
        const messageHistory = await MessageModel.find({ roomId:roomId })
        .sort({ createdAt: 1 });

        let formatedHistory = []

        for (const msg of messageHistory) {
          const sendData = await findUserData(msg.senderId, msg.content)

          formatedHistory.push(sendData)
        }

        //Send the chat history to the socket
        socket.emit("restoreChatHistory", formatedHistory);
      }catch(error){
        console.log(error);
      }
    });

    // Notify when user is typing
    socket.on('typing', (data) => {
      socket.broadcast.emit("userTyping", data)
    });

    // Notify when user read the ,message
    socket.on("messageRead", (msgId) => {
      socket.broadcast.emit("messageReadBy",msgId)
    });

    // Event chat message starts when a client sends a chat message. Message is logged and broadcast to all connected clients  
    socket.on('roomMessage', async (data) => {
      try {
        //Get the user who sent the message
        const userId = socket.user;

        //Find the user creating the room
        const user = await UserModel.findById(userId).exec();
        if (!user) {
          console.log('Cannot find user');
          return;
        }

        const roomId = data.roomId;
        
        // Validate that its a valid id
        if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
          console.log('Invalid room id');
          return;
        }

        //Find the user creating the room
        const room = await RoomChatModel.findById(roomId).exec();
        if (!room){
          console.log('Cannot find room');
          return;
        }
        const msg = data.msg;

        console.log('userID roomMessage: ', userId);
        
        // Validate that its a valid id
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
          console.log('Invalid user id');
          return;
        }

        //Find the user creating the room
        const profile = await ProfileModel.findOne({ userId: userId }).exec();
        if (!profile) {
          console.log('Cannot find profile');
          return;
        }
      

        console.log(`user ${userId} says ${msg}`)

        const fullMessage = await MessageModel.create({
          roomId: roomId,
          senderId: userId,
          content: msg,
          status: 'SENT'
        })


        const sendData = {
          content: msg,
          username: user.username,
          profilePic: profile?.image || null,
          userId: userId,
        }

        //Only send back needed data
        io.to(roomId).emit("roomMessage", sendData);

        
      } catch (error){
        console.log('Error handling chat message:', error);
        socket.emit("forceDisconnect", "something went wrong when sending the message. Please reconnect");
        socket.disconnect(true);
      }
    });

    // Event Disconnect that triggers when a client disconnects.  
    socket.on('disconnect', () => {
      //Remove the connection from the map if it is found
      if (connectedUsers.get(socket.user) === socket.id) {
        connectedUsers.delete(socket.user);
      }

      console.log('user disconnected:', socket.id);

     // broadcastOnlineUsers();
    });


    // Notify when user read the ,message
    socket.on("messageDelete", async (msgId) => {
      try{
        //Get the user who sent the message
        const userId = socket.user;

        // Validate that its a valid id
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
          console.log('Invalid user id');
          return;
        }

        //Find the user creating the room
        const user = await UserModel.findById(userId).exec();
        if (!user) {
          console.log('Cannot find user');
          return;
        }
        
        // Validate that its a valid id
        if (!msgId || !mongoose.Types.ObjectId.isValid(msgId)) {
          console.log('Message id');
          return;
        }

        //Find the user creating the room
        const msg = await MessageModel.findById(msgId).exec();
        if (!msg){
          console.log('Cannot find message');
          return;
        }

        //Delete from the database?
        await MessageModel.findByIdAndDelete(msgId).exec()
      }catch(error){
        console.log('Error handling chat message:', err);
      }
    });

  });

  return io;
};
