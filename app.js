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
// ==============================================================
let arduinoConnected = false;
//===============================================================
io.on('connection', function (socket) { 
  console.log("someone connected");
  socket.emit('init', { message: 'Connect to server successfully' });
  //=======================web browser===========================


  //======================= Arduino ============================
    socket.on('connection', function (data) {
        console.log(data.message);   
    });

    socket.on('updateStatus', function(JSONdata){
      console.log(JSONdata.statusOfPump, JSONdata.autoMode);
      io.sockets.emit('updateToBrowser', JSONdata);
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