import axios from 'axios'
import * as cheerio from 'cheerio'
import ICommand from './command'
import { Message, } from 'wechaty'
import got from 'got'
import WechatHelper from '../manager/wechat-helper'

/**
* 链家、我爱我家新房源查询
*/
export default class HouseCommand implements ICommand {

  async execute(message: Message) {
    const lianjia = await new LianHouse().spider()

    if (lianjia.length !== 0) await WechatHelper.sayMessage(lianjia, message)

    const _5i5j = await new I5House().spider()
    if (_5i5j.length !== 0) await WechatHelper.sayMessage(_5i5j, message)

    if (lianjia.length === 0 && _5i5j.length === 0) await WechatHelper.sayMessage("链家和我爱我家今天未更新房源", message)
  }
}

class LianHouse {
  // 链家
  url = `https://bj.lianjia.com/ershoufang/tiantongyuan1/co32l2l3a2a3a4a5p3p4p5/`
  url2 = `https://bj.lianjia.com/ershoufang/co32a2a3a4p3p4p5rs%E4%BA%9A%E8%BF%90%E6%9D%91/`

  async spider() {
    let listContent = await this.realSpider(this.url)
    listContent += await this.realSpider(this.url2)
    return listContent
  }

  private async realSpider(url: string) {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)

    let listContent = ''
    $('.sellListContent li').each(function (_, elem) {
      const target = $(elem).find(".info")
      const publicDate = target.find(".followInfo").text().split("/")[1].trim()
      const date = publicDate.split("发布")[0]
      if (date == "刚刚" /* || date == "1天以前"*/) {
        const title = target.find(".title a")
        const desc = target.find(".address .houseInfo").text()
        const price = target.find(".priceInfo .totalPrice span").text()
        listContent += `${title.text()}(${date})\n\n${desc}\n${title.attr("href")}`
        listContent += `\n------------------ ${price}万 ------------------\n\n`
      }
    })
    return listContent
  }
}

class I5House {
  // 我爱我家
  url = `https://bj.5i5j.com/ershoufang/tiantongyuan/a2a3a4a5a6d1o8p3p4p5/?searchtype=2`
  url2 = `https://bj.5i5j.com/ershoufang/yayuncun/o8p3p4p5q1q4/?searchtype=2`

  async spider() {
    try {
      let listContent = await this.realSpider(this.url)
      listContent += await this.realSpider(this.url2)
      return listContent
    } catch (error) {
      return ''
    }
  }

  private async realSpider(url: string) {
    const response = await got(url)
    const $ = cheerio.load(response.body)
    let listContent = ''

    $('.pList li').each(function (_, elem) {
      const target = $(elem).find(".listCon")
      const publicDate = target.find(".listX p").eq(2).text().split("·")[2].trim()
      const date = publicDate.split("发布")[0]
      if (date == "今天" /* || date == "昨天"*/) {
        const title = target.find(".listTit a")
        const desc = target.find(".listX p").eq(0).text()
        const price = target.find(".jia strong").text()
        const imgUrl = $(elem).find(".listImg a").attr("href")
        const url = `https://bj.5i5j.com${imgUrl}`

        listContent += `${title.text()}(${date})\n\n${desc}\n${url}`
        listContent += `\n------------------ ${price}万 ------------------\n\n`
      }
    })
    return listContent
  }
}