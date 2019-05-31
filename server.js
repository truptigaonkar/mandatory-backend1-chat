var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	usernames = [];

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

	socket.on('new user', function(data, callback){
    
    // Admin message to everyone at the start
    socket.emit('updatechat', 'Admin', 'Welcome to chat application');
        
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
	});

	// Update Usernames
	function updateUsernames(){
		io.sockets.emit('usernames', usernames);
	}

	// Send Message
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user:socket.username});
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