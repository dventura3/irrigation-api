(function(){

	contexts = {
		entryPoint : "contexts/entryPoint.jsonld",
		sensors : "contexts/sensors.jsonld"
	}

	function Handler(sensors, actuators, plants, rootPath){
		this.sensors = sensors;
		this.actuators = actuators;
		this.plants = plants;
		this.rootPath = rootPath;
	};

	exports.Handler = Handler;

})();