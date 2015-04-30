(function(){

  function Locator(){
    //As simulation, we use fixed coordinates
    var coordinate = {
      lat: 37.5261719,
      lon: 15.0756884
    };

    this.readCoordinates = function(){
      //here should be written the code to enable the board to read suing a GPS module
      //its geocoordinates... but we simulate.
      return coordinate;
    }

  }

  exports.Locator = Locator;

})();