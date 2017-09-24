const Env = require('./config/env')
const Mongoose = require('mongoose')
const TickerModel = require('./models/Ticker')
const OrderModel = require('./models/Order')

const { entrySignalDetection, entry } = require('./strategies/knive-catcher')

const WALLET = {
  capital: 1
}

backtest()

async function bankruptDetection () {
  const activeOrders = await OrderModel.count({
    status: Env.STATUS_NEW
  })
  if (activeOrders === 0 && WALLET.capital < 0.000001) {
    console.log(`${activeOrders} / ${WALLET.capital}`)
    console.error(`Bankrupt :rip`)
    process.exit()
  }
}

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
        const createdOrder = await entry(ticker, WALLET.capital)
        if (createdOrder) {
          WALLET.capital -= createdOrder.buyValue
          console.log(`Entered: ${ticker.currencyPair} at ${ticker.last}, capital left: ${WALLET.capital}`)
        } else {
          console.log(`Estimated profit too low, not entering.`)
        }
      }
    }
    // managing active orders
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
        console.log(`Profit! Was: ${WALLET.capital}`)
        WALLET.capital += (order.sellValue - order.sellCommision)
        console.log(`Profit! Became: ${WALLET.capital}`)
      }
      if (order.stopLoss > ticker.last) {
        order.status = Env.STATUS_SOLD_LOST
        order.dateFinished = ticker.time
        await order.save()
        console.log(`Loss! Was: ${WALLET.capital}`)
        WALLET.capital += (order.sellValue - order.sellCommision)
        console.log(`Loss! Became: ${WALLET.capital}`)
      }
    }
    await bankruptDetection()
  }
}
