var mongoose = require('mongoose')

var orderSchema = new mongoose.Schema({
  uuid: {
    type: String,
    index: true,
    unique: true 
  },
  ingredients: {
    type: Map,
    of: Number   //map of ingredient name to ml amount
  },
  completed: Boolean,
  receivedTime: Date,
  completedTime: Date
})

module.exports = mongoose.model('Order', orderSchema)