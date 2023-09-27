import axios from 'axios'
import type ICommand from './command'
import type { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'
import StringUtil from '../util/string-util'

/**
* 垃圾分类
*/
export default class GarbageCommand implements ICommand {

  async execute(message: Message) {
    const garbage = StringUtil.getMessageContent(message.text())
    const result = await new Garbage().spider(garbage)
    WechatHelper.sayMessage(result, message)
  }
}

class Garbage {
  // 垃圾分类 api
  url = `http://h5.ninghai.gov.cn/ljfl/index.php?m=Home&c=Index&a=check`

  async spider(garbage: string) {
    const config = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
    const { data } = await axios.post(this.url, StringUtil.stringify({ keywords: garbage }), config)
    if (data.success === 1) return `${garbage}\n• ${data.cat_title}`
    else return `${garbage}\n• 未找到`
  }

}