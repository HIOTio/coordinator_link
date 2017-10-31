
var db = require('./db')
var http = require('http')
var _ch
module.exports = function( client, channels,socketSend) {
  //list of all topics

    client.on('connect', function () {
      for(_ch in channels){
        client.subscribe(channels[_ch].topic)
        console.log("M2m subscribed to " + channels[_ch].topic)
      }
    })
    client.on('message', function (topic,message) {
      var _top=topic.slice(0,1)
      channel=channels[_top]
      console.log("m2m message received on topic :" + topic + " processing under " + channel.topic)
      if(channel.model){
        var model= new require('./models/'+channel.model)(JSON.parse(message.toString()))
        model.save(function(err,_model){

        })
        console.log("m2m saving to DB")
        }
      if(channel.tellPlatform){
        console.log("m2m sending message to platform")
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
            console.log("m2m response from server " + str);
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
    //  console.log(err)
    })


}