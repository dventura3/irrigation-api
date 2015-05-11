(function(){

	 var chance = require('../node_modules/chance');

	/******************** Sensor Class ********************/

	function Sensor(sensorID, sensorName, sensorDescription){
		this.ID = sensorID;
		this.name = sensorName;
		this.description = sensorDescription;
		// Instantiate Chance so it can be used
		this.chance = new chance.Chance();

		this.read = function(){
			//here the board should read the real value in base to the type of sensor;
			return Math.random();
		}

		this.getType = function(){
			return "Sensor";
		}
	};

	exports.Sensor = Sensor;

	/******************** Temperature Sensor Class ********************/

	function TemperatureSensor(sensorID, sensorName, sensorDescription, sensorUnit){
		Sensor.call(this, sensorID, sensorName, sensorDescription);
		this.unit = sensorUnit;

		this.read = function(){
			return this.chance.integer({min: -20, max: 40});
		}

		this.changeUnit = function(newUnit){
			//TODO
			return null;
		}

		this.getType = function(){
			return "TemperatureSensor";
		}
	};

	TemperatureSensor.prototype = new Sensor;
	//TemperatureSensor.prototype.constructor = TemperatureSensor;

	exports.TemperatureSensor = TemperatureSensor;

	/******************** Soil Moisture Sensor Class ********************/

	function MoistureSensor(sensorID, sensorName, sensorDescription){
		Sensor.call(this, sensorID, sensorName, sensorDescription);

		this.read = function(){
			return this.chance.floating({min: 0, max: 1});
		}

		this.getType = function(){
			return "MoistureSensor";
		}
	};

	MoistureSensor.prototype = new Sensor;
	//MoistureSensor.prototype.constructor = MoistureSensor;

	exports.MoistureSensor = MoistureSensor;

	/******************** Light Sensor Class ********************/

	function LightSensor(sensorID, sensorName, sensorDescription){
		Sensor.call(this, sensorID, sensorName, sensorDescription);

		this.read = function(){
			return this.chance.integer({min: 0, max: 100});
		}

		this.getType = function(){
			return "LightSensor";
		}
	};

	LightSensor.prototype = new Sensor;
	//LightSensor.prototype.constructor = LightSensor;

	exports.LightSensor = LightSensor;

})();