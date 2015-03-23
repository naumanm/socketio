// chat room weekend project

// crud for login with postgres?
// save all messages to a redis hash
// get redis body parser etc to load
// get current app to save all chats to redis
// add user, throw a login page, write to 
// save user

// different than the first homework due to socket.io not needing
// express

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    redis = require("redis"),
    client = redis.createClient(),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser");


// allows us to use ejs instead of html
app.set("view engine", "ejs");
 
// for static files
app.use(express.static(__dirname + '/public'));

// root route
app.get('/', function(req, res){
  // res.send('<h1>Hello world</h1>');
  // res.sendFile(__dirname + '/index.html');
  res.render("index");
});

// create route
app.post("/users/create", function(req,res){
  console.log("create route");
  client.LPUSH("chatterlist", req.body.chattername);
  res.redirect("/");
});

// this pushes the user to redis
function addUser (user) {
  console.log(user);
  client.RPUSH("userlist", user);
}

// this pushes the message to redis
function addMessage (message) {
  console.log(message);
  client.RPUSH("conversationlist", message);
}

// this is the communication to socket.io

// this is where I need to console.log the user
io.on('connection', function(socket){

  socket.join("Mike's chat");

  console.log('a user connected');

  var nsp = io.of('/my-namespace');


  socket.on('private message', function (from, msg) {
    console.log('Private message by ', from, ' saying ', msg);
  });


socket.on('chat message', function(msg){
  io.emit('chat message', msg);
  addMessage(msg);
});

socket.on('user joined', function(msg){
  io.emit('user joined', msg);
  addMessage(msg);
});


  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

// load our server
http.listen(3000, function(){
  console.log('listening on *:3000');
});