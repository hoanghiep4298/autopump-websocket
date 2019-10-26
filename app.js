let util  = require('util');
let fs = require('fs');
let options = {
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt'),
  ca: fs.readFileSync('ssl/ca_bundle.crt')
}
// let app = require('http').createServer(handler);
// let io = require('socket.io')(app);
const express = require("express");
let app = express();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));

let server = require("https").createServer(options, app);
let io = require("socket.io")(server);
server.listen(3000);

 console.log("Server nodejs chay tai dia chi: localhost"  + ":" + 3000)

app.get('/', (req,res)=> {
  console.log('hello');
  res.render('index')
});

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