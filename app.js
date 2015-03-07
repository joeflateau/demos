var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var todos = [];

io.on('connection', function(socket){
	console.log("User connected");
	
	socket.emit('todos', todos);

	socket.on('push', function(item) {
		console.log('push: ' + item.text);
		todos.push(item);
		todos = todos.slice(-100);
		socket.broadcast.emit('push', item);
	});
	
	socket.on('remove', function(item) {
		console.log('remove: ' + item.text);
		todos = todos.filter(function(item2) { return item2.id !== item.id; });
		socket.broadcast.emit('remove', item);
	});
});

http.listen(3000, function(){
 console.log("we're alive!");
});
