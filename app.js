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

// SERVER SIDE: Message form submit function
io.sockets.on('connection', function(socket){
    console.log('Establish socket connection....');

    socket.on('send message', function(data){
        io.sockets.emit('new message', data); //Sending message to all including me
        //socket.broadcast.emit('new message', data); // Broadcast message to all except me
    });
});