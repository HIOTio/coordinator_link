var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ErrorSchema = new Schema({
  message: String,
  path:String,
  added: Date
})



module.exports = mongoose.model('Error', ErrorSchema)
