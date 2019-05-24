const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(8000);
console.log('Server running');

app.get('/', (req, res) => {
    //res.send("Home page");
    res.sendFile(__dirname + '/index.html'); //html file added
});

