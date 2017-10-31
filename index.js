var config = require('./config')
var mqtt = require('mqtt')
var MQTT_ADDR = config.mqttServer
var MQTT_PORT = config.mqttPort
var messaging = require('./topic')
var express = require('express')
var bodyParser = require('body-parser')
var mosca= require('mosca')
var expressValidator = require('express-validator')
var app = express()
var socketSend={}

app.use(bodyParser.json())
// Set up websockets
var expressWs = require('express-ws')(app);
app.post('/m2m/', function(req,res,next){
    if(req.body.topic && req.body.message){
      client.publish(req.body.topic,JSON.stringify(req.body.message))
      res.send({status:"OK"})
    }else{
      res.send({err:"malformed",msg:"you need to include a topic and message as part of the body"})
      socketSend.send("inbound request from platform failed")

    }
})
var cors = require('cors')
app.use(bodyParser.urlencoded({
  extended: 'false'
}))
app.use(expressValidator())
app.use(cors({
    origin: ['http://localhost:4200','http://localhost:3000']
}))

app.options('*', cors());
var handlers={}
var topics={}
// connect to MQTT server
if(config.preventMosca){
var client = mqtt.connect(MQTT_ADDR, {
  keepalive: 0,
  debug: false
})
}else{
  
client= new mosca.Server({port:config.mqttPort});
}
for (var i = 0; i < config.mqttTopic.length; i++) {
  topics[config.mqttTopic[i].topic.slice(0,1)]= config.mqttTopic[i]
  
}
messaging(client,topics,socketSend)

app.listen(3001, function () {
 })