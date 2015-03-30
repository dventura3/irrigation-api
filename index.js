var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var sensors = [];
var actuators = [];

/*--------------- Express configuration goes here: -------------------*/
var app = express();
var SERVER_PORT = 3300;
app.use(
  function crossOrigin(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers','Content-Type, Authorization, Content-Length, X-Requested-With');

    if('OPTIONS' == req.method){
        res.send(200);
    }
    else
        next();
  }
);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.listen(SERVER_PORT);


/*--------------- HTTP Calls -------------------*/

//all the sensors
var getSensorsValues = function(req, res){
  console.log("Sensors");
  res.send({success:true});
}

//just one sensor
var getSensorValues = function(req, res){
  var sensorID = req.params.sensorID;
  console.log("Sensor ID: " + sensorID);
  var newValue = Math.random();

  res.send({sensorID : sensorID, value : newValue});
}

//all the actuators
var getActuatorsValues = function(req, res){
  console.log("Actuators");
  res.send({success:true});
}

//just one actuator
var getActuatorValues = function(req, res){
  var actuatorID = req.params.actuatorID;
  console.log("Actuator ID: " + actuatorID);
  var newValue = Math.random();

  res.send({actuatorID : actuatorID, value : newValue});
}

app.get("/sensors", getSensorsValues);
app.get("/sensors/:sensorID", getSensorValues);

app.get("/actuators", getActuatorsValues);
app.get("/actuators/:actuatorID", getActuatorValues);