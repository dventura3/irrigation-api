(function(){

	/******************** Actuator Class ********************/

	function Actuator(actuatorID, actuatorName, actuatorDescription, actuatorCurrentState){
		this.ID = actuatorID;
		this.type = actuatorName;
		this.description = actuatorDescription;
		this.state = actuatorCurrentState;
	};

	Actuator.prototype.updateState = function(newState){
		this.state = newState;
		//here should be set the new state.
	}

	exports.Actuator = Actuator;

	/******************** Pump Class ********************/

	function Pump(actuatorID, actuatorName, actuatorDescription, actuatorCurrentState){
		this.ID = actuatorID;
		this.type = actuatorName;
		this.description = actuatorDescription;
		this.state = actuatorCurrentState;
	};

	Pump.prototype = new Actuator();
	Pump.prototype.constructor = Pump;

	exports.Pump = Pump;

})();