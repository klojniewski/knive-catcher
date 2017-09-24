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

async function entry (ticker, capital) {
  let entered = false
  const buyPrice = ticker.last
  const buyValue = Calculator.getPositionSize(capital, STRATEGY.portfolioPercentRiskPerTrade, STRATEGY.stopLossPercent)
  const buySize = Calculator.getBuySize(buyValue, buyPrice)
  const buyCommision = Calculator.getTakerCommisionValue(buySize, ACCOUNT.commisionPercentage)

  const sellPrice = Calculator.getPercentageIncreasedValue(ticker.last, STRATEGY.takeProfitPercent)
  const sellSize = Calculator.getSellSize(buySize, buyCommision)
  const sellValue = Calculator.getSellValue(sellSize, sellPrice)
  const sellCommision = Calculator.getTakerCommisionValue(sellValue, ACCOUNT.commisionPercentage)
  const estimatedProfit = Calculator.getEstimatedProfit(sellValue, buyValue, sellCommision)

  const stopLoss = Calculator.getPercentageIncreasedValue(ticker.last, -STRATEGY.stopLossPercent)
  const stopLossValue = Calculator.getSellValue(sellSize, stopLoss)
  const stopLossCommision = Calculator.getTakerCommisionValue(stopLossValue, ACCOUNT.commisionPercentage)
  const estimatedLoss = Calculator.getEstimatedProfit(stopLossValue, buyValue, stopLossCommision)

  const orderToCreate = {
    currencyPair: ticker.currencyPair,
    id: uuidv1(),
    buyOrderId: ticker._id,
    buyPrice,
    buySize,
    buyCommision,
    buyValue,
    sellPrice,
    sellSize,
    sellCommision,
    sellValue,
    estimatedProfit,
    estimatedLoss,
    stopLoss,
    stopLossValue,
    stopLossCommision,
    dateCreated: ticker.time,
    status: Env.STATUS_NEW
  }
  if (orderToCreate.estimatedProfit > 0.000001) {
    try {
      await OrderModel(orderToCreate).save()
      entered = true
    } catch (error) {
      console.error(`Failed to create order`)
      process.exit()
    }
  }
  return entered ? orderToCreate : false
}

module.exports.entrySignalDetection = entrySignalDetection
module.exports.entry = entry
