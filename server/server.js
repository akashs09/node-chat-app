//needs to serve up the public directory
const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');
// const mustache
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');


const app = express(); //app will create routes, run middleware and listen
const server = http.createServer(app);
const io = socketIO(server); //returns websocket server
let users = new Users();
app.use(express.static(publicPath)); //configure our express static middleware

io.on('connection', (socket) => { //socket refers to the individual
  console.log('New user connected.'); //register for connected client to server
  // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the node-chat-room'))  ;
  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user has joined'));
  socket.on('join', (params, callback) =>   {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room are required.');
    }
    //just emit chat messages just to ppl in a certain room
    socket.join(params.room);//now have a group to ppl to talk in teh same room
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the node-chat-room'))  ;
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback()
  });
  socket.on('createMessage', (message, callback)=>{
    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
    // socket.broadcast.emit('newMessage', {
    //   from: newMessage.from,
    //   text: newMessage.text,
    //   createdAt: new Date().getTime()
    })

  socket.on('createLocationMessage', (coords, callback) => {
    let user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () =>{
    let user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room)); // update user list
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
});
});



server.listen(port, () => {
  console.log(`node-chat-app serving up port ${port}`);
});
