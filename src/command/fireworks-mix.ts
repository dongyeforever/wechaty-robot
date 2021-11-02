import type { Message, } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'
import BaseBomeCommand from './base-bome'

/**
* 炸弹
*/
export default class FireworkMixCommand extends BaseBomeCommand {

  sendMessage(message: Message): void {
    const number = Math.floor(Math.random() * 10)
    if (number < 4) {
      WechatHelper.sayMessage("[烟花]", message)
    } else if (number < 7) {
      WechatHelper.sayMessage("[庆祝]", message)
    } else {
      WechatHelper.sayMessage("[爆竹]", message)
    }
  }
  
}