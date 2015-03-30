var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var sensor_module = require('./modules/Sensor');

var sensors = [];
var actuators = [];

/*--------------- Express configuration goes here: -------------------*/
var app = express();
var port = process.env.PORT || 3300;
var host = process.env.HOST || "127.0.0.1";

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
app.listen(port, host, function() {
  //configuration
  try {
    fs.readFile('fakeResources.json', function(err, data){
      if (err) throw err;
      
      config = JSON.parse(data);
      for(var i = 0; i < config.sensors.length; i++){
        var tmp = new sensor_module.Sensor();
        tmp.initialize(config.sensors[i]);
        sensors.push(tmp);
      }

      console.log("Server configured");
      console.log("Server listening to %s:%d", host, port);
    });
  } catch (e) {
    console.log("Error in reading file for configuration");
  }
});


/*--------------- HTTP Calls -------------------*/


var getSensors = function(req, res){
  //TODO: Return a collection wit ID, Type, link per andare avanti a richiedere il dato
  res.send({success:true, sensors:sensors});
}


var getSensorValue = function(req, res){
  var sensorID = req.params.sensorID;
  for (var i=0; i < sensors.length; i++) {
    if(sensors[i].ID == sensorID){
      res.send({success:true, sensorID:sensors[i].ID, value:sensors[i].read()});
      return;
    }
  }
  res.send({success:false});
}


var getActuators = function(req, res){
  console.log("Actuators");
  res.send({success:true});
}


var getActuatorState = function(req, res){
  var actuatorID = req.params.actuatorID;
  console.log("Actuator ID: " + actuatorID);
  var currentState = 1;

  res.send({actuatorID : actuatorID, state : currentState});
}


//change current state for the specific actuatorID
var changeActuatorState = function(req, res){
  var actuatorID = req.params.actuatorID;
  var newState = req.params.value;
  console.log("New STATE! ActuatorID: " + actuatorID + " -  Value: " + newState);
  res.send({success:true});
}


app.get("/sensors", getSensors);
app.get("/sensors/:sensorID", getSensorValue);

app.get("/actuators", getActuators);
app.get("/actuators/:actuatorID", getActuatorState);
app.put("/actuators/:actuatorID/:value", changeActuatorState);