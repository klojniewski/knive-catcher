const Env = require('./config/env')
const Mongoose = require('mongoose')
const TickerModel = require('./models/Ticker')
const Validator = require('./lib/validator')
const Calculator = require('./lib/calculator')

backtest()

async function wait (ms) {
  await new Promise(resolve => setTimeout(() => resolve(), ms))
  console.log('waited', ms)
  return ms
}

async function backtest () {
  Mongoose.connect(Env.DB_URL, { useMongoClient: true })
  Mongoose.Promise = global.Promise

  // Don't `await`, instead get a cursor
  const cursor = TickerModel.find().cursor()
  // Use `next()` and `await` to exhaust the cursor
  for (let ticker = await cursor.next(); ticker != null; ticker = await cursor.next()) {
    if (ticker.currencyPair !== 'xxx') {
      if (Validator.isLowest(ticker.last, ticker.dayLow)) {
        console.log('lowest', Calculator.dailyPercentChangeFromHigh(ticker.last, ticker.dayHigh))
      }
    }
  }
}
