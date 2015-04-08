(function(){

	/******************** Sensor Class ********************/

	function Sensor(sensorID, sensorName, sensorDescription){
		this.ID = sensorID;
		this.name = sensorName;
		this.description = sensorDescription;

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

		this.getType = function(){
			return "MoistureSensor";
		}
	};

	MoistureSensor.prototype = new Sensor();
	//MoistureSensor.prototype.constructor = MoistureSensor;

	exports.MoistureSensor = MoistureSensor;

	/******************** Light Sensor Class ********************/

	function LightSensor(sensorID, sensorName, sensorDescription){
		Sensor.call(this, sensorID, sensorName, sensorDescription);

		this.getType = function(){
			return "LightSensor";
		}
	};

	LightSensor.prototype = new Sensor();
	//LightSensor.prototype.constructor = LightSensor;

	exports.LightSensor = LightSensor;

})();