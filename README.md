# Knive Catcher Bot

## General info

**Installation:**

`npm install`

**Requirements:**
* node >= 8
* mongodb

**Commands:**

* `npm start` - running the app
* `npm test` - testing the app

## Front-end preview

### Order History

No | Ticker | P/L | P/L% | BuyPrice | BuySize | BuyValue | SellPrice | SellSize | SellValue | Created | Finished
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
1 | BTC_ETH | 0.0001 | 1% | 0.08 | 12 | 0.96 | 234 | 0.084 | 12 | 12:23:34 24.06.1986 | 12:23:34 24.05.1987
2 | BTC_ETC | 0.0001 | 1% | 0.08 | 12 | 0.96 | 234 | 0.084 | 12 | 12:23:34 24.06.1986 | 12:23:34 24.05.1987
3 | BTC_XMR | 0.0001 | 1% | 0.08 | 12 | 0.96 | 234 | 0.084 | 12 | 12:23:34 24.06.1986 | 12:23:34 24.05.1987

### Summary

* Duration: 5 weeks
* Entries: 23
* Successes: 20
* Losses: 3
* Total P/L: 234 BTC (+40%)

## TODO

- [ ] idicate the progess of current backtesting
- [ ] API for front-end (list of orders)
- [ ] move order creation logic outside the strategy

## Thoughts

* should I disallow to entry with the same entry price?

Entered: BTC_XRP at 0.000098, capital left: 0.1311624542206427
Entered: BTC_XRP at 0.000098, capital left: 0.08744163614709513
Entered: BTC_XRP at 0.000098, capital left: 0.05829442409806342
Entered: BTC_XRP at 0.000098, capital left: 0.03886294939870895
Entered: BTC_XRP at 0.000098, capital left: 0.02590863293247263

* should I store backtest results somewhere?
* should I move strategy variables to node env params?
