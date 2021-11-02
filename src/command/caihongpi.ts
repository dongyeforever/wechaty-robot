import axios from 'axios'
import type ICommand from './command'
import type { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'

/**
* 彩虹屁，哈哈哈
*/
export default class ChpCommand implements ICommand {

  async execute(message: Message) {
    const text = await new CaiHongPi().spider()
    WechatHelper.sayMessage(text, message)
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