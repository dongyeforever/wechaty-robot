import BaseBomeCommand from './base-bome'
import { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'

/**
* 炸弹
*/
export default class BomeCommand extends BaseBomeCommand {
  
  sendMessage(message: Message) {
    WechatHelper.sayMessage("[炸弹]", message)
  }
  
}