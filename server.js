const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(8000);
console.log('Server running');

app.use(express.static("public-client")); // where you can have client related files i.e

// //To add single html file only without public folder
// app.get('/', (req, res) => {
//     //res.send("Home page");
//     res.sendFile(__dirname + '/index.html'); //html file added
// });


//Message form submit function
io.on('connection', function(socket){
    console.log('Establish socket connection....');
    //console.log(socket.id);

    //message send
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, user:socket.username}); //Sending message to all including me
        //socket.broadcast.emit('new message', data); // Broadcast message to all except me
    });

      //Server disconnect
      socket.on('disconnect', function(){
        console.log('Disconnected.....');
    });
});

