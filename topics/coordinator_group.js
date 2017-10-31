var mqtt = require('mqtt')
var config = require('../config')
var db = require('../db')
var SensorReading = require('../models/sensor_reading')
var MQTT_TOPIC = config.mqttTopic.coordinator_group
var MQTT_ADDR = config.mqttServer
var MQTT_PORT = 1883

var client = mqtt.connect(MQTT_ADDR, {
  clientId: 'node2',
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  debug: true
})
client.on('connect', function () {
//  console.log('Subscribed to - ' + MQTT_TOPIC)
  client.subscribe(MQTT_TOPIC)
})
client.on('message', function (topic, message) {
  SensorReading.create(JSON.parse(message.toString()), function (err, readings) {
  //  console.log("received messange on topic '" + topic.toString() + "'")
    if (err) {
  //    console.log(err)
    } else {

    }
  })
})
client.on('error', function (err) {
 // console.log(err)
})
