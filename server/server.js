//needs to serve up the public directory
const path = require('path');
const express = require('express');
const app = express(); //app will create routes, run middleware and listen
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath)); //configure our express static middleware

app.listen(port, () => {
  console.log(`node-chat-app serving up port ${port}`);
});
