import axios from 'axios'
import type ICommand from './command'
import { FileBox }  from 'file-box'
import type { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'

/**
* 买家秀
*/
export default class TaobaoCommand implements ICommand {

  async execute(message: Message) {
    const result = await new Taobao().spider()
    const fileBox = FileBox.fromStream(result, `tb${Date.now()}.jpg`)
    // const fileBox = FileBox.fromBase64(result, `tb${Date.now()}.png`)
    WechatHelper.sendFile(fileBox, message)
  }
}

class Taobao {
  // 买家秀 api
  url = `https://api.vvhan.com/api/tao`

  async spider() {
    const { data } = await axios.get(this.url, {
      responseType: 'stream'
    })
    return data
  }

  // async spider() {
  //   const { data } = await axios.get(this.url, {
  //     responseType: 'arraybuffer'
  //   })
  //   return Buffer.from(data, 'binary').toString('base64')
  // }
  
}