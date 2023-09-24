import {
  // Contact,
  Message,
  log
} from 'wechaty'
import type ICommand from '../../command/command'
import WeatherCommand from '../../command/weather'
import OneCommand from '../../command/one'
import RemindCommand from '../../command/remind'
import HouseCommand from '../../command/house'
import ChpCommand from '../../command/caihongpi'
import DjtCommand from '../../command/dujitang'
import GarbageCommand from '../../command/garbage'
import FireworksCommand from '../../command/fireworks'
import BomeCommand from '../../command/bome'
import FireworkMixCommand from '../../command/fireworks-mix'
import HHSHCommand from '../../command/hhsh'
import LimitFriendCommand from '../../command/limit-friend'
import TaobaoCommand from '../../command/taobao'
import HiCommand from '../../command/hi'
import AiCommand from '../../command/ai'

export default class MessageHandler {
  private static instance: MessageHandler
  map: Map<string, ICommand>

  private constructor() {
    this.map = new Map()
    this.setMainCommand()
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MessageHandler()
    }
    return this.instance
  }

  public async handleMessage(message: Message) {
    log.info('MessageHandler', message.toString())
    log.info('MessageHandler', '--------------------------------------------------------------------')
    log.info('MessageHandler', message.type())
    log.info('MessageHandler', message.talker())
    log.info('MessageHandler', message.room())
    log.info('MessageHandler', message.text())
    log.info('MessageHandler', message.listener())
    log.info('MessageHandler', '--------------------------------------------------------------------')

    const text = message.text().split(" ")[0] || ''
    const command = this.map.get(text)
    command?.execute(message)
  }

  private setMainCommand() {
    this.setFireCommand()
    this.setLifeCommand()
    this.setHiCommand()
  }

  private setLifeCommand() {
    this.map.set("#weather", new WeatherCommand())
    this.map.set("#house", new HouseCommand())
    this.map.set("#垃圾", new GarbageCommand())
    this.map.set("#one", new OneCommand())
    this.map.set("#买家秀", new TaobaoCommand())

    // 提醒功能
    const remindCommand = new RemindCommand()
    this.map.set("#remind", remindCommand)
    this.map.set("#提醒", remindCommand)
  }

  private setFireCommand() {
    const fireCommand = new FireworksCommand()
    this.map.set("#烟花", fireCommand)
    this.map.set("平安喜乐呀", fireCommand)
    this.map.set("#炸弹", new BomeCommand())
    this.map.set("#都是炮", new FireworkMixCommand())
  }

  private setHiCommand() {
    const hiCommand = new HiCommand()
    this.map.set("嗨", hiCommand)
    this.map.set("#hhsh", new HHSHCommand())
    this.map.set("#朋友", new LimitFriendCommand())
    this.map.set("#dujitang", new DjtCommand())
    this.map.set("#ai", new AiCommand())

    // 彩虹屁
    const chpCommand = new ChpCommand()
    this.map.set("#caihongpi", chpCommand)
    this.map.set("烦", chpCommand)
    this.map.set("烦躁", chpCommand)
  }

}
