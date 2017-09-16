const Env = require('./config/env')
const Mongoose = require('mongoose')
const TickerModel = require('./models/Ticker')
const Validator = require('./lib/validator')
const Calculator = require('./lib/calculator')

class Backtester {
  constructor () {
    Mongoose.connect(Env.DB_URL, { useMongoClient: true })
    Mongoose.Promise = global.Promise
  }
  init () {
    console.info('Backtester Init')

    var stream = TickerModel.find().cursor()

    stream.on('data', function (ticker) {
      if (ticker.currencyPair != 'xxx') {
        if (
            Validator.isLowest(ticker.last, ticker.dayLow)
          ) {
          console.log('lowest', Calculator.dailyPercentChangeFromHigh(ticker.last, ticker.dayHigh))
        }
      }
    }).on('error', function (err) {
  // handle the error
    }).on('close', function () {
  // the stream is closed
    })
  }
}

const backtest = new Backtester()
backtest.init()
