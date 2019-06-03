let express = require('express');
let	app = express();
let	server = require('http').createServer(app);
let	io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8000);
console.log('Server is running on port 8000...');

app.use(express.static("public-client")); //client related files i.e html, js, css

//Usernames
usernames = [];

io.sockets.on('connection', function (socket) {
	console.log('Socket Connected...');

	socket.on('new user', function (data, callback, username) {
		if (usernames.indexOf(data) != -1) {
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			updateUsernames();
		}

		// Admin welcome message to everyone at the start with which room to be connected
		socket.emit('updatechat', 'Admin', 'Welcome to chat application!');
		//Broadcast msg from Admin to everone except him
		socket.broadcast.emit('updatechat', 'Admin', 'A new User has CONNECTED!');
	});

	socket.on('switchRoom', function (newroom) {
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
	});

	// Update Usernames
	function updateUsernames() {
		io.sockets.emit('usernames', usernames);
	}

	// Send Message
	socket.on('send message', function (data) {
		io.sockets.emit('new message', { msg: data, user: socket.username });
	});

	// DisconnectA new User has connected
	socket.on('disconnect', function (data) {
		if (!socket.username) {
			return;
		}
		usernames.splice(usernames.indexOf(socket.username), 1);
		updateUsernames();
		socket.broadcast.emit('updatechat', 'Admin', 'An User has DISCONNECTED!');
	});
});