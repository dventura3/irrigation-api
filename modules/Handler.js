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
	}

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
	}

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
			  "sensorValue" : sensor.read(),
			  "timestamp" : date.toISOString()
			};
			
			if(sensor instanceof sensor_module.TemperatureSensor){
				response["@contexts"] = rootPath + contexts.temperature_sensor.get;
				response["@type"] = "TemperatureSensor";
				response["sensorUnit"] = sensor.unit;
			}

			if(sensor instanceof sensor_module.MoistureSensor){
				response["@contexts"] = rootPath + contexts.moisture_sensor.get;
				response["@type"] = "MoistureSensor";
			}

			if(sensor instanceof sensor_module.LightSensor){
				response["@contexts"] = rootPath + contexts.light_sensor.get;
				response["@type"] = "LightSensor";
			}

			callback(response);
		}
	}

	exports.Handler = Handler;

})();