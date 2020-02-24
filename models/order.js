var mongoose = require('mongoose')

var orderSchema = new mongoose.Schema({
  uuid: {
    type: String,
    index: true,
    unique: true 
  },
  ingredients: {
    type: Map,
    of: String   //map of ingredient name to object {dispensed, total ml amount}
  },
  completed: Boolean,
  receivedTime: Date,
  completedTime: Date
})

module.exports = mongoose.model('Order', orderSchema)