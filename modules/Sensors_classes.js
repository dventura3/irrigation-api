(function(){

	/******************** Sensor Class ********************/

	function Sensor(sensorID, sensorName, sensorDescription){
		this.ID = sensorID;
		this.type = sensorName;
		this.description = sensorDescription;
	};

	Sensor.prototype.read = function(){
		//here the board should read the real value in base to the type of sensor;
		return Math.random();
	}

	exports.Sensor = Sensor;

	/******************** Temperature Sensor Class ********************/

	function TemperatureSensor(sensorID, sensorName, sensorDescription, sensorUnit){
		this.ID = sensorID;
		this.type = sensorName;
		this.description = sensorDescription;
		this.unit = sensorUnit;
	};

	TemperatureSensor.prototype.changeUnit = function(newUnit){
		//TODO
		return null;
	}

	TemperatureSensor.prototype = new Sensor();
	TemperatureSensor.prototype.constructor = TemperatureSensor;

	exports.TemperatureSensor = TemperatureSensor;

	/******************** Soil Moisture Sensor Class ********************/

	function MoistureSensor(sensorID, sensorName, sensorDescription){
		this.ID = sensorID;
		this.type = sensorName;
		this.description = sensorDescription;
	};

	MoistureSensor.prototype = new Sensor();
	MoistureSensor.prototype.constructor = MoistureSensor;

	exports.MoistureSensor = MoistureSensor;

	/******************** Light Sensor Class ********************/

	function LightSensor(sensorID, sensorName, sensorDescription){
		this.ID = sensorID;
		this.type = sensorName;
		this.description = sensorDescription;
	};

	LightSensor.prototype = new Sensor();
	LightSensor.prototype.constructor = LightSensor;

	exports.LightSensor = LightSensor;

})();