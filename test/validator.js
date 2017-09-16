const test = require('ava')
const Validator = require('./../lib/validator')

test('Is lowest should return true when the numbers are the same', t => {
  t.is(Validator.isLowest(2, 1), false)
  t.is(Validator.isLowest(2, 2), true)
})
