import axios from 'axios'
import * as cheerio from 'cheerio'
import ICommand from './command'
import { Message } from 'wechaty'

/**
* 搜剧
*/
export default class TVCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    const tv = text.split(' ')[1]

    const result = await new TVSpider().spider(tv)
    console.log(result);

    // if (message.to() && message.self()) {
    //   await message.to()?.say(result)
    // } else {
    //   await message.say(result)
    // }
  }
}

class TVSpider {

  async spider(tv: string) {
    const host = 'https://www.dandanzan.cc'
    const searchUrl = `${host}/so/${tv}-${tv}--onclick.html`
    const { data } = await axios.get(encodeURI(searchUrl))
    const $ = cheerio.load(data)
    const movieUl = $('.lists-content ul')
    const movieFirst = movieUl.children().first()
    const aMovie = movieFirst.find('a')
    const url = `${host}${aMovie.attr('href')}`

    this.deatil(url)

    return data
  }

  async deatil(url: string) {
    const { data } = await axios.get(encodeURI(url))
    const response = cheerio.load(data)
    console.log("########444444444444444444#########", response.html()) 
  }

}