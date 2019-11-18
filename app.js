let util  = require('util');
let fs = require('fs');
const firebase = require('firebase-admin');

const express = require("express");
let app = express();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));

let server = require("http").createServer(app);
let io = require("socket.io")(server);
server.listen(80);
console.log("Server nodejs running...")

let serviceAccount = require("./ServiceAccountKey.json")
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://auto-pump.firebaseio.com"
}) 
let db = firebase.database();
let uptimeid = fs.readFileSync("uptimeid.txt");
let downtimeid = fs.readFileSync("downtimeid.txt");

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
    io.sockets.emit('switchPumpState', { state: state })
  })

  socket.on('setTime', function(pumpingTime){
    io.sockets.emit('setTime', { pumpingTime: pumpingTime });
  })
  //=======================FROM Arduino ============================
    
    socket.on('updateStatus', function(JSONdata){
      // console.log(JSONdata.stateOfPump, JSONdata.autoModeState);
      io.sockets.emit('updateToBrowser', JSONdata);

      //update firebase db
      if(JSONdata.stateOfPump == "on" && pumpState == "off"){
        let refup = db.ref("uptime/"+uptimeid);
        refup.set({
          time : new Date().toLocaleString("th-TH")
        })
        uptimeid = (1+parseInt(uptimeid)).toString();
        fs.writeFileSync("uptimeid.txt", uptimeid);
    
      } else if(JSONdata.stateOfPump == "off" && pumpState == "on"){
        let refdown = db.ref("downtime/"+downtimeid);
        refdown.set({
          time : new Date().toLocaleString("th-TH")
        })
        downtimeid = (1+parseInt(downtimeid)).toString();
        fs.writeFileSync("downtimeid.txt", downtimeid);
      }
      //set new state
      pumpState = JSONdata.stateOfPump;
    })
});
