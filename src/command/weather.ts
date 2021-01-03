import ICommand from './command'
import { Message, } from 'wechaty'
import axios from 'axios'
import * as cheerio from 'cheerio'

/**
* 天气查询
*/
export default class WeatherCommand implements ICommand {

  async execute(message: Message) {
    const text = await new Weather().getWeather()
    if (message.to() && message.self()) {
      await message.to()?.say(text)
    } else {
      await message.say(text)
    }
  }
}

 class Weather {
  // 墨迹天气地址
  url: string = `https://tianqi.moji.com/today/china`

  constructor(public province: string = 'beijing', public city: string = 'beijing') {
    this.url = `${this.url}/${province}/${city}`
  }

  async getWeather() {
    const { data } = await axios.get(this.url)
    const $ = cheerio.load(data)
    const target = $('.wea_list li.active')
    const week = target
      .find('.week')
      .eq(0)
      .text()
    const weather = target
      .find('.wea')
      .eq(0)
      .text()

    const lowTemperature = parseInt(target.find('.tree strong').text(), 10)
    const highTemperature = parseInt(target.find('.tree b').text(), 10)
    const temperature = `${lowTemperature}℃ ~ ${highTemperature}℃`
    const text = $('.detail_ware_title span').text()

    // 提醒
    let remind: string = ''
    // 和昨天比温差大
    const yesterday = $('.wea_list li').eq(0)
    const yesterdayLow = parseInt(yesterday.find('.tree strong').text(), 10)
    const yesterdayHigh = parseInt(yesterday.find('.tree b').text(), 10)
    if (Math.max(Math.abs(highTemperature - yesterdayHigh), Math.abs(lowTemperature - yesterdayLow)) >= 8) {
      remind += `注意❣️❣️ ${highTemperature > yesterdayHigh ? '升温' : '降温'} ${Math.max(Math.abs(highTemperature - yesterdayHigh), Math.abs(lowTemperature - yesterdayLow))}℃\n`
    }
    // 今天温差大提醒和雾霾
    if (highTemperature - lowTemperature >= 10) {
      remind = '\n注意❣️❣️ 今天昼夜温差大于10℃'
    }
    // 明天是否有雨雪
    const tomorrow = $('.wea_list li').eq(2)
    const tomorrowWeek = tomorrow.find('.week').eq(0).text()
    const tomorroWeather = tomorrow.find('.wea').eq(0).text()
    const tomorrowLow = parseInt(tomorrow.find('.tree strong').text(), 10)
    const tomorrowHigh = parseInt(tomorrow.find('.tree b').text(), 10)
    const tomorrowTemperature = `${tomorrowLow}℃ ~ ${tomorrowHigh}℃`

    if (tomorroWeather.indexOf('雨') !== -1 && tomorroWeather.indexOf('雪') !== -1) {
      remind += '\n注意❣️❣️ 明天🌧 🌨'
    } else if (tomorroWeather.indexOf('雨') !== -1) {
      remind += '\n注意❣️❣️ 明天🌧 🌨'
    } else if (tomorroWeather.indexOf('雪') !== -1) {
      remind += '\n注意❣️❣️ 明天🌨'
    }
    return `今天 ${week} ${weather} ${temperature} \n明天 ${tomorrowWeek} ${tomorroWeather} ${tomorrowTemperature} \n\n${text}\n${remind}`
  }

}