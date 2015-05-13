# Greenhouse and Garden API

This repository contains the implementation of an [JSON-LD](http://json-ld.org) API for greenhouses or gardens following the RESTful principles. The server, that exposes the API and is implemented in [Node.js](https://nodejs.org), represents a board in which sensors and actuators are connected and used for real-time monitoring and status setting. Furthermore the server is able to provide [RESTdesc](http://restdesc.org) descriptions useful to represent the functionalities of the available services.


## Settings

Currently the board is simulated. This means there are fake sensors, actuators, plants and geolocation coodiantes.
It's possible adding or removing sensors, actuators and plants, modifying the `/lib/fakeResources.json` file.
As you can see, it is composed by three parts:
- sensors, that contains a list of sensors;
- actuators, that contains a list of actuators;
- plants, that contains a list of plants.

Types of permitted sensors are:
- TemperatureSensor;
- MoistureSensor;
- LightSensor.

Types of permitted actuators are:
- IrrigationPump;
- PowerWindow;
- Heater.


## Usage

After having cloned the repository, you have to install the Node.js modules with `nmp install`.
Now you can run the server through `node index.js`. The default host is `127.0.0.1` and the default port is `3300`. You can change this configuration, setting the two environmental variables `HOST` and `PORT`.

The following table summarises the RESTful services which are currently implemented. Each of them returns a JSON-LD response whose context is stored in `/public/contexts/` directory.

| URL | Method Type | Service Description |
|-----|-------------|---------------------|
|/sensors| GET | Get sensors' list |
|/sensors/:sensorID| GET | Get information about a sensor |
|/actuators| GET | Get actuators' list |
|/actuators/:actuatorID| GET | Get information about a actuator |
|/actuators/:actuatorID/:newState| PUT | Update the actuator state |
|/plants| GET | Get plants' list |
|/plants/:plantID| GET | Get information about a plant |
|/geo| GET | Get board's coordinates |


## HTTP OPTIONS to get RESTdesc descriptions

In order to describe the functionalities of the available services and let machines know what a service does (and enable machines to generate plans to combine services by different sources), each service has its correspondent RESTdesc description.

The RESTdesc descriptions are stored in `/public/RESTdesc_descriptions/board` directory.

To get a RESTdesc description for a service, you have to invoke the correspondent HTTP OPTIONS.
For example, if you want the RESTdesc description of the `/sensors/:sensorID` URL, you have to do this:

`curl -i -X OPTIONS http://127.0.0.1:3300/sensors/1`

The response will be like this:

```HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,PUT,POST,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Content-Length, X-Requested-With
Content-Type: text/n3; charset=utf-8
Content-Length: 519
ETag: W/"207-52b7d12c"
Date: Wed, 13 May 2015 13:07:01 GMT
Connection: keep-alive

@prefix vocab: <http://www.example.org/vocab#>.
@prefix http: <http://www.w3.org/2011/http#>.
@prefix dbpedia: <http://dbpedia.org/resource/>.
@prefix iot: <https://iotdb.org/pub/iot#>.


{
  ?sensor a vocab:Sensor.
}
=>
{
  _:request http:methodName "GET";
            http:requestURI ?sensor;
            http:resp [ http:body ?sensor ].

  ?sensor iot:name ?name;
          iot:description ?desc;
          vocab:madeObservation ?obs.
  ?obs vocab:hasTimestamp ?timestamp;
       vocab:outputObservation ?result.
}.```