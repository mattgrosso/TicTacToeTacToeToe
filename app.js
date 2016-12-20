var express = require('express')
var app = express()

app.use(function (req, res, next) {
  console.log("New request to ", req.path);
  next();
})

app.use(express.static('build'));

app.listen(3000, function () {
  console.log('Example app running on port 3000!');
})
