//needs to serve up the public directory
const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');


const app = express(); //app will create routes, run middleware and listen
const server = http.createServer(app);
const io = socketIO(server); //returns websocket server
app.use(express.static(publicPath)); //configure our express static middleware

io.on('connection', (socket) => { //socket refers to the individual
  console.log('New user connected.'); //register for connected client to server

  socket.emit('newEmail', {
    from: 'mike@example.com',
    text: 'Hey. What is going on.',
    createdAt: 123
  });

  socket.on('createMessage', (newMessage)=>{
    console.log('createEmail', newMessage);
  });

  socket.on('disconnect', () =>{
    console.log('client disconnected');
});
});



server.listen(port, () => {
  console.log(`node-chat-app serving up port ${port}`);
});
