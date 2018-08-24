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

io.on('connection', (socket) => { //socket refers to the individual
  console.log('New user connected.'); //register for connected client to server

socket.on('disconnect', () =>{
  console.log('client disconnected');
});
});
app.use(express.static(publicPath)); //configure our express static middleware

server.listen(port, () => {
  console.log(`node-chat-app serving up port ${port}`);
});
