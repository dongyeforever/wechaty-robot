import schedule from 'node-schedule'
import axios from 'axios'
import WechatHelper from './wechat-helper'

const API_KEY = 'MlKoeebWBron56ZfRqU2AMODIzUi1juAT9ocqD29xbk2zIprhB3n0otfk1MNaTWe'
const host = 'https://api.lovek.vip/bitcoin'
const PERCENT_DAY = 5 // 24h 涨幅
const PERCENT_MINUTE = 0.35 // 每分钟涨幅
const PERCENT_15MINUTE = 0.68 // 每 15 分钟涨幅
const header = {
    "X-MBX-APIKEY": API_KEY
}
const apiToday = `${host}/ticker/today`
const apiPrice = `${host}/ticker/price`
const symbols = ["BTCUSDT", "ETHUSDT"]
const otherSymbols = ["DOGEUSDT", "AAVEUSDT", "COMPUSDT", "SUSHIUSDT", "AVAXUSDT", "SOLUSDT", "FTMUSDT"]
// 推送时间类型
enum PUSH_TYPE {
    MINUTE = '1分钟',
    QUARTER_HOUR = '15分钟',
    TODAY = '今天'
}
// 英文字母
// const alphabeta = 'a̷b̷c̷d̷e̷f̷g̷h̷i̷j̷k̷l̷m̷n̷o̷p̷̷q̷r̷s̷t̷u̷vw̷x̷y̷z̷'
const alphabeta = 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤvⓦⓧⓨⓩ'

interface PushMessage {
    price?: number
    symbol: string
    percent: number
    pushType: PUSH_TYPE
}

export default class BinanceManager {
    lastSymbols = {
        BTCUSDT: { lastPrice: -1, last15Price: -1 },
        ETHUSDT: { lastPrice: -1, last15Price: -1 },
    }

    constructor() {
    }

    public start() {
        // 每小时检查一次 24h 价格变动
        // schedule.scheduleJob('0 0 * * * *', () => {
        //     for (const item of symbols) {
        //         this.requestToday(item)
        //     }
        // })
        // 检查最近 1 分钟 价格变动
        schedule.scheduleJob('0 * * * * *', () => {
            for (const item of symbols) {
                this.requestMinute(item)
            }
        })
    }

    private async requestMinute(symbol: string) {
        const { data } = await axios.get(`${apiPrice}?symbol=${symbol}`, { headers: header })
        const price = parseFloat(data.price)
        // @ts-ignore7
        const lastSymbol = this.lastSymbols[symbol]
        if (lastSymbol.lastPrice !== -1) {
            const percent = (price - lastSymbol.lastPrice) / lastSymbol.lastPrice * 100
            if (Math.abs(percent) >= PERCENT_MINUTE) {
                this.pushMessage({ price, symbol, percent, pushType: PUSH_TYPE.MINUTE })
            }
        }
        lastSymbol.lastPrice = price

        const date = new Date()
        if (date.getMinutes() % 15 === 0) {
            // 每 15 分钟检查一次
            this.check15Minute(lastSymbol, price, symbol)
        } else if (date.getMinutes() % 0 === 0) {
            // 每小时检查一次小币种涨幅
            this.checkOtherSymbol()
        }
    }

    private check15Minute(lastSymbol: any, price: number, symbol: string) {
        if (lastSymbol.last15Price !== -1) {
            const percent = (price - lastSymbol.last15Price) / lastSymbol.last15Price * 100
            if (Math.abs(percent) >= PERCENT_15MINUTE) {
                this.pushMessage({ symbol, percent, price, pushType: PUSH_TYPE.QUARTER_HOUR })
            }
        }
        lastSymbol.last15Price = price
        // 每15分钟检查一次今日价格波动幅度
        this.checkSymbol(symbol)
    }

    private async checkSymbol(symbol: string) {
        const { data } = await axios.get(`${apiToday}?symbol=${symbol}`, { headers: header })
        const open = data.open
        const close = data.close
        const percent = (close - open) / open * 100
        // 为今日涨幅
        if (Math.abs(percent) >= PERCENT_DAY) {
            this.pushMessage({ symbol, percent, pushType: PUSH_TYPE.TODAY })
        }
    }

    // 检查小币
    private checkOtherSymbol() {
        for (const symbol of otherSymbols) {
            this.checkSymbol(symbol)
        }
    }

    // 发送提醒
    private async pushMessage(pushMessage: PushMessage) {
        const message = Object.assign({}, pushMessage)
        const ab = Array.from(alphabeta)
        let symbol = message.symbol.replace('USDT', '').toLowerCase()
        for (const chars of symbol) {
            symbol = symbol.replace(chars, ab[chars.charCodeAt(0) - 97])
        }
        const percent = `${message.percent > 0 ? '⁺' : '⁻'}${Math.abs(message.percent).toFixed(2)}%`
        const price = message.price ? `#${Math.round(message.price)}` : ''
        let msg = `${symbol} ${message.pushType} ${percent} ${price}`
        WechatHelper.pushMessage(msg)
    }
}