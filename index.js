const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
// const hbs = require('hbs');
const port = process.env.PORT || 8000;

app.use('/socket-io',
    express.static('node_modules/socket.io-client/dist'));

app.use('/axios',
    express.static('node_modules/socket.io-client/dist'));

app.use('/static', express.static('public'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
});

app.get('/onlineUsers', function(req, res) {
    res.send(io.sockets.adapter.rooms);
});

io.on('connection', function(socket) {
    console.log('connected');

    io.emit('user joined', socket.id)

    socket.on('chat.message', (message) => {
        io.emit('chat.message', message);
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
        socket.broadcast.emit('user left', socket.id)
    });

});

server.listen(port, function() {
    console.log(`Creating magic on port ${port}`)
});