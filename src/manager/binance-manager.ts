import schedule from 'node-schedule'
import axios from 'axios'
// import WechatHelper from './wechat-helper'

const API_KEY = 'MlKoeebWBron56ZfRqU2AMODIzUi1juAT9ocqD29xbk2zIprhB3n0otfk1MNaTWe'
const host = 'https://api.lovek.vip/bitcoin'
const PERCENT_DAY = 3 // 24h 涨幅
const PERCENT_MINUTE = 0.25 // 每分钟涨幅
const PERCENT_15MINUTE = 0.35 // 每 15 分钟涨幅
const header = {
    "X-MBX-APIKEY": API_KEY
}
const api24h = `${host}/ticker/24hr`
const apiPrice = `${host}/ticker/price`
const symbols = ["BTCUSDT", "ETHUSDT"]

export default class BinanceManager {
    lastSymbols = {
        BTCUSDT: { lastPrice: -1, last15Price: -1 },
        ETHUSDT: { lastPrice: -1, last15Price: -1 },
    }

    constructor() {
    }

    public start() {
        // 每小时检查一次 24h 价格变动
        schedule.scheduleJob('0 0 * * * *', () => {
            for (const item of symbols) {
                this.request24h(item)
            }
        })
        // 检查最近 1 分钟 价格变动
        schedule.scheduleJob('0 * * * * *', () => {
            for (const item of symbols) {
                this.requestMinute(item)
            }
        })
    }

    private async request24h(symbol: string) {
        const { data } = await axios.get(`${api24h}?symbol=${symbol}`, { headers: header })
        const percent = data.priceChangePercent
        // TODO 替换为今日涨幅
        if (Math.abs(percent) >= PERCENT_DAY) {
            this.pushMessage(`${data.symbol} 24h 涨幅: ${percent.toFixed(2)}`)
        }
    }

    private async requestMinute(symbol: string) {
        const { data } = await axios.get(`${apiPrice}?symbol=${symbol}`, { headers: header })
        const price = parseFloat(data.price)
        // @ts-ignore7
        const lastSymbol = this.lastSymbols[symbol]
        if (lastSymbol.lastPrice !== -1) {
            const percent = (price - lastSymbol.lastPrice) / lastSymbol.lastPrice * 100
            if (Math.abs(percent) >= PERCENT_MINUTE) {
                this.pushMessage(`${symbol} 最近一分钟涨幅: ${percent.toFixed(2)}`)
            }
        }
        lastSymbol.lastPrice = price
        // 每 15 分钟检查一次
        this.check15Minute(lastSymbol, price, symbol)
    }

    private check15Minute(lastSymbol: any, price: number, symbol: string) {
        const date = new Date()
        if (date.getMinutes() === 15) {
            if (lastSymbol.last15Price !== -1) {
                const percent = (price - lastSymbol.last15Price) / lastSymbol.last15Price * 100
                if (Math.abs(percent) >= PERCENT_15MINUTE) {
                    this.pushMessage(`${symbol} 最近 15 分钟涨幅: ${percent.toFixed(2)}`)
                }
            }
        }
    }

    // 发送提醒
    private async pushMessage(msg: string) {
        // WechatHelper.sayMessage(message)
        const { data } = await axios.get(`https://push.bot.qw360.cn/send/25d19400-1f1c-11ec-806f-9354f453c154?msg=${encodeURI(msg)}`)
        if (!data.status) {
            console.log(data)
        }
    }
}