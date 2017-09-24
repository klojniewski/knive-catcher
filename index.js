const Env = require('./config/env')
const Mongoose = require('mongoose')
const TickerModel = require('./models/Ticker')
const OrderModel = require('./models/Order')

const { entrySignalDetection, entry } = require('./strategies/knive-catcher')

const WALLET = {
  capital: 1
}

backtest()

async function backtest () {
  Mongoose.connect(Env.DB_URL, { useMongoClient: true })
  Mongoose.Promise = global.Promise

  // delete all orders from previous test
  await OrderModel.deleteMany({})
  console.info('Removed previous orders')

  // Don't `await`, instead get a cursor
  const cursor = TickerModel.find().cursor()
  // Use `next()` and `await` to exhaust the cursor
  for (let ticker = await cursor.next(); ticker != null; ticker = await cursor.next()) {
    // entry signal detection
    if (WALLET.capital > 0.000001) {
      if (await entrySignalDetection(ticker)) {
        const positionSize = await entry(ticker, WALLET.capital)
        if (positionSize) {
          WALLET.capital -= positionSize
          console.log(`Entered: ${ticker.currencyPair} at ${ticker.last}, capital left: ${WALLET.capital}`)
        }
      }
    }

    const orderCursor = OrderModel.find({
      currencyPair: ticker.currencyPair,
      status: Env.STATUS_NEW
    }).cursor()
    // Use `next()` and `await` to exhaust the orderCursor
    for (let order = await orderCursor.next(); order != null; order = await orderCursor.next()) {
      if (order.sellPrice < ticker.last) {
        order.status = Env.STATUS_SOLD_PROFIT
        order.dateFinished = ticker.time
        await order.save()
        WALLET.capital += (order.sellValue - order.sellCommision)
        console.log('profit!')
      }
      if (order.stopLoss > ticker.last) {
        order.status = Env.STATUS_SOLD_LOST
        order.dateFinished = ticker.time
        await order.save()
        WALLET.capital += (order.sellValue - order.sellCommision)
        console.log('loss!')
      }
    }
  }
}
