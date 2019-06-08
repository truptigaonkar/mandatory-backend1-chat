// Fs module
let fs = require('fs');
let data = fs.readFileSync('rooms.json');
let rooms = JSON.parse(data);
console.log(rooms);

let express = require('express');
let app = express();
app.use(express.json());
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8000);
console.log('Server is running at http://localhost:8000/');

app.use(express.static("public-client")); //client related files i.e html, js, css

//Usernames
usernames = [];

/* ---------------------------Rooms api ---------------------------*/
//Rooms
// const rooms = [
//     { id: 1, name: 'room1'}
// ]

//Get all rooms
app.get('/api/rooms', function(req, res){
    res.send(rooms);
});

// GET specific room according to id
app.get('/api/rooms/:id', (req, res) => {
    // Look up the room if no exist, return 404
    const room = rooms.find(c => c.id === parseInt(req.params.id));
    if(!room) 
        return res.status(404).send('The room with specific id is not found');
    // Return the same room
    res.send(room);
});

// POST room (Do not forgot using 'app.use(express.json());' up)
app.post('/api/rooms', (req, res) => {
    // Validate, if invalid return 400 - Bad request
    if(!req.body.name)
        return res.status(400).send('Name is required')
    // room to be added
    const room = {
        id: rooms.length + 1,
        name: req.body.name
    };
    // Add the room with push
    rooms.push(room);
    // Return the added room
    res.send(room)
    
    // Fs module
    let data = JSON.stringify(rooms);
    fs.writeFile('rooms.json', data, finished);
    function finished(err){
        console.log('all set')
    }
    
});

// DELETE room
app.delete('/api/rooms/:id', (req, res) => {
    // Look up the room if no exist, return 404
    const room = rooms.find(c => c.id === parseInt(req.params.id));
    if(!room)
        return res.status(404).send('The room with specific id is not found');
    // Delete
    const index = rooms.indexOf(room);
    rooms.splice(index, 1);
    // Return the deleted room
    res.send(room);
    
    // Fs module
    let data = JSON.stringify(rooms);
    fs.writeFile('rooms.json', data, finished);
    function finished(err){
        console.log('all set')
    }

});

/* ------------------------End Rooms api ---------------------------*/

io.sockets.on('connection', function (socket) {
    console.log('Socket Connected at: ' + socket.id);

    socket.on('new user', function (data, callback, username) {

        //Broadcast msg from Admin to everone except him
        socket.broadcast.emit('updatechat', 'Admin', 'A new User has CONNECTED!');

        if (usernames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }

        //socket.username = username;

        socket.room = rooms[0].name; //Connect to default First room
        console.log('socket room: ', socket.room);
        socket.join(socket.room);

        // Admin welcome message to everyone at the start
        socket.emit('updatechat', 'Admin', socket.username + ' has connected to ' +socket.room);
      
		socket.emit('updaterooms', rooms, socket.room);
    
    });

    socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'Admin', socket.username + ' has connected to ' +newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'Admin', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'Admin', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});

    // Update Usernames
    function updateUsernames() {
        io.sockets.emit('usernames', usernames);
    }

    // Send Message
    socket.on('send message', function (data) {
        io.sockets.in(socket.room).emit('new message', { msg: data, user: socket.username });
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

