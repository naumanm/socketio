// chat room weekend project

// get the css file to load
// save all messages to a redis hash
// get redis body parser etc to load
// get current app to save all chats to redis
// add user, throw a login page, write to 
// save user

// different than the first homework due to socket.io not needing
// express

var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    redis = require("redis"),
    client = redis.createClient(),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser");

// hardcode the user name globally for now
userName = "Tom";
 
// dont know why this does not work
// app.use(express.static(__dirname + '/public'));

// route
app.get('/', function(req, res){
  // res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});

// this pushes the message to redis
function addMessage (name, message) {
  var stringToPush = name + ": " + message;
  console.log("string to push: " + stringToPush);
  client.RPUSH("conversationlist", stringToPush);
}

// this is the communication to socket
io.on('connection', function(socket){
  console.log('a user connected');
    socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    addMessage(userName, msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// load our server
http.listen(3000, function(){
  console.log('listening on *:3000');
});