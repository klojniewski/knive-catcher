const test = require('ava')
const Calculator = require('./../lib/calculator')

test('dailyPercentChange should calculate percentage value', t => {
  t.is(Calculator.dailyPercentChangeFromHigh(50, 100), 50)
  t.is(Calculator.dailyPercentChangeFromHigh(90, 100), 10)
  t.is(Calculator.dailyPercentChangeFromHigh(100, 100), 0)
  t.is(Calculator.dailyPercentChangeFromHigh(80, 100), 20)
  t.is(Calculator.dailyPercentChangeFromHigh(60, 100), 40)
  t.is(Calculator.dailyPercentChangeFromHigh(20, 100), 80)
})
