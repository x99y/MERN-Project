const http = require('http');
const { io: Client } = require('socket.io-client');
const initSocketServer = require('../sockets/websocket');
const { MessageModel } = require('../database/entities/Message');
const { create } = require('domain');
const { io } = require('socket.io-client');
const { disconnect, emit } = require('process');
const { promises } = require('dns');
const { resolve } = require('path');
const mongoose = require("mongoose");


jest.mock('../middleware/jwtFunctions', () => {
  const mongoose = require("mongoose");

  return {
    validateJWT: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        decodedValidToken: {
          userId: new mongoose.Types.ObjectId()
        }
      });
    })
  };
});

// Mock DB models used by the socket server so tests don't hit a real database
jest.mock('../database/entities/User', () => ({
  UserModel: {
    findById: jest.fn().mockImplementation((id) => ({
      exec: jest.fn().mockResolvedValue({ _id: id, username: 'testuser' }),
    })),
  },
}));

jest.mock('../database/entities/RoomChat', () => ({
  RoomChatModel: {
    findById: jest.fn().mockImplementation((id) => ({
      exec: jest.fn().mockResolvedValue({ _id: id, name: 'Test Room' }),
    })),
  },
}));

jest.mock('../database/entities/Profile', () => ({
  ProfileModel: {
    findOne: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue({ image: null }),
    })),
  },
}));

jest.mock('../database/entities/Message', () => ({
  MessageModel: {
    create: jest.fn().mockImplementation(async (msg) => ({
      ...msg,
      id: Date.now(),
    })),
    find: jest.fn().mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue([]),
    })),
  },
}));


describe('Websocket Test', () => {
  let httpServer;
  let clientSocket;
  let io;
  let port;
  
  
  // Start the server for testing
  beforeAll((done) => {
    httpServer = http.createServer();
    io = initSocketServer(httpServer);

    httpServer.listen(() => {
      port = httpServer.address().port;

      clientSocket = new Client(`http://localhost:${port}`, {
        extraHeaders: {
          cookie: "authcookie=FAKE_TOKEN"
        }
      });

      clientSocket.on('connect', done);
    });
  });

  // Close io and server
  afterAll(async () => {
    if (clientSocket?.connected) {
      await new Promise((resolve) => {
        clientSocket.once('disconnect', resolve);
        clientSocket.disconnect();
      });
    }
    await new Promise((resolve) => io.close(() => httpServer.close(resolve)));
  });
  
  // TESTS
  
  test('connection', () => {
    expect(clientSocket.connected).toBe(true);
  });

  test('emit typing event', (done) => {
    const data = {user: 'Jack', typing: true};

    // Second client
    const secondSocket = new Client(`http://localhost:${port}`, {
        extraHeaders: {
          cookie: "authcookie=FAKE_TOKEN_2"
        }
      });
    secondSocket.on('connect', () => {

      secondSocket.on('userTyping', (payload) => {
        expect(payload).toEqual(data);
        secondSocket.disconnect();
        done();
      });
      
      clientSocket.emit('typing', data);
    });
  });



  test('send and receive room messages', (done) =>{
    const roomId = new mongoose.Types.ObjectId();
    const msg = { text: 'room message'};

    const secondSocket = new Client(`http://localhost:${port}`, {
        extraHeaders: {
          cookie: "authcookie=FAKE_TOKEN_3"
        }
      });

    let joinedCount = 0;

    secondSocket.on('connect', () => {
      // Setup listener first
      secondSocket.on('roomMessage', (message) => {
        expect(message.content).toBe(msg.text);
        secondSocket.disconnect();
        done();
      });


      clientSocket.emit('joinRoom', roomId.toString());
      secondSocket.emit('joinRoom', roomId.toString());

      setTimeout(() => {
        clientSocket.emit('roomMessage', { roomId: roomId.toString(), msg: msg.text });
      }, 100);
    });
  });
});




