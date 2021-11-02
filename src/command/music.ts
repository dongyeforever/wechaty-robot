// import axios from 'axios'
import type ICommand from './command'
import type { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'

/**
* 歌曲
*/
export default class MusicCommand implements ICommand {

  async execute(message: Message) {
    WechatHelper.sayMessage("", message)
  }
}