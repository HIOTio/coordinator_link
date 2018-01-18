// create a model for this aggregator
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var debug= require("debug")("AGG1");
var AggSchema = new Schema({
  date:  {
    type: Date,
    default: Date.now
  },
  readings: [{
      reading: Number,
      date: Date,
      sensor_id: String
  }],
  min: Number,
  max: Number,
  mean: Number,
  added: Date,
  active: Boolean
});

// model name is AGG_ and this id

    var Rec =  mongoose.model("AGG_59db76cdccc548be30e5249f", AggSchema);

exports.process = function(data){
    //push the readings into sensor_readings
    var SR = require("../../models/sensor_reading");
    SR.insertMany(
        data.readings
    );
    var rec = new Rec({
        date: data.date,
  min: data.min,
  max: data.max,
  mean: data.mean
    });
    rec.save(function(err,res){
        if (err) {
            debug(err);
        }
    });
}