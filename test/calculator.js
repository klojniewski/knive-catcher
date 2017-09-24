const test = require('ava')
const Calc = require('./../lib/calculator')

test('dailyPercentChange should calculate percentage value', t => {
  t.is(Calc.dailyPercentChangeFromHigh(50, 100), 50)
  t.is(Calc.dailyPercentChangeFromHigh(90, 100), 10)
  t.is(Calc.dailyPercentChangeFromHigh(100, 100), 0)
  t.is(Calc.dailyPercentChangeFromHigh(80, 100), 20)
  t.is(Calc.dailyPercentChangeFromHigh(60, 100), 40)
  t.is(Calc.dailyPercentChangeFromHigh(20, 100), 80)
})

test('getPercentageIncreasedValue should add percentages', t => {
  t.is(Calc.getPercentageIncreasedValue(1, 10), 1.1)
  t.is(Calc.getPercentageIncreasedValue(1, 20), 1.2)
  t.is(Calc.getPercentageIncreasedValue(100, 5), 105)
  t.is(Calc.getPercentageIncreasedValue(100, 0.5), 100.5)
})

test('getPercentageIncreasedValue should add percentages', t => {
  t.is(Calc.getPositionSize(1200, 1, 3), 400)
  t.is(Calc.getPositionSize(100000, 1, 8), 12500)
  t.is(Calc.getPositionSize(18000, 2, 3), 12000)
})

test('getTakerCommisionValue should return commision amount', t => {
  t.is(Calc.getTakerCommisionValue(1000, 0.25), 2.5)
})

test('getBuySize', t => {
  t.is(Calc.getBuySize(2, 1), 2)
  t.is(Calc.getBuySize(4, 2), 2)
  t.is(Calc.getBuySize(0.000330990600161618, 0.11068322), 0.0029904316134064224)
})

test('getSellSize', t => {
  t.is(Calc.getSellSize(2, 1), 1)
  t.is(Calc.getSellSize(4, 2), 2)
  t.is(Calc.getSellSize(0.000330990600161618, 0.11068322), -0.11035222939983838)
})

test('getSellValue', t => {
  t.is(Calc.getSellValue(2, 1), 2)
  t.is(Calc.getSellValue(2, 2), 4)
})

test('getEstimatedProfit', t => {
  t.is(Calc.getEstimatedProfit(10, 8, 1), 1)
  t.is(Calc.getEstimatedProfit(20, 10, 2), 8)
})
