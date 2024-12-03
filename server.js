import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Emit notifications to a specific user by userId
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room.`);
  });

  // Emit notification event
  socket.on("sendNotification", ({ userId, notification }) => {
    io.to(userId).emit("newNotification", notification);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});













// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';  // Import the CORS package

// const app = express();
// const server = createServer(app);

// // Allow CORS for your frontend URL (http://localhost:3000)
// app.use(cors({
//   origin: 'http://localhost:3000',  // Replace this with the URL of your frontend
//   methods: ['GET', 'POST'],         // Allow only GET and POST methods
//   allowedHeaders: ['Content-Type']  // Allow only the necessary headers
// }));

// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000', // Same as in the express middleware
//     methods: ['GET', 'POST'],
//   }
// });

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Send a message to the client
//   socket.emit('message', 'Welcome to the app!');

//   // Handle messages from the client
//   socket.on('clientMessage', (data) => {
//     console.log('Received from client:', data);
//     socket.emit('serverMessage', 'Message received');
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// server.listen(4000, () => {
//   console.log('Server running on http://localhost:4000');
// });
