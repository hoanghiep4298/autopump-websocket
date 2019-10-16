let util  = require('util');
let app = require('http').createServer(handler);
let io = require('socket.io')(app);
let fs = require('fs');
let ip = require('ip');
app.listen(3000);
console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + 3000)

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
  
    socket.on('tester', function (data) {
	  
      console.log(data.message);
    });

    socket.on('JSON', function (data) {

	    let jsonStr = JSON.stringify(data);
        let parsed = ParseJson(jsonStr);
        
    });
    
  socket.on('arduino', function (data) {
	  io.sockets.emit('arduino', { message: 'R0' });
    
  });
});