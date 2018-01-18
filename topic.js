
var db = require('./db');
var http = require('http');
var debug = require("debug")("topic.js");
var _ch
module.exports = function( client, channels,socketSend,handlers) {
  //list of all topics

    client.on('connect', function () {
      for(_ch in channels){
        client.subscribe(channels[_ch].topic)
        debug("M2m subscribed to " + channels[_ch].topic)
      }
    })
    client.on('message', function (topic,message) {
      var _top=topic.slice(0,1)
      channel=channels[_top]
      debug("m2m message received on topic :" + topic + " processing under " + channel.topic)
      if(channel.model){
        // there's a model available for this message, can push through to db
        var model= new require('./models/'+channel.model)(JSON.parse(message.toString()))
        model.save(function(err,_model){
          if (err) {
            debug(err);
          }
        });
        debug("m2m saving to DB");
        }else{
          //need to process this via a handler before writing to the db
          handlers[channel.topic].process(message);
        }
      if(channel.tellPlatform){
        debug("m2m sending message to platform");
        var options = {
          host: '127.0.0.1',
          path: '/m2p',
          port: '3000',
          method: 'POST'
        };
        
        callback = function(response) {
          var str = ''
          response.on('data', function (chunk) {
            str += chunk;
          });
        
          response.on('end', function () {
            debug("m2m response from server " + str);
          });
        }
        var msg=JSON.parse(message.toString()).msg
        var platformMessage = JSON.stringify(
          {
            msg:msg
          })
        var req = http.request(options, callback);
        req.write(platformMessage);
        req.end();
      }
      
      })

    client.on('error', function (err) {
    //  debug(err)
    })


}