class Calculator {
  // @TODO: need to add rounding to each function
  static dailyPercentChangeFromHigh (last, highest) {
    return 100 * (highest - last) / highest
  }
  static getPercentageIncreasedValue (initalValue, percent) {
    return initalValue + (initalValue * percent / 100)
  }
  static getPositionSize (capital, riskPercentage, stopLossPercentage) {
    const amountAtRisk = capital * riskPercentage / 100

    return amountAtRisk / stopLossPercentage * 100
  }
  static getTakerCommisionValue (positionValue, comissionPercentage) {
    return positionValue * comissionPercentage / 100
  }
  static getBuySize (size, price) {
    return size / price
  }
  static getSellSize (buySize, buyCommision) {
    return buySize - buyCommision
  }
  static getSellValue (size, price) {
    return size * price
  }
  static getEstimatedProfit (sellPrice, buyPrice, sellCommision) {
    return sellPrice - buyPrice - sellCommision
  }
}

module.exports = Calculator
