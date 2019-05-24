const express = require('express');
const app = express();
const port = 8000;
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.get('/', (req, res) => {
    //res.send("Home page");
    res.sendfile(__dirname + '/public/index.html'); //html file added
});

app.use(express.static('public')); // include to access public folder with index.html and style.css

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
