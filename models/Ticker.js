const moment = require('moment')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const tickerSchema = new Schema({
  currencyPair: String,
  exchange: String,
  last: Number,
  lowestAsk: Number,
  highestBid: Number,
  percentChange: Number,
  baseVolume: Number,
  quoteVolume: Number,
  isFrozen: Number,
  dayHigh: Number,
  dayLow: Number,
  time: Number
})

tickerSchema.statics.findInTime = function (currencyPair, hours, callback) {
  return this.findOne({
    currencyPair,
    time: {
      $gt: moment().subtract(hours, 'hours').unix()
    }
  }, callback)
}

tickerSchema.statics.findMax = function (currencyPair, callback) {
  return this.findOne({ currencyPair }, callback).sort({ highestBid: -1 })
}

tickerSchema.statics.findMaxByHour = function (currencyPair, hours, callback) {
  return this.findInTime(currencyPair, hours, callback).sort({ highestBid: -1 })
}

tickerSchema.statics.findMinByHour = function (currencyPair, hours, callback) {
  return this.findInTime(currencyPair, hours, callback).sort({ highestBid: 1 })
}

module.exports = mongoose.model('Ticker', tickerSchema)
