var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
    usernames = [];
    
    // rooms which are currently available in chat
var rooms = ['room1','room2','room3'];

server.listen(process.env.PORT || 8000);
console.log('Server Running...');

/* //To add single html file only without public folder
app.get('/', (req, res) => {
    //res.send("Home page");
    res.sendFile(__dirname + '/index.html'); //html file added
}); */

app.use(express.static("public-client")); // where you can have client related files i.e

io.sockets.on('connection', function(socket){
	console.log('Socket Connected...');

	socket.on('new user', function(data, callback, username){ 
    
    //Broadcast msg from Admin to everone except him
    socket.broadcast.emit('updatechat', 'Admin', 'A new User has connected');

		if(usernames.indexOf(data) != -1){
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			updateUsernames();
        }

        // we store the username in the socket session for this client
        // socket.username = username;
        // store the room name in the socket session for this client
        socket.room = 'room1';
        // add the client's username to the global list
        usernames[username] = username;
          // send client to room 1
        socket.join('room1');
        
        // Admin welcome message to everyone at the start with which room to be connected
        socket.emit('updatechat', 'Admin', 'Welcome to chat application! You have connected to room1');
		// echo to room 1 that a person has connected to their room
		//socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');
    });
    
    socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});

	// Update Usernames
	function updateUsernames(){
		io.sockets.emit('usernames', usernames);
	}

	// Send Message
	socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, user:socket.username});
        
        // we tell the client to execute 'updatechat' with 2 parameters
		//io.sockets.in(socket.room).emit('new message', socket.username, data);
	});

	// Disconnect
	socket.on('disconnect', function(data){
		if(!socket.username){
			return;
		}
		usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
        //socket.broadcast.emit('updatechat', 'Admin', 'Disconnected');
	});
});