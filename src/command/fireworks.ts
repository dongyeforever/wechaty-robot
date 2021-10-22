import BaseBomeCommand from './base-bome'
import { Message, } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'

/**
* 烟花
*/
export default class FireworksCommand extends BaseBomeCommand {

  sendMessage(message: Message) {
    WechatHelper.sayMessage("[烟花]", message)
  }

}