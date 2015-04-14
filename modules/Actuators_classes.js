(function(){

	/******************** Actuator Class ********************/

	function Actuator(actuatorID, actuatorName, actuatorDescription, actuatorCurrentState){
		this.ID = actuatorID;
		this.name = actuatorName;
		this.description = actuatorDescription;
		this.state = actuatorCurrentState;

		this.updateState = function(newState){
			this.state = newState;
			//here should be set the new state.
		}
	};

	exports.Actuator = Actuator;

	/******************** Pump Class ********************/

	function Pump(actuatorID, actuatorName, actuatorDescription, actuatorCurrentState){
		Actuator.call(this, actuatorID, actuatorName, actuatorDescription, actuatorCurrentState);
	};

	Pump.prototype = new Actuator;
	//Pump.prototype.constructor = Pump;

	exports.Pump = Pump;

})();