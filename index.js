var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var sensor_module = require('./modules/Sensors_classes');
var actuator_module = require('./modules/Actuators_classes');
var handler_module = require('./modules/CallsHandler');

var handler;

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
    fs.readFile('modules/fakeResources.json', function(err, data){
      if (err) throw err;

      var sensors = [];
      var actuators = [];
      
      config = JSON.parse(data);
      for(var i = 0; i < config.sensors.length; i++){
        if(config.sensors[i].type == "TemperatureSensor")
          var tmp = new sensor_module.TemperatureSensor(config.sensors[i].sensorID, config.sensors[i].sensorName, config.sensors[i].sensorDescription, config.sensors[i].sensorUnit);
        if(config.sensors[i].type == "MoistureSensor")
          var tmp = new sensor_module.MoistureSensor(config.sensors[i].sensorID, config.sensors[i].sensorName, config.sensors[i].sensorDescription);
        if(config.sensors[i].type == "LightSensor")
          var tmp = new sensor_module.LightSensor(config.sensors[i].sensorID, config.sensors[i].sensorName, config.sensors[i].sensorDescription);        
        sensors.push(tmp);
      }

      for(var i = 0; i < config.actuators.length; i++){
        if(config.actuators[i].type == "Pump")
          var tmp = new actuator_module.Pump(config.actuators[i].actuatorID, config.actuators[i].actuatorName, config.actuators[i].actuatorDescription, config.actuators[i].state);
        actuators.push(tmp);
      }

      handler = new handler_module.Handler(sensors, actuators, null, "http://localhost:3300/");

      console.log("Server configured");
      console.log("Server listening to %s:%d", host, port);
    });
  } catch (e) {
    console.log("Error in reading file for configuration");
  }
});


/*--------------- HTTP Calls -------------------*/


/**** ENTRYPOINT ***/

var getEntryPoint = function(req, res){
  try {
    fs.readFile('examples/get_entryPoint.jsonld', function(err, data){
      if (err) throw err;
      res.send(data);
    });
  } catch (e) {
    console.log("Error in reading file");
    res.send({success:false});
  }
}

/**** SENSORS ***/

var getSensors = function(req, res){
  try {
    fs.readFile('examples/get_sensors.jsonld', function(err, data){
      if (err) throw err;
      res.send(data);
    });
  } catch (e) {
    console.log("Error in reading file");
    res.send({success:false});
  }
}

var addNewSensor = function(req, res){
  res.send({success:false});
}

var getSensorValue = function(req, res){
  var sensorID = req.params.sensorID;
  try {
    fs.readFile('examples/get_temperature_value.jsonld', function(err, data){
      if (err) throw err;
      res.send(data);
    });
  } catch (e) {
    console.log("Error in reading file");
    res.send({success:false});
  }
}

var updateSensorInfo = function(req, res){
  res.send({success:false});
}

var deleteSensor = function(req, res){
  res.send({success:false});
}

/**** ACTUATORS ***/

var getActuators = function(req, res){
  console.log("getActuators");
  res.send({success:true});
}

var addNewActuator = function(req, res){
  res.send({success:false});
}

var getActuatorState = function(req, res){
  console.log("getActuatorState");
  res.send({success:true});
}

var updateActuatorInfo = function(req, res){
  console.log("updateActuatorInfo");
  res.send({success:true});
}

var deleteActuator = function(req, res){
  res.send({success:false});
}

//change current state for the specific actuatorID
var setNewActuatorState = function(req, res){
  var actuatorID = req.params.actuatorID;
  var newState = req.params.value;
  console.log("New STATE! ActuatorID: " + actuatorID + " -  Value: " + newState);
  res.send({success:true});
}

/**** GEOLOCATION ***/

var getGeocoordinates = function(req, res){
  res.send({success:true});
}

/**** PLANTS ***/

var getPlants = function(req, res){
  try {
    fs.readFile('examples/get_plants_list.jsonld', function(err, data){
      if (err) throw err;
      res.send(data);
    });
  } catch (e) {
    console.log("Error in reading file");
    res.send({success:false});
  }
}

var addNewPlant = function(req, res){
  res.send({success:true});
}

var getPlantInfo = function(req, res){
  try {
    fs.readFile('examples/get_plant_info.jsonld', function(err, data){
      if (err) throw err;
      res.send(data);
    });
  } catch (e) {
    console.log("Error in reading file");
    res.send({success:false});
  }
}

var updatePlantInfo = function(req, res){
  res.send({success:true});
}

var deletePlant = function(req, res){
  res.send({success:true});
}


app.get("/", getEntryPoint);

app.get("/sensors", getSensors);
app.post("/sensors", addNewSensor);
app.get("/sensors/:sensorID", getSensorValue);
app.put("/sensors/:sensorID", updateSensorInfo);
app.delete("/sensors/:sensorID", deleteSensor);

app.get("/actuators", getActuators);
app.post("/actuators", addNewActuator);
app.get("/actuators/:actuatorID", getActuatorState);
app.put("/actuators/:actuatorID", updateActuatorInfo);
app.delete("/actuators/:actuatorID", deleteActuator);
app.put("/actuators/:actuatorID/:value", setNewActuatorState);

app.get("/plants", getPlants);
app.post("/plants", addNewPlant);
app.get("/plants/:plantID", getPlantInfo);
app.put("/plants/:plantID", updatePlantInfo);
app.delete("/plants/:plantID", deletePlant);

app.get("/geo", getGeocoordinates);

