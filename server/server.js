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
  socket.emit('newMessage', {
    from: "Admin",
    text: "Welcome to the node-chat-room"
  });
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user has joined'
  });

  socket.on('createMessage', (newMessage)=>{
    console.log('createEmail', newMessage);
    // io.emit('newMessage', { //io.emit emits a message to every single connection
    //   from: newMessage.from,
    //   text: newMessage.text,
    //   createdAt: new Date().getTime()
    // })
    // socket.broadcast.emit('newMessage', {
    //   from: newMessage.from,
    //   text: newMessage.text,
    //   createdAt: new Date().getTime()
    })


  socket.on('disconnect', () =>{
    console.log('client disconnected');
});
});



server.listen(port, () => {
  console.log(`node-chat-app serving up port ${port}`);
});
