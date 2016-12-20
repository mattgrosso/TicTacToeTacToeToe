var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(function (req, res, next) {
  console.log("New request to ", req.path);
  next();
})

app.use(express.static('build'));

io.on('connection', function (socket) {
  console.log('connection established');
  socket.on('disconnect', function () {
    console.log('connection lost');
  })

  socket.on('user made move', function (data) {
    io.emit('user made move', data)
  })
})


http.listen(3000, function () {
  console.log('Example app running on port 3000!');
})
