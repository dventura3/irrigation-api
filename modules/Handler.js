(function(){

	var jsonld = require('../node_modules/jsonld');
	var sensor_module = require('./Sensors_classes');

	contexts = {
		entryPoint : "/contexts/entryPoint.jsonld",
		sensors : {
			get: "/contexts/get_sensors.jsonld",
			post : "/contexts/post_sensors.jsonld"
		},
		temperature_sensor : "/contexts/get_sensor_temperature_value.jsonld",
		moisture_sensor : "/contexts/get_sensor_moisture_value.jsonld",
		light_sensor : "/contexts/get_sensor_light_value.jsonld",
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
			//todo
			for(var i = 0; i >= sensors.length; i++){
				
			};
		}
	}

	exports.Handler = Handler;

})();