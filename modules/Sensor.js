(function(){

	function Sensor(){
		this.ID;
		this.type;
		this.description;
		this.unit;
		this.pin;
		//timestamp? e sensorValue?
	};

	Sensor.prototype.initialize = function(sensor){
		this.ID = sensor.ID;
		this.type = sensor.type;
		this.description = sensor.description;
		this.unit = sensor.unit;
		this.pin = sensor.pin;
	}

	Sensor.prototype.read = function(){
		//here the board should read the real value;
		return Math.random();
	}

	exports.Sensor = Sensor;

})();