(function(){

  var sensor_module = require('./Sensors_classes');
  var actuator_module = require('./Actuators_classes');
  var geo_module = require('./Location_class');

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
    actuators: {
      get: "/contexts/get_actuators.jsonld",
      post : "/contexts/post_actuators.jsonld"
    },
    irrigationPump : { 
      get: "/contexts/get_irrigationPump.jsonld",
      put: "/contexts/put_irrigationPump.jsonld",
      delete : "/contexts/delete_irrigationPump.jsonld"
    },
    powerWindow : {
      get : "/contexts/get_powerWindow.jsonld",
      put : "/contexts/put_powerWindow.jsonld"
    },
    heater : {
      get : "/contexts/get_heater.jsonld",
      put : "/contexts/put_heater.jsonld"
    },
    geo : "/contexts/geo.jsonld",
    plants : {
      get: "/contexts/get_plants.jsonld",
      post : "/contexts/post_plants.jsonld"
    },
    plant : { 
      get: "/contexts/get_plant.jsonld",
      put: "/contexts/put_plant.jsonld",
      delete : "/contexts/delete_plant.jsonld"
    }
  };

  function Handler(host, port){
    rootPath = "http://" + host + ":" + port;
    geo = new geo_module.Locator();
  };


  Handler.prototype.EntryPoint = {
    getEntryPoint : function(callback){
      var context_folder = rootPath + contexts.entryPoint;
      var response = {
        "@context" : context_folder,
        "@type": "EntryPoint",
        "@id": rootPath + "/",
        "plants" : "/plants",
        "sensors" : "/sensors",
        "actuators" : "/actuators",
        "geolocation" : "/geo"
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
        "@id": rootPath + "/sensors",
        "members" : []
      };
      for(var i = 0; i < sensors.length; i++){
        if(sensors[i] instanceof sensor_module.TemperatureSensor){
          response.members.push({
            "@id" : (rootPath + "/sensors/"+sensors[i].ID),
            "@type" : "TemperatureSensor"
          });
        }
        if(sensors[i] instanceof sensor_module.MoistureSensor){
          response.members.push({
            "@id" : (rootPath + "/sensors/"+sensors[i].ID),
            "@type" : "MoistureSensor"
          });
        }
        if(sensors[i] instanceof sensor_module.LightSensor){
          response.members.push({
            "@id" : (rootPath + "/sensors/"+sensors[i].ID),
            "@type" : "LightSensor"
          });
        }
      };
      callback(response);
    },
    getSensorValue : function(sensor, callback){
      var date = new Date(); 
      var response = {
        "@id" : (rootPath + "/sensors/" + sensor.ID),
        "sensorID" : sensor.ID.toString(),
        "sensorName" : sensor.name,
        "sensorDescription" : sensor.description,
        "madeObservation" : {
          "@type" : "vocab:Observation",
          "timestamp" : date.toISOString(),
          "observationResult" : {
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


  Handler.prototype.Actuator = {
    getActuators : function(actuators, callback){
      var context_folder = rootPath + contexts.actuators.get;
      var response = {
        "@context" : context_folder,
        "@id" : rootPath + "/actuators",
        "@type" : "Collection",
        "members" : []
      };
      for(var i = 0; i < actuators.length; i++){
        if(actuators[i] instanceof actuator_module.Pump){
          response.members.push({
            "@id" : (rootPath + "/actuators/"+actuators[i].ID),
            "@type" : "IrrigationPump"
          });
        }
        else if(actuators[i] instanceof actuator_module.PowerWindow){
          response.members.push({
            "@id" : (rootPath + "/actuators/"+actuators[i].ID),
            "@type" : "PowerWindow"
          });
        }
        else if(actuators[i] instanceof actuator_module.Heater){
          response.members.push({
            "@id" : (rootPath + "/actuators/"+actuators[i].ID),
            "@type" : "Heater"
          });
        }
      };
      callback(response);
    },
    getActuatorState : function(actuator, callback){
      var response = {
        "@id" : (rootPath + "/actuators/" + actuator.ID),
        "actuatorID" : actuator.ID.toString(),
        "actuatorName" : actuator.name,
        "actuatorDescription" : actuator.description,
        "actuatorState" : {
          "hasValue" : actuator.state
        }
      };
      if(actuator instanceof actuator_module.Pump){
        response.actuatorState["@type"] = "SwitchAction";
        response["@context"] = rootPath + contexts.irrigationPump.get;
        response["@type"] = "IrrigationPump";
      }
      else if(actuator instanceof actuator_module.PowerWindow){
        response.actuatorState["@type"] = "OpenCloseState";
        response["@context"] = rootPath + contexts.powerWindow.get;
        response["@type"] = "PowerWindow";
      }
      else if(actuator instanceof actuator_module.Heater){
        response.actuatorState["@type"] = "SwitchAction";
        response["@context"] = rootPath + contexts.heater.get;
        response["@type"] = "Heater";
      }
      callback(response);
    },
    setNewActuatorState : function(actuator, newState, callback){
      actuator.updateState(newState);
      var response = {
        "@id" : (rootPath + "/actuators/" + actuator.ID + "/" +newState),
        "actuatorID" : actuator.ID.toString(),
        "actuatorName" : actuator.name,
        "actuatorDescription" : actuator.description,
        "actuatorState" : {
          "hasValue" : actuator.state
        }
      };
      if(actuator instanceof actuator_module.Pump){
        response.actuatorState["@type"] = "SwitchAction";
        response["@context"] = rootPath + contexts.irrigationPump.put;
        response["@type"] = "IrrigationPump";
      }
      else if(actuator instanceof actuator_module.PowerWindow){
        response.actuatorState["@type"] = "OpenCloseState";
        response["@context"] = rootPath + contexts.powerWindow.put;
        response["@type"] = "PowerWindow";
      }
      else if(actuator instanceof actuator_module.Heater){
        response.actuatorState["@type"] = "SwitchAction";
        response["@context"] = rootPath + contexts.heater.put;
        response["@type"] = "Heater";
      }
      callback(response);
    }
  };


  Handler.prototype.Plant = {
    getPlants : function(plants, callback){
      var context_folder = rootPath + contexts.plants.get;
      var response = {
        "@context" : context_folder,
        "@id" : rootPath + "/plants",
        "@type" : "Collection",
        "members" : []
      }
      for(var i = 0; i < plants.length; i++){
        response.members.push({
          "@id" : (rootPath + "/plants/" + plants[i].ID),
          "@type" : "Plant"
        });
      }
      callback(response);
    },
    getPlantInfo : function(plant, callback){
      var context_folder = rootPath + contexts.plant.get;
      var response = {
        "@context" : context_folder,
        "@graph" : [
          {
            "@id" : "http://example.org/graphs/idealMorning",
            "@graph" : {
              "@id" : (rootPath + "/plants/" + plant.ID),
              "@type" : "Plant",
              "name" : plant.name,
              "description" : plant.description,
              "idealTemperature" : {
                "@type" : "Temperature",
                temperatureValue : plant.idealMorning.idealTemperature.temperatureValue,
                temperatureUnit : plant.idealMorning.idealTemperature.temperatureUnit
              },
              "idealMoisture" : {
                "@type" : "Moisture",
                moistureValue : plant.idealMorning.idealMoisture.moistureValue
              },
              "idealLight" : {
                "@type" : "Light",
                lightValue : plant.idealMorning.idealLight.lightValue
              },
              "associatedSensors" : {
                "@type" : "SensorsPlantCollection",
                "members" : plant.associatedSensors
              },
              "associatedActuators" : {
                "@type" : "ActuatorsPlantCollection",
                "members" : plant.associatedActuators
              }
            }
          },
          {
            "@id" : "http://example.org/graphs/idealAfternoon",
            "@graph" : {
              "@id" : (rootPath + "/plants/" + plant.ID),
              "@type" : "Plant",
              "name" : plant.name,
              "description" : plant.description,
              "idealTemperature" : {
                "@type" : "Temperature",
                temperatureValue : plant.idealAfternoon.idealTemperature.temperatureValue,
                temperatureUnit : plant.idealAfternoon.idealTemperature.temperatureUnit
              },
              "idealMoisture" : {
                "@type" : "Moisture",
                moistureValue : plant.idealAfternoon.idealMoisture.moistureValue
              },
              "idealLight" : {
                "@type" : "Light",
                lightValue : plant.idealAfternoon.idealLight.lightValue
              },
              "associatedSensors" : {
                "@type" : "SensorsPlantCollection",
                "members" : plant.associatedSensors
              },
              "associatedActuators" : {
                "@type" : "ActuatorsPlantCollection",
                "members" : plant.associatedActuators
              }
            }
          },
          {
            "@id" : "http://example.org/graphs/idealNight",
            "@graph" : {
              "@id" : (rootPath + "/plants/" + plant.ID),
              "@type" : "Plant",
              "name" : plant.name,
              "description" : plant.description,
              "idealTemperature" : {
                "@type" : "Temperature",
                temperatureValue : plant.idealNight.idealTemperature.temperatureValue,
                temperatureUnit : plant.idealNight.idealTemperature.temperatureUnit
              },
              "idealMoisture" : {
                "@type" : "Moisture",
                moistureValue : plant.idealNight.idealMoisture.moistureValue
              },
              "idealLight" : {
                "@type" : "Light",
                lightValue : plant.idealNight.idealLight.lightValue
              },
              "associatedSensors" : {
                "@type" : "SensorsPlantCollection",
                "members" : plant.associatedSensors
              },
              "associatedActuators" : {
                "@type" : "ActuatorsPlantCollection",
                "members" : plant.associatedActuators
              }
            }
          }
        ]
      };
      callback(response);
    }
  }

  Handler.prototype.Location = {
    getCoordinates : function(callback){
      var response = {
        "@context" : contexts.geo,
        "@id" : rootPath + "/geo",
        "@type": "GeoCoordinates",
        "latitude": geo.readCoordinates().lat,
        "longitude": geo.readCoordinates().lon
      };
      callback(response);
    }
  };

  Handler.prototype.StatusCode = {
    notFound : function(callback){
      var response = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@type": "Status",
        "statusCode": 404,
        "title": "Resource Not Found",
        "description": "The server has not found anything matching the URI given."
      };
      callback(response);
    },
    notImplemented : function(callback){
      var response = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@type": "Status",
        "statusCode": 501,
        "title": "Service Not Implemented",
        "description": "The server will implement this new feature in future web-service API."
      }
      callback(response);
    }
  };


  exports.Handler = Handler;

})();