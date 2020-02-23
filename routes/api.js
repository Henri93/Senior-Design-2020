var express = require('express')
var router = express.Router()
var Pump = require('../models/pump.js')
var Order = require('../models/order.js')

router.get('/pumps', function(_, res, next) {
  Pump.find({}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.json(result)
  })
})

router.get('/completedOrders', function(_, res, next) {
  Order.find({'completed': true}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.json(result)
  })
})

module.exports = router