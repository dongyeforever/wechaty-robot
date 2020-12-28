import axios from 'axios'
import * as cheerio from 'cheerio'
import ICommand from './command'
import { Message } from 'wechaty'

/**
* one查询
*/
export default class OneCommand implements ICommand {

  async execute(message: Message) {
    const text = await new One().spider()
    if (message.to() && message.self()) {
      await message.to()?.say(text)
    } else {
      await message.say(text)
    }
  }
}

class One {
  // 每日一句
  url = `http://wufazhuce.com/`

  async spider() {
    const { data } = await axios.get(this.url)
    const $ = cheerio.load(data)
    const target = $('#carousel-one .fp-one-cita a').eq(0)
    return target.text()
  }

}