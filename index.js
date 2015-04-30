var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var sensor_module = require('./lib/Sensors_classes');
var actuator_module = require('./lib/Actuators_classes');
var plant_module = require('./lib/Plant_class');
var handler_module = require('./lib/Handler');

var sensors = [];
var actuators = [];
var plants = [];
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

    next(); //pass the controll to the next handler
  }
);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.listen(port, host, function() {
  //configuration
  try {
    fs.readFile('lib/fakeResources.json', function(err, data){
      if (err) throw err;

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
        if(config.actuators[i].type == "IrrigationPump")
          var tmp = new actuator_module.Pump(config.actuators[i].actuatorID, config.actuators[i].actuatorName, config.actuators[i].actuatorDescription, config.actuators[i].state);
        actuators.push(tmp);
      }

      for(var i = 0; i < config.plants.length; i++){
        var tmpAssociatedSensors = [];
        //find the sensors type and ID
        for(var x = 0; x < config.plants[i].associatedSensors.length; x++){
          for (var h = 0; h < config.sensors.length; h++) {
            if(config.sensors[h].sensorID == config.plants[i].associatedSensors[x]){
              tmpAssociatedSensors.push({
                "@id" : ("/sensors/" + config.sensors[h].sensorID),
                "@type" : config.sensors[h].type
              });
              break;
            }
          }
        }
        var tmpAssociatedActuators = [];
        //find the actuators type and ID
        for(var x = 0; x < config.plants[i].associatedActuators.length; x++){
          for(var h = 0; h <config.actuators.length; h++){
            if(config.actuators[h].actuatorID == config.plants[i].associatedActuators[x]){
              tmpAssociatedActuators.push({
                "@id" : ("/actuators/" + config.actuators[h].actuatorID),
                "@type" : config.actuators[h].type
              });
              break;
            }
          }
        }
        var tmp = new plant_module.Plant(config.plants[i], tmpAssociatedSensors, tmpAssociatedActuators);
        plants.push(tmp);
      }

      handler = new handler_module.Handler("http://" + host + ":" + port);

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
  handler.EntryPoint.getEntryPoint(function(jsonld_data){
    res.send(jsonld_data);
  });
}

/**** SENSORS ***/

var getSensors = function(req, res){
  handler.Sensor.getSensors(sensors, function(jsonld_data){
    res.send(jsonld_data);
  });
}

var addNewSensor = function(req, res){
  //TODO = COME FACCIO A SAPERE SE L'OGGETTO CHE RICEVO è CONFORME ALLE MIE "ASPETTATIVE"?
  //Non si potrebbe avere una regola che valida il formato?????
  handler.StatusCode.notImplemented(function(jsonld_data){
    res.send(jsonld_data);
  });
}

var getSensorValue = function(req, res){
  var sensorID_required = req.params.sensorID;
  for (var i = 0; i < sensors.length; i++) {
    if(sensors[i].ID == sensorID_required){
      console.log("Get Sensor value for sensorID: " + sensorID_required);
      handler.Sensor.getSensorValue(sensors[i], function(jsonld_data){
        res.send(jsonld_data);
      });
      return 0;
    }
  }
  //If I haven't found the plant with that ID, I  have to return a status code 404
  handler.StatusCode.notFound(function(jsonld_data){
    res.send(jsonld_data);
  });
}

var updateSensorInfo = function(req, res){
  handler.StatusCode.notImplemented(function(jsonld_data){
    res.send(jsonld_data);
  });
}

var deleteSensor = function(req, res){
  handler.StatusCode.notImplemented(function(jsonld_data){
    res.send(jsonld_data);
  });
}

/**** ACTUATORS ***/

var getActuators = function(req, res){
  handler.Actuator.getActuators(actuators, function(jsonld_data){
    res.send(jsonld_data);
  });
}

var addNewActuator = function(req, res){
  handler.StatusCode.notImplemented(function(jsonld_data){
    res.send(jsonld_data);
  });
}

var getActuatorState = function(req, res){
  var actuatorID_required = req.params.actuatorID;
  for (var i = 0; i < actuators.length; i++) {
    if(actuators[i].ID == actuatorID_required){
      handler.Actuator.getActuatorState(actuators[i], function(jsonld_data){
        res.send(jsonld_data);
      });
      return 0;
    }
  }
  //If I haven't found the plant with that ID, I  have to return a status code 404
  handler.StatusCode.notFound(function(jsonld_data){
    res.send(jsonld_data);
  });
}

var updateActuatorInfo = function(req, res){
  handler.StatusCode.notImplemented(function(jsonld_data){
    res.send(jsonld_data);
  });
}

var deleteActuator = function(req, res){
  handler.StatusCode.notImplemented(function(jsonld_data){
    res.send(jsonld_data);
  });
}

//change current state for the specific actuatorID
var setNewActuatorState = function(req, res){
  var actuatorID_required = req.params.actuatorID;
  var newState = req.params.value;
  for (var i = 0; i < actuators.length; i++) {
    if(actuators[i].ID == actuatorID_required){
      console.log("Set New state for actuatorID: " + actuatorID_required + " - newState: " + newState);
      handler.Actuator.setNewActuatorState(actuators[i], newState, function(jsonld_data){
        res.send(jsonld_data);
      });
      return 0;
    }
  }
  //If I haven't found the plant with that ID, I  have to return a status code 404
  handler.StatusCode.notFound(function(jsonld_data){
    res.send(jsonld_data);
  });
}

/**** GEOLOCATION ***/

var getGeocoordinates = function(req, res){
  handler.Location.getCoordinates(function(jsonld_data){
    res.send(jsonld_data);
  });
}

/**** PLANTS ***/

var getPlants = function(req, res){
  handler.Plant.getPlants(plants, function(jsonld_data){
    res.send(jsonld_data);
  });
}

var addNewPlant = function(req, res){
  handler.StatusCode.notImplemented(function(jsonld_data){
    res.send(jsonld_data);
  });
}

var getPlantInfo = function(req, res){
  var plantID_required = req.params.plantID;
  for (var i = 0; i < plants.length; i++) {
    if(plants[i].ID == plantID_required){
      console.log("Get Plant Information for plantID: " + plantID_required);
      handler.Plant.getPlantInfo(plants[i], function(jsonld_data){
        res.send(jsonld_data);
      });
      return 0;
    }
  }
  //If I haven't found the plant with that ID, I  have to return a status code 404
  handler.StatusCode.notFound(function(jsonld_data){
    res.send(jsonld_data);
  });
}

var updatePlantInfo = function(req, res){
  handler.StatusCode.notImplemented(function(jsonld_data){
    res.send(jsonld_data);
  });
}

var deletePlant = function(req, res){
  handler.StatusCode.notImplemented(function(jsonld_data){
    res.send(jsonld_data);
  });
}

/**** OPTIONS ***/

var getDescriptions = function(req, res){
  var uriPattern = new RegExp(req.params[0].replace(/\//g, '-').replace(/\d+/g, 'id') + '.*');
  
  fs.readdir(__dirname + "/public/RESTdesc_descriptions/board" , function (err, fileNames) { 
    if(err) throw err;
    fileNames = fileNames.filter(function (file) { return file.match(uriPattern); })
                         .sort(function (a,b) { return b.length - a.length; });

    if(!fileNames.length){
      handler.StatusCode.notFound(function(jsonld_data){
        res.send(jsonld_data);
      });
      return -1;
    }

    readFiles(__dirname + "/public/RESTdesc_descriptions/board", fileNames, function (files) {
      console.log("Send RESTdesc descriptions");
      res.header('Content-Type', 'text/n3');
      res.send(joinN3Documents(files));
    });

  });
}

/*--------------- Helpers Functions -------------------*/

function readFiles(directory, fileNames, callback) {
  var files = [];
  fileNames.forEach(function (fileName) {
    fs.readFile(directory + '/' + fileName, 'utf-8', function (err, data) {
      files.push(data);
      if(files.length == fileNames.length)
        callback(files);
    });
  });
}

function joinN3Documents(documents) {
  var namespaces = '', usedNamespaces = {}, triples = '',
      match, prefixMatcher = /^@prefix.*\.$\n/gm;
  documents.forEach(function (document) {
    while((match = prefixMatcher.exec(document)) && (match = match[0]))
      if(!usedNamespaces[match])
        namespaces += (usedNamespaces[match] = match);
    triples += document.replace(prefixMatcher, '');
  });
  return namespaces + triples;
}


/*--------------- Routes -------------------*/


app.options(/^\/([\d\w\/]*)$/, getDescriptions);

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
