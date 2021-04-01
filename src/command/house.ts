import axios from 'axios'
import * as cheerio from 'cheerio'
import ICommand from './command'
import { Message, } from 'wechaty'
import got from 'got'

/**
* 链家、我爱我家新房源查询
*/
export default class HouseCommand implements ICommand {

  async execute(message: Message) {
    const lianjia = await new LianHouse().spider()

    if (lianjia.length !== 0) await this.sayMessage(message, lianjia)

    const _5i5j = await new I5House().spider()
    if (_5i5j.length !== 0) await this.sayMessage(message, _5i5j)

    if (lianjia.length === 0 && _5i5j.length === 0) await this.sayMessage(message, "链家和我爱我家今天未更新房源")
  }

  async sayMessage(message: Message, text: string) {
    if (message.to() && message.self()) {
      await message.to()?.say(text)
    } else {
      await message.say(text)
    }
  }
}

class LianHouse {
  // 链家
  url = `https://bj.lianjia.com/ershoufang/co32ie2l2l3a2a3a4a5p3p4p5/`

  async spider() {
    const { data } = await axios.get(this.url)
    const $ = cheerio.load(data)

    let listContent = ''
    $('.sellListContent li').each(function (_, elem) {
      const target = $(elem).find(".info")
      const address = target.find(".flood .positionInfo a").text()
      if (address.indexOf("天通") !== -1 && address.indexOf("苑") !== -1) {
        const publicDate = target.find(".followInfo").text().split("/")[1].trim()
        const date = publicDate.split("发布")[0]
        if (date == "刚刚"/* || date == "1天以前"*/) {
          const title = target.find(".title a")
          const desc = target.find(".address .houseInfo").text()
          const price = target.find(".priceInfo .totalPrice span").text()
          listContent += `${title.text()}(${date})\n\n${desc}\n${title.attr("href")}`
          listContent += `\n------------------ ${price}万 ------------------\n\n`
        }
      }
    })

    return listContent
  }

}

class I5House {
  // 我爱我家
  url = `https://bj.5i5j.com/ershoufang/tiantongyuan/a2a3a4a5a6d1o8p3p4p5/?searchtype=2`

  async spider() {
    try {
      const response = await got(this.url);
      const $ = cheerio.load(response.body)
      let listContent = ''

      $('.pList li').each(function (_, elem) {
        const target = $(elem).find(".listCon")
        const address = target.find(".listX p").eq(1).text()

        if (address.indexOf("天通") !== -1 && address.indexOf("苑") !== -1) {
          const publicDate = target.find(".listX p").eq(2).text().split("·")[2].trim()
          const date = publicDate.split("发布")[0]
          if (date == "今天"/* || date == "昨天"*/) {
            const title = target.find(".listTit a")
            const desc = target.find(".listX p").eq(0).text()
            const price = target.find(".jia strong").text()
            const imgUrl = $(elem).find(".listImg a").attr("href")
            const url = `https://bj.5i5j.com${imgUrl}`

            listContent += `${title.text()}(${date})\n\n${desc}\n${url}`
            listContent += `\n------------------ ${price}万 ------------------\n\n`
          }
        }
      })
      return listContent
    } catch (error) {
      return ''
      console.log(error.response.body);
    }


    // const { data } = await axios.get(this.url, {
    //   headers: {
    //     'Accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    //     'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
    //     Cookie: "PHPSESSID=lo4rdvkam5udsmjvrlkk4hmpij; yfx_c_g_u_id_10000001=_ck20102416384016910822376680953; __TD_deviceId=RRO4FE4FF8GJEJ4L; _dx_uzZo5y=97318830cbc8a7fc92814a6451c86f3cb6ef3f1f5514bd4fc5b3898e2faa833093bb33f5; gr_user_id=c942592d-87cd-46fe-9922-83171d99ef0e; smidV2=20201024163841a8a64ec7be5d30f14731eb5c38c1991a00544e394e9a77f20; grwng_uid=0c5e58e7-c1b7-4e0a-b484-e71332a2acfa; ershoufang_cookiekey=%5B%22%257B%2522url%2522%253A%2522%252Fershoufang%252Ftiantongyuan%253Fzn%253D%25E5%25A4%25A9%25E9%2580%259A%25E8%258B%2591%2526searchtype%253D2%2522%252C%2522x%2522%253A%2522116.42716%2522%252C%2522y%2522%253A%252240.0719%2522%252C%2522name%2522%253A%2522%25E5%2595%2586%25E5%259C%2588%25E5%25A4%25A9%25E9%2580%259A%25E8%258B%2591%255Cn1630%25E5%25A5%2597%2522%252C%2522total%2522%253Anull%257D%22%5D; _Jo0OQK=E0213D42DE0092E46D8DA8F5F628E861D3F34363544AC8DFBE21885BD36DB4E681090DB74F3EFA40B023B53429AE44B32A3D873C53266C66461AAB0E446D805316B26107A0B847CA533E349A4771735E278E349A4771735E27887B209CE8C31F2920673A260E3C20D0FGJ1Z1XA==; domain=bj; yfx_f_l_v_t_10000001=f_t_1603528720684__r_t_1603680639921__v_t_1603680639921__r_c_2; 8fcfcf2bd7c58141_gr_session_id=c4b2df41-ab96-417c-b7ed-6c31a0832a9c; 8fcfcf2bd7c58141_gr_session_id_c4b2df41-ab96-417c-b7ed-6c31a0832a9c=true"
    //   }
    // })

    // console.log("--------------",this.url, data);

  }

  async sayMessage(message: Message, text: string) {
    if (message.to() && message.self()) {
      await message.to()?.say(text)
    } else {
      await message.say(text)
    }
  }
}