import axios from 'axios'
import ICommand from './command'
import { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'

/**
* 能不能好好说话
*/
export default class NBNHHSHCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    const nbnhhsh = text.split(' ')[1]
    const patten = /^[A-Za-z]+$/
    if (nbnhhsh.match(patten) == null) {
      WechatHelper.sayMessage(`格式【#hhsh 缩写字母】哦`, message)
      return
    }

    const host = 'https://lab.magiconch.com/api/nbnhhsh/guess'
    const { data } = await axios.post(host, {
      text: nbnhhsh
    })
    const trans = data[0].trans || []
    WechatHelper.sayMessage(`【${nbnhhsh}】\n${trans.join("\n")}`, message)
  }
}