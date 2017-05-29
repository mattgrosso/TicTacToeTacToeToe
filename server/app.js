require('dotenv').config()

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
require("./routes/events")(io);

// Log to STDOUT for any request.
app.use(function(req, res, next) {
  console.log("New request to ", req.path);

  next();
});

// Server static files from the build directory
app.use(express.static("build"));

// Handle any game route
app.use("/game", require("./routes/game"));

// Start Server
const port = process.env.PORT || 3000;
const binding = "localhost";
http.listen(port, function() {
  console.log(`MetaTacToe has been started on port http://${binding}:${port}`);
});
