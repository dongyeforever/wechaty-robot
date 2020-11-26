import {
  // Contact,
  Message,
  log
} from 'wechaty'
import ICommand from './command/command'
import WeatherCommand from './command/weather'
import OneCommand from './command/one'
import RemindCommand from './command/remind'
import HouseCommand from './command/house'
import ChpCommand from './command/caihongpi'
import DjtCommand from './command/dujitang'
import GarbageCommand from './command/garbage'

export default class MessageHandler {
  private static instance: MessageHandler
  map: Map<string, ICommand>

  private constructor() {
    this.map = new Map()
    const remindCommand = new RemindCommand()
    const chpCommand = new ChpCommand()
    this.map.set("#remind", remindCommand)
    this.map.set("#提醒", remindCommand)
    this.map.set("#weather", new WeatherCommand())
    this.map.set("#one", new OneCommand())
    this.map.set("#house", new HouseCommand())
    this.map.set("#caihongpi", chpCommand)
    this.map.set("烦躁", chpCommand)
    this.map.set("#dujitang", new DjtCommand())
    this.map.set("#垃圾", new GarbageCommand())
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
    log.info('MessageHandler', message.from())
    log.info('MessageHandler', message.room())
    log.info('MessageHandler', message.text())
    log.info('MessageHandler', '--------------------------------------------------------------------')

    const text = message.text().split(" ")[0]
    const command = this.map.get(text)
    command?.execute(message)
  }

}
