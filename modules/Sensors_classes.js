(function(){

	function Sensor(sensor){
		this.ID = sensor.ID;
		this.type = sensor.type;
		this.description = sensor.description;
		this.pin = sensor.pin;
		//timestamp? e sensorValue?
	};

	Sensor.prototype.read = function(){
		//here the board should read the real value in base to the type of sensor;
		return Math.random();
	}

	exports.Sensor = Sensor;


	function TemperatureSensor(sensor){
		this.ID = sensor.ID;
		this.type = sensor.type;
		this.description = sensor.description;
		this.pin = sensor.pin;
		this.unit = "celsius";
	};

	TemperatureSensor.prototype.changeUnit = function(newUnit){
		//TODO
		return null;
	}

	TemperatureSensor.prototype = new Sensor();
	TemperatureSensor.prototype.constructor = TemperatureSensor;

	exports.TemperatureSensor = TemperatureSensor;

})();