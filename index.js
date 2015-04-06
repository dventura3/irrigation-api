var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
//var sensor_module = require('./modules/Sensors_classes');

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
  /*
  //configuration
  try {
    fs.readFile('fakeResources.json', function(err, data){
      if (err) throw err;
      
      config = JSON.parse(data);
      for(var i = 0; i < config.sensors.length; i++){
        var tmp = new sensor_module.Sensor(config.sensors[i]);
        sensors.push(tmp);
      }

      console.log("Server configured");
      console.log("Server listening to %s:%d", host, port);
    });
  } catch (e) {
    console.log("Error in reading file for configuration");
  }
  */
});


/*--------------- HTTP Calls -------------------*/

/**** ENTRYPOINT ***/

var getEntryPoint = function(req, res){
  try {
    fs.readFile('examples/get_entryPoint.json', function(err, data){
      if (err) throw err;
      res.send(data);
    });
  } catch (e) {
    console.log("Error in reading file");
    res.send({success:false});
  }
}

/**** PLANTS ***/

var getPlants = function(req, res){
  try {
    fs.readFile('examples/get_plants_list.json', function(err, data){
      if (err) throw err;
      res.send(data);
    });
  } catch (e) {
    console.log("Error in reading file");
    res.send({success:false});
  }
}

var getPlantInfo = function(req, res){
  try {
    fs.readFile('examples/get_plant_info.json', function(err, data){
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
    fs.readFile('examples/get_sensors.json', function(err, data){
      if (err) throw err;
      res.send(data);
    });
  } catch (e) {
    console.log("Error in reading file");
    res.send({success:false});
  }
}

var getSensorsForType = function(req, res){
  try {
    //Currently - We suppose the "sensorType" = "temperature"
    fs.readFile('examples/get_sensors_temperature.json', function(err, data){
      if (err) throw err;
      res.send(data);
    });
  } catch (e) {
    console.log("Error in reading file");
    res.send({success:false});
  }
}

var getSensorValue = function(req, res){
  var sensorID = req.params.sensorID;
  try {
    //Currently - We suppose the "sensorType" = "temperature" & "sensorID" = "001"
    fs.readFile('examples/get_temperature_value.json', function(err, data){
      if (err) throw err;
      res.send(data);
    });
  } catch (e) {
    console.log("Error in reading file");
    res.send({success:false});
  }
}

/**** ACTUATORS ***/

var getActuators = function(req, res){
  console.log("getActuators");
  res.send({success:true});
}

var getActuatorsForType = function(req, res){
  console.log("getActuatorsForType");
  res.send({success:true});
}

var getActuatorState = function(req, res){
  console.log("getActuatorState");
  res.send({success:true});
}

var changeActuatorState = function(req, res){
  console.log("changeActuatorState");
  res.send({success:true});
}

//change current state for the specific actuatorID
var changeActuatorState = function(req, res){
  var actuatorID = req.params.actuatorID;
  var newState = req.params.value;
  console.log("New STATE! ActuatorID: " + actuatorID + " -  Value: " + newState);
  res.send({success:true});
}

/**** GEOLOCATION ***/

var getGeocoordinates = function(req, res){
  es.send({success:true});
}



app.get("/", getEntryPoint);

app.get("/plants", getPlants);
app.get("/plants/:plantID", getPlantInfo);

app.get("/sensors", getSensors);
app.get("/sensors/:sensorsType", getSensorsForType);
app.get("/sensors/:sensorsType/:sensorID", getSensorValue);

app.get("/actuators", getActuators);
app.get("/actuators/:actuatorsType", getActuatorsForType);
app.get("/actuators/:actuatorsType/:actuatorID", getActuatorState);
app.put("/actuators/:actuatorsType/:actuatorID/:value", changeActuatorState);

app.get("/geo", getGeocoordinates);