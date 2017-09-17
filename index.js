const Env = require('./config/env')
const Mongoose = require('mongoose')
const TickerModel = require('./models/Ticker')

const { entrySignalDetection, takeProfitSignalDetection, stopLossSignalDetection, entry } = require('./strategies/knive-catcher')

const WALLET = {
  budget: 1
}

backtest()

async function backtest () {
  Mongoose.connect(Env.DB_URL, { useMongoClient: true })
  Mongoose.Promise = global.Promise

  // Don't `await`, instead get a cursor
  const cursor = TickerModel.find().cursor()
  // Use `next()` and `await` to exhaust the cursor
  for (let ticker = await cursor.next(); ticker != null; ticker = await cursor.next()) {
    // entry signal detection
    if (await entrySignalDetection(ticker)) {
      if (await entry(ticker, WALLET.budget)) {
        console.log(`Entered: ${ticker.currencyPair} at ${ticker.last}`)
      }
    }
    // take profit signal detection
    await takeProfitSignalDetection(ticker)
    // stop loss signal detection
    await stopLossSignalDetection(ticker)
  }
}
