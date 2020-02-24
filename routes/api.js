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

router.get('/openPumps', function(_, res, next) {
  Pump.find({isRunning: false}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.json(result)
  })
})

router.get('/orders', function(_, res, next) {
  Order.find({}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.json(result)
  }).sort({ receivedTime: -1 })
})

router.get('/completedOrders', function(_, res, next) {
  Order.find({'completed': true}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.json(result)
  })
})

router.get('/order', function(req, res, next) {
  Order.find({uuid: req.query.orderId}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.json(result)
  })
})

module.exports = router