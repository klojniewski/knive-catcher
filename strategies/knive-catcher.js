const Env = require('./../config/env')
const Validator = require('./../lib/validator')
const Calculator = require('./../lib/calculator')
const OrderModel = require('./../models/Order')

const uuidv1 = require('uuid/v1')

const STRATEGY = {
  percentChange: 15,
  takeProfitPercent: 2.5,
  stopLossPercent: 1.5,
  portfolioPercentRiskPerTrade: 0.5
}

const ACCOUNT = {
  commisionPercentage: 0.25
}

async function entrySignalDetection (ticker) {
  let entrySignal = false

  if (
    Validator.isLowest(ticker.last, ticker.dayLow) &&
    Calculator.dailyPercentChangeFromHigh(ticker.last, ticker.dayHigh) > STRATEGY.percentChange) {
    entrySignal = true
  }

  return entrySignal
}
async function takeProfitSignalDetection (ticker, capital) {
  const cursor = OrderModel.find({
    currencyPair: ticker.currencyPair,
    status: Env.STATUS_NEW
  }).cursor()
  // Use `next()` and `await` to exhaust the cursor
  for (let order = await cursor.next(); order != null; order = await cursor.next()) {
    if (order.sellPrice < ticker.last) {
      order.status = Env.STATUS_SOLD
      order.dateFinished = ticker.time
      await order.save()
      console.log('profit!')
    }
  }
}
async function stopLossSignalDetection (ms) {
  return ms
}

async function entry (ticker, capital) {
  const positionSize = Calculator.getPositionSize(capital, STRATEGY.portfolioPercentRiskPerTrade, STRATEGY.stopLossPercent)
  const buyPrice = ticker.last
  const buySize = positionSize / ticker.last
  const buyCommision = Calculator.getTakerCommisionValue(buySize, ACCOUNT.commisionPercentage)
  const buyValue = positionSize
  const sellSize = buySize - buyCommision
  const sellCommision = Calculator.getTakerCommisionValue(sellSize, ACCOUNT.commisionPercentage)
  const sellPrice = Calculator.getPercentageIncreasedValue(ticker.last, STRATEGY.takeProfitPercent)
  const sellValue = (sellSize * sellPrice) - sellCommision
  const estimatedProfit = sellValue - (buyPrice * buySize)
  const orderToCreate = {
    currencyPair: ticker.currencyPair,
    id: uuidv1(),
    buyOrderId: ticker._id,
    buyPrice,
    buySize,
    buyCommision,
    buyValue,
    positionSize,
    sellPrice,
    sellSize,
    sellCommision,
    sellValue,
    estimatedProfit,
    stopLoss: Calculator.getPercentageIncreasedValue(ticker.last, -STRATEGY.stopLossPercent),
    dateCreated: ticker.time,
    status: Env.STATUS_NEW
  }

  try {
    await OrderModel(orderToCreate).save()
  } catch (error) {
    console.error(`Failed to create order`)
    process.exit()
  }
  return positionSize
}

module.exports.entrySignalDetection = entrySignalDetection
module.exports.takeProfitSignalDetection = takeProfitSignalDetection
module.exports.stopLossSignalDetection = stopLossSignalDetection
module.exports.entry = entry
