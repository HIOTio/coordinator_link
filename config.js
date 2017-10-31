module.exports = {
preventMosca:true, //use this when debugging full platform, use the mosca server from the coordinator
  'mqttPort': 1883,
  'mqttServer': 'http://localhost',
  'mqttTopic': [{
    name: 'sensor readings',
    topic: 's/#',
    model: 'sensor_reading',
    tellPlatform:false
  },    
{
    topic:"e/#",
    name:"Error message from the deployment",
    model:"error",
    function:"error",
    tellPlatform:true
},
{
    topic:"r/#",
    name:"response from the deployment",
    function: "deployment_response",
    model:"deployment_responses"
},
{
    topic:"h/#",
    name:"health message from the deployment",
    model:"health",
    function:"healthMessage"
},
{
    topic:"c/#",
    name:"config message from the deployment",
    function:"config_responses"
},
{
    topic:"q/#",
    name:"query from the deployment",
    function:"deployment_query"
},
{
    topic:"x/#",
    name:"execute command from the platform",
    function:"execution_responses"
},
{
    topic:"a/#",
    name:"aggregation data from the deployment",
    function:"agg_data"
}
  ],
  'database': 'mongodb://localhost/hiot'
}
