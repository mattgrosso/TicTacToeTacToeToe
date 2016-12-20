(function() {
  'use strict';

  var app = require('express')();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  app.get('/build', function(req, res){
    res.sendFile(__dirname + '/build/index.html');
  });

  io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('user clicked', function userClicked(msg) {
      console.log(msg);
      io.emit('user clicked', msg);
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });


  });

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });

})();
