import axios from 'axios'
import ICommand from './command'
import { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'

/**
* 嗨
*/
export default class HiCommand implements ICommand {

  async execute(message: Message) {
    WechatHelper.sayMessage(`嗨 小${message.talker().name()}，在呢`, message)
    if (Math.random() > 0.5) {
      const text = await new CaiHongPi().spider()
      WechatHelper.sayMessage(text, message)
    }
  }
}

class CaiHongPi {
  // 彩虹屁
  // url = `https://lengzhishi.net/caihongpi/api.php`
  url = `https://chp.shadiao.app/api.php`

  async spider() {
    const { data } = await axios.get(this.url)
    return data
  }

}