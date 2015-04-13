(function(){

  var jsonld = require('../node_modules/jsonld');
  var sensor_module = require('./Sensors_classes');

  contexts = {
    entryPoint : "/contexts/entryPoint.jsonld",
    sensors : {
      get: "/contexts/get_sensors.jsonld",
      post : "/contexts/post_sensors.jsonld"
    },
    temperature_sensor : {
      get : "/contexts/get_sensor_temperature.jsonld",
      put : "/contexts/put_sensor_temperature.jsonld",
      delete : "/contexts/delete_sensor_temperature.jsonld"
    },
    moisture_sensor : {
      get : "/contexts/get_sensor_moisture.jsonld",
      put : "/contexts/put_sensor_moisture.jsonld",
      delete : "/contexts/delete_sensor_moisture.jsonld"
    },
    light_sensor : {
      get : "/contexts/get_sensor_light.jsonld",
      put : "/contexts/put_sensor_light.jsonld",
      delete : "/contexts/delete_sensor_light.jsonld"
    },
    actuators: "/contexts/actuators.jsonld",
    pump : { 
      get: "/contexts/get_pump.jsonld",
      put: "/contexts/put_pump.jsonld",
      delete : "/contexts/delete_pump.jsonld"
    },
    geo : "/contexts/geo.jsonld",
    plants : "/contexts/plants.jsonld",
    plant : "/contexts/plants_plantID"
  };

  function Handler(path){
    rootPath = path;
  };

  Handler.prototype.EntryPoint = {
    getEntryPoint : function(callback){
      var context_folder = rootPath + contexts.entryPoint;
      var response = {
        "@context" : context_folder,
        "@type": "EntryPoint",
        "@id": "/",
        "plants" : "/plants/",
        "sensors" : "/sensors/",
        "actuators" : "/actuators/",
        "geolocation" : "/geo/"
      };
      callback(response);
    }
  };

  Handler.prototype.Sensor = {
    getSensors : function(sensors, callback){
      var context_folder = rootPath + contexts.sensors.get;
      var response = {
        "@context" : context_folder,
        "@type": "Collection",
        "@id": "/sensors/",
        member : []
      };
      for(var i = 0; i < sensors.length; i++){
        if(sensors[i] instanceof sensor_module.TemperatureSensor){
          response.member.push({
            "@id" : ("/sensors/"+sensors[i].ID),
            "@type" : "TemperatureSensor"
          });
        }
        if(sensors[i] instanceof sensor_module.MoistureSensor){
          response.member.push({
            "@id" : ("/sensors/"+sensors[i].ID),
            "@type" : "MoistureSensor"
          });
        }
        if(sensors[i] instanceof sensor_module.LightSensor){
          response.member.push({
            "@id" : ("/sensors/"+sensors[i].ID),
            "@type" : "LightSensor"
          });
        }
      };
      callback(response);
    },
    getSensorValue : function(sensor, callback){
      var date = new Date(); 
      var response = {
        "@id" : ("/sensors/" + sensor.ID),
        "sensorID" : sensor.ID,
        "sensorName" : sensor.name,
        "sensorDescription" : sensor.description,
        "madeObservation" : {
          "@id" : "_:Obs",
          "@type" : "vocab:Observation",
          "timestamp" : date.toISOString(),
          "observationResult" : {
            "@id" : "_:result",
            "sensorData" : sensor.read()
          }
        }
      };
      
      if(sensor instanceof sensor_module.TemperatureSensor){
        response["@context"] = rootPath + contexts.temperature_sensor.get;
        response["@type"] = "TemperatureSensor";
        response.madeObservation.observationResult["@type"] = "Temperature";
        response.madeObservation.observationResult["sensorUnit"] = sensor.unit;
      }

      if(sensor instanceof sensor_module.MoistureSensor){
        response["@context"] = rootPath + contexts.moisture_sensor.get;
        response["@type"] = "MoistureSensor";
        response.madeObservation.observationResult["@type"] = "Moisture";
      }

      if(sensor instanceof sensor_module.LightSensor){
        response["@context"] = rootPath + contexts.light_sensor.get;
        response["@type"] = "LightSensor";
        response.madeObservation.observationResult["@type"] = "Light";
      }

      callback(response);
    }
  };

  Handler.prototype.Plant = {
    getPlantInfo : function(callback){
      var plant = {
        "@context": {
          "hydra": "http://www.w3.org/ns/hydra/core#",
          "vocab" : "http://www.example.org/vocab#",
          "schema" : "http://www.schema.org/",
          "iot-attribute" : "https://iotdb.org/pub/iot-attribute#",
          "name" : "schema:name",
          "description" : "schema:description",
          "associatedSensors" : "vocab:hasAssociatedSensors",
          "associatedActuators" : "vocab:hasAssociatedActuators",
          "idealTemperature" : "iot-attribute:temperature",
          "idealMoisture" : "iot-attribute:moisture",
          "idealLight" : "iot-attribute:light"
        },
        "@id": "http://www.graphs.org/",
        "@graph": [
          {
            "@id" : "http://example.org/graphs/idealMorning",
            "@graph": {
              "@id" : "/plants/1",
              "@type" : "vocab:Plant",
              "name" : "rosa",
              "description" : "Red Rose",
              "idealTemperature": 30,
              "idealMoisture": 60,
              "idealLight" : 35,
              "associatedSensors" : [
                {
                  "@id" : "/sensors/001/",
                  "@type" : "vocab:TemperatureSensor"
                },
                {
                  "@id" : "/sensors/002/",
                  "@type" : "vocab:MoistureSensor"
                },
                {
                  "@id" : "/sensors/003/",
                  "@type" : "vocab:LightSensor"
                }
              ],
              "associatedActuators" : [
                {
                  "@id" : "/actuators/001/",
                  "@type" : "vocab:Pump"
                }
              ]
            }
          },
          {
            "@id" : "http://example.org/graphs/idealAfternoon",
            "@graph": {
              "@id" : "/plants/1",
              "@type" : "vocab:Plant",
              "name" : "rosa",
              "description" : "Red Rose",
              "idealTemperature": 25,
              "idealMoisture": 80,
              "idealLight" : 60,
              "associatedSensors" : [
                {
                  "@id" : "/sensors/001/",
                  "@type" : "vocab:TemperatureSensor"
                },
                {
                  "@id" : "/sensors/002/",
                  "@type" : "vocab:MoistureSensor"
                },
                {
                  "@id" : "/sensors/003/",
                  "@type" : "vocab:LightSensor"
                }
              ],
              "associatedActuators" : [
                {
                  "@id" : "/actuators/001/",
                  "@type" : "vocab:Pump"
                }
              ]
            }
          },
          {
            "@id" : "http://example.org/graphs/idealNight",
            "@graph" : {
              "@id" : "/plants/1",
              "@type" : "vocab:Plant",
              "name" : "rosa",
              "description" : "Red Rose",
              "idealTemperature": 18,
              "idealMoisture": 30,
              "idealLight" : 5,
              "associatedSensors" : [
                {
                  "@id" : "/sensors/001/",
                  "@type" : "vocab:TemperatureSensor"
                },
                {
                  "@id" : "/sensors/002/",
                  "@type" : "vocab:MoistureSensor"
                },
                {
                  "@id" : "/sensors/003/",
                  "@type" : "vocab:LightSensor"
                }
              ],
              "associatedActuators" : [
                {
                  "@id" : "/actuators/001/",
                  "@type" : "vocab:Pump"
                }
              ]
            }
          }
        ]
      }
      callback(plant);
    }
  }



  Handler.prototype.nquads = {
    conversion : function(callback){
      var doc = {
         "@context": {
            "foaf" : "http://xmlns.com/foaf/0.1/",
            "name": "foaf:name",
            "homepage": {
              "@id": "foaf:homepage",
              "@type": "@id"
            },
            "knows" : "foaf:knows"
          },
          "@id" : "http://www.people.org/Manu",
          "@type" : "foaf:People",
          "name": "Manu Sporny",
          "homepage": "http://manu.sporny.org/",
          "knows" : {
            "@id" : "http://www.people.org/Markus",
            "@type" : "foaf:People",
            "name" : "Markus L",
            "homepage" : "http://markus.org"
          }
      };

      jsonld.expand(doc, function(err, expanded) {
        jsonld.flatten(expanded, function(err, flattened) {
          jsonld.toRDF(flattened, {format: 'application/nquads'}, function(err, nquads) {
            // nquads is a string of nquads
            console.log(JSON.stringify(nquads));
            callback(nquads);
          });
        });
      });
    },
    getPlantInfo : function(callback){
      //http://tinyurl.com/lqrr2fo

      var doc = {
        "@context": {
          "hydra": "http://www.w3.org/ns/hydra/core#",
          "vocab" : "http://www.example.org/vocab#",
          "schema" : "http://www.schema.org/",
          "iot-attribute" : "https://iotdb.org/pub/iot-attribute#",
          "name" : "schema:name",
          "description" : "schema:description",
          "associatedSensors" : "vocab:hasAssociatedSensors",
          "associatedActuators" : "vocab:hasAssociatedActuators",
          "idealTemperature" : "iot-attribute:temperature",
          "idealMoisture" : "iot-attribute:moisture",
          "idealLight" : "iot-attribute:light"
        },
        "@id": "http://www.graphs.org/",
        "@graph": [
          {
            "@id" : "http://example.org/graphs/idealMorning",
            "@graph": {
              "@id" : "/plants/1",
              "@type" : "vocab:Plant",
              "name" : "rosa",
              "description" : "Red Rose",
              "idealTemperature": 30,
              "idealMoisture": 60,
              "idealLight" : 35,
              "associatedSensors" : [
                {
                  "@id" : "/sensors/001/",
                  "@type" : "vocab:TemperatureSensor"
                },
                {
                  "@id" : "/sensors/002/",
                  "@type" : "vocab:MoistureSensor"
                },
                {
                  "@id" : "/sensors/003/",
                  "@type" : "vocab:LightSensor"
                }
              ],
              "associatedActuators" : [
                {
                  "@id" : "/actuators/001/",
                  "@type" : "vocab:Pump"
                }
              ]
            }
          },
          {
            "@id" : "http://example.org/graphs/idealAfternoon",
            "@graph": {
              "@id" : "/plants/1",
              "@type" : "vocab:Plant",
              "name" : "rosa",
              "description" : "Red Rose",
              "idealTemperature": 25,
              "idealMoisture": 80,
              "idealLight" : 60,
              "associatedSensors" : [
                {
                  "@id" : "/sensors/001/",
                  "@type" : "vocab:TemperatureSensor"
                },
                {
                  "@id" : "/sensors/002/",
                  "@type" : "vocab:MoistureSensor"
                },
                {
                  "@id" : "/sensors/003/",
                  "@type" : "vocab:LightSensor"
                }
              ],
              "associatedActuators" : [
                {
                  "@id" : "/actuators/001/",
                  "@type" : "vocab:Pump"
                }
              ]
            }
          },
          {
            "@id" : "http://example.org/graphs/idealNight",
            "@graph" : {
              "@id" : "/plants/1",
              "@type" : "vocab:Plant",
              "name" : "rosa",
              "description" : "Red Rose",
              "idealTemperature": 18,
              "idealMoisture": 30,
              "idealLight" : 5,
              "associatedSensors" : [
                {
                  "@id" : "/sensors/001/",
                  "@type" : "vocab:TemperatureSensor"
                },
                {
                  "@id" : "/sensors/002/",
                  "@type" : "vocab:MoistureSensor"
                },
                {
                  "@id" : "/sensors/003/",
                  "@type" : "vocab:LightSensor"
                }
              ],
              "associatedActuators" : [
                {
                  "@id" : "/actuators/001/",
                  "@type" : "vocab:Pump"
                }
              ]
            }
          }
        ]
      }

      jsonld.expand(doc, function(err, expanded) {
        console.log("\n\n******************* EXPANDED *******************\n\n");
        console.log(JSON.stringify(expanded));
            
        jsonld.flatten(expanded, function(err, flattened) {
          console.log("\n\n******************* FLATTENED *******************\n\n");
          console.log(JSON.stringify(flattened));

          jsonld.toRDF(flattened, {format: 'application/nquads'}, function(err, nquads) {
            // nquads is a string of nquads
            console.log(JSON.stringify(nquads));
            //callback(nquads);
            console.log("\n\n******************* OPPOSEITE CONVERSION *******************\n\n");
            jsonld.fromRDF(nquads, {format: 'application/nquads'}, function(err, doc) {
                console.log(JSON.stringify(doc));
                callback(doc);
            });
          });
        });
      });

    }
  };


  exports.Handler = Handler;

})();