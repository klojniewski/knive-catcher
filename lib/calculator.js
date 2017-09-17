class Calculator {
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
}

module.exports = Calculator
