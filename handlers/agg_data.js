var fs = require('fs');
var debug = require('debug')('handlers\agg_data.js');
//loop through the aggregator folder and create an associative array of aggregator handlers
aggHandlers={}
fs.readdir("./handlers/aggregators", function( err, files) {
    if (err){
        debug(err);
    }else {
        files.forEach( function(file, index) {
            aggHandlers[file] = require("./aggregators/" + file);
        });
    }

});
exports.process = function(data){
    const message = JSON.parse(data.toString());

    aggHandlers[message.aggId].process(message);
}