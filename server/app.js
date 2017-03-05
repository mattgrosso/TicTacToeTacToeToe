const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./routes/events')(io);

app.use(function (req, res, next) {
  console.log("New request to ", req.path);
  next();
});

app.use(express.static('build'));
app.use('/game', require('./routes/game'));

const port = process.env.PORT || 3000;
const binding = 'localhost';
http.listen(port, function () {
  console.log(`MetaTacToe has been started on port http://${binding}:${port}`);
});
