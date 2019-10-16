var util  = require('util');
var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');
let ip = require('ip');
app.listen(80);
console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + 80)

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
function ParseJson(jsondata) {
    try {
        return JSON.parse(jsondata);
    } catch (error) {
        return null;
    }
}
function sendTime() {
    io.sockets.emit('atime', { time: new Date().toJSON() });
}
io.on('connection', function (socket) {
	console.log("Connected");
    socket.emit('welcome', { message: 'Connected !!!!' });
    socket.on('connection', function (data) {
        console.log(data);   
    });

    socket.on('updatelevel', function(level){
        console.log("current level: ", level);
        //neu level chia het cho 5 thì emit ring!!!
        // if(parseInt(level) === 10){
        //     socket.emit("ring", { status : 1 })
        // }
    })
  
    socket.on('atime', function (data) {
	  sendTime();
    console.log(data);
    });

    socket.on('JSON', function (data) {

	    var jsonStr = JSON.stringify(data);
        var parsed = ParseJson(jsonStr);
        
    });
    
  socket.on('arduino', function (data) {
	  io.sockets.emit('arduino', { message: 'R0' });
    
  });
});