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
	/************ It can be switched on/off ************/

	function Pump(actuatorID, actuatorName, actuatorDescription, actuatorCurrentState){
		Actuator.call(this, actuatorID, actuatorName, actuatorDescription, actuatorCurrentState);
	};

	Pump.prototype = new Actuator;
	//Pump.prototype.constructor = Pump;

	exports.Pump = Pump;

	/******************** Window Class ********************/
	/************** It can be opened/closed **************/

	function PowerWindow(actuatorID, actuatorName, actuatorDescription, actuatorCurrentState){
		Actuator.call(this, actuatorID, actuatorName, actuatorDescription, actuatorCurrentState);
	};

	PowerWindow.prototype = new Actuator;

	exports.PowerWindow = PowerWindow;

	/******************** Heater Class ********************/
	/************* It can be switched on/off *************/

	function Heater(actuatorID, actuatorName, actuatorDescription, actuatorCurrentState){
		Actuator.call(this, actuatorID, actuatorName, actuatorDescription, actuatorCurrentState);
	};

	Heater.prototype = new Actuator;

	exports.Heater = Heater;

})();