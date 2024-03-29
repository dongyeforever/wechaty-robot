import axios from 'axios'
import type ICommand from './command'
import type { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'

/**
* 嗨
*/
export default class HiCommand implements ICommand {

  async execute(message: Message) {
    WechatHelper.sayMessage(`嗨 小${message.talker().name()}, 我一直都在呢`, message)
    if (Math.random() > 0.7) {
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