let util  = require('util');
let fs = require('fs');

const express = require("express");
let app = express();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));

let server = require("http").createServer(app);
let io = require("socket.io")(server);
server.listen(80);
console.log("Server nodejs running...")

app.get('/', (req,res)=> {
  res.render('index')
});


// ===========================STATE VARIABLE===================================
let arduinoConnected = false;
let autoModeState = "on";
let pumpState = "off"

//============================HANDLE CONNECTION================================
io.on('connection', function (socket) { 
  console.log("someone connecting...");
  socket.emit('init', { message: 'Connect to server successfully' });
  socket.on('connection', function (data) {
    console.log(data.message);   
  });

  //=======================FROM web browser===========================
  socket.on('switchAutoModeState', function(state){
    autoModeState = state;
    io.sockets.emit('switchAutoModeState', { state: state } );
  })

  socket.on('switchPumpState', function(state){
    pumpState = state;
    io.sockets.emit('switchPumpState', { state: state })
  })
  //=======================FROM Arduino ============================
    
    socket.on('updateStatus', function(JSONdata){
      //console.log(JSONdata.statusOfPump, JSONdata.autoModeState);
      //io.sockets.emit('updateToBrowser', JSONdata);
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



//==============================


function ParseJson(jsondata) {
  try {
      return JSON.parse(jsondata);
  } catch (error) {
      return null;
  }
}

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