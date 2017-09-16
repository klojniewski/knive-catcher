class Calculator {
  static dailyPercentChangeFromHigh (last, highest) {
    return 100 * (highest - last) / highest
  }
}

module.exports = Calculator
