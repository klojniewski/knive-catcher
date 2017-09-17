const Env = require('./../config/env')
const Validator = require('./../lib/validator')
const Calculator = require('./../lib/calculator')
const OrderModel = require('./../models/Order')

const STRATEGY = {
  percentChange: 15,
  takeProfitPercent: 2,
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
async function takeProfitSignalDetection (ms) {
  return ms
}
async function stopLossSignalDetection (ms) {
  return ms
}

async function entry (ticker, capital) {
  console.info(ticker)
  const positionSize = Calculator.getPositionSize(capital, STRATEGY.portfolioPercentRiskPerTrade, STRATEGY.stopLossPercent)
  const buySize = positionSize / ticker.last
  const buyCommision = Calculator.getTakerCommisionValue(buySize, ACCOUNT.commisionPercentage)
  const sellSize = buySize - buyCommision
  const sellCommision = Calculator.getTakerCommisionValue(sellSize, ACCOUNT.commisionPercentage)
  const orderToCreate = {
    currencyPair: ticker.currencyPair,
    buyOrderId: ticker._id,
    buyPrice: ticker.last,
    buySize,
    buyCommision,
    positionSize,
    sellPrice: Calculator.getPercentageIncreasedValue(ticker.last, STRATEGY.takeProfitPercent),
    sellSize,
    sellCommision,
    stopLoss: Calculator.getPercentageIncreasedValue(ticker.last, -STRATEGY.stopLossPercent),
    time: ticker.time,
    status: Env.STATUS_NEW
  }
  console.info(orderToCreate)
  process.exit()
  await OrderModel(orderToCreate).save(error => {
    if (error) {
      this.Logger.error(`Failed to create order`)
    }
  })
}

module.exports.entrySignalDetection = entrySignalDetection
module.exports.takeProfitSignalDetection = takeProfitSignalDetection
module.exports.stopLossSignalDetection = stopLossSignalDetection
module.exports.entry = entry
