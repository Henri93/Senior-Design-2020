var mongoose = require('mongoose')

var pumpSchema = new mongoose.Schema({
  port: {
    type: Number,
    index: true,
    unique: true 
  },
  isRunning: Boolean
})

module.exports = mongoose.model('Pump', pumpSchema)