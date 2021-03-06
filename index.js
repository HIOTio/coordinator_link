var config = require("./config");
var mqtt = require("mqtt");
var MQTT_ADDR = config.mqttServer;
var MQTT_PORT = config.mqttPort;
var messaging = require("./topic");
var express = require("express");
var debug = require("debug")("index.js");
var bodyParser = require("body-parser");
var mosca= require("mosca");
var expressValidator = require("express-validator");
var app = express();
var socketSend={};
app.use(bodyParser.json());
// Set up websockets
var expressWs = require("express-ws")(app);

var cors = require("cors");
app.use(bodyParser.urlencoded({
  extended: "false"
}));
app.use(expressValidator())
app.use(cors({
    origin: ["http://localhost:4200","http://localhost:3000"]
}));

app.options("*", cors());
var handlers={};
//

var topics={};
// connect to MQTT server
if (!config.preventMosca){
var server= new mosca.Server({port:config.mqttPort});
server.on("ready", setup);

server.on("clientConnected", function(client) {
	debug("client connected", client.id);		
});

// fired when a message is received
server.on("published", function(packet, client) {
  debug("Published", packet.payload);
});
}


// fired when the mqtt server is ready
function setup() {
  debug("Mosca server is up and running");
}
var client = mqtt.connect(MQTT_ADDR, {
  keepalive: 0,
  debug: false
});
app.post("/m2m/", function(req,res,next){
    if(req.body.topic && req.body.message){
      client.publish(req.body.topic,JSON.stringify(req.body.message));
      res.send({status:"OK"});
    }else{
      res.send({err:"malformed",msg:"you need to include a topic and message as part of the body"});
      socketSend.send("inbound request from platform failed");

    }
});

for (var i = 0; i < config.mqttTopic.length; i++) {
  topics[config.mqttTopic[i].topic.slice(0,1)]= config.mqttTopic[i];
  if (config.mqttTopic[i].handler) {
    handlers[config.mqttTopic[i].topic.slice(0,1)] = require("./handlers/"  + config.mqttTopic[i].handler);
  }
  
};
messaging(client,topics,socketSend, handlers);

app.listen(3001, function () {
 });