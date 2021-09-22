import axios from 'axios'
import ICommand from './command'
import { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'

/**
* 毒鸡汤
*/
export default class DjtCommand implements ICommand {

  async execute(message: Message) {
    const text = await new DuJiTang().spider()
    WechatHelper.sayMessage(text, message)
  }
}

class DuJiTang {
  // 毒鸡汤
  // url = `https://lengzhishi.net/dujitang/api.php`
  url = `https://du.shadiao.app/api.php`

  async spider() {
    const { data } = await axios.get(this.url)
    return data
  }

}