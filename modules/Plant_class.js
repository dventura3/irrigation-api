(function(){

	function Plant(plant, associatedSensors, associatedActuators){
		this.ID = plant.plantID;
		this.name = plant.plantName;
		this.description = plant.plantDescription;

		this.idealMorning = {
      idealTemperature : {
        temperatureValue : plant.idealMorning.idealTemperature.temperatureValue,
        temperatureUnit : plant.idealMorning.idealTemperature.temperatureUnit
      },
      idealMoisture : {
        moistureValue : plant.idealMorning.idealMoisture.moistureValue
      },
      idealLight : {
        lightValue : plant.idealMorning.idealLight.lightValue
      }
    };

    this.idealAfternoon = {
      idealTemperature : {
        temperatureValue : plant.idealAfternoon.idealTemperature.temperatureValue,
        temperatureUnit : plant.idealAfternoon.idealTemperature.temperatureUnit
      },
      idealMoisture : {
        moistureValue : plant.idealAfternoon.idealMoisture.moistureValue
      },
      idealLight : {
        lightValue : plant.idealAfternoon.idealLight.lightValue
      }
    };

    this.idealNight = {
      idealTemperature : {
        temperatureValue : plant.idealNight.idealTemperature.temperatureValue,
        temperatureUnit : plant.idealNight.idealTemperature.temperatureUnit
      },
      idealMoisture : {
        moistureValue : plant.idealNight.idealMoisture.moistureValue
      },
      idealLight : {
        lightValue : plant.idealNight.idealLight.lightValue
      }
    };

    this.associatedSensors = associatedSensors;
    this.associatedActuators = associatedActuators;
	}

	exports.Plant = Plant;

})();