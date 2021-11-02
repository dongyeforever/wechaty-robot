import type ICommand from './command'
import type { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'
import axios from 'axios'
import * as cheerio from 'cheerio'
import MovieDetail from "../manager/movie/movie-detail"

interface MovieInfo {
  url: string
  postData: Object
}

/**
* 电影
*/
export default class MovieCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    const arr = text.split(' ')
    const movieTitle = arr[1]
    const movieUrl = arr[2]
    console.log(movieTitle, movieUrl)
    if (!movieTitle) {
      WechatHelper.sayMessage("格式为: #电影 名字", message)
      return
    }
    if (movieUrl && this.isUrl(movieUrl)) {
      // 查询电影结果
      this.getDetail(movieUrl, message)
    } else {
      // 搜索
      const result = await this.search(movieTitle)
      const text = result.length > 1 ? result.join('\n#电影 ') : result[0] + ''
      WechatHelper.sayMessage(text, message)
    }
  }

  async getDetail(movieUrl: string, message: Message) {
    const movie = new MovieDetail(`https://www.dandanzan.cc/${movieUrl}.html`)
    await movie.getMovieInfo(async (info: MovieInfo) => {
      // 请求获取 m3u8 地址
      const { data } = await axios.post(info.url, info.postData)
      WechatHelper.sayMessage(`http://www.m3u8player.top/?play=${data}`, message)
    })
  }

  async search(movieTitle: string) {
    const title = encodeURI(movieTitle)
    const { data } = await axios.get(`https://www.dandanzan.cc/so/${title}-${title}--.html`)
    const $ = cheerio.load(data)

    const movies = []
    $('.lists-content ul').find('li').map((i, elem) => {
      if (i < 3) {
        const children = $(elem).find('h2').eq(0)
        const text = children.text()
        let url = children.find('a').eq(0).attr('href')
        if (url) {
          url = url.replace('.html', '').replace('/', '')
          movies.push(`${text} ${url}`)
        }
      }
    }).get()

    if (movies.length === 0) {
      movies.push(`未查询到 ${movieTitle}`)
    } else {
      movies.unshift(`查询到${movies.length}条相关记录：`)
    }
    return movies
  }

  isUrl(url: string) {
    const exp = /\w+\/\w+/
    const reg = new RegExp(exp)
    return reg.test(url)
  }

}