import {
  // Contact,
  Message,
  log,
} from 'wechaty'
import ICommand from './command/command'
import WeatherCommand from './command/weather'
import OneCommand from './command/one'
import RemindCommand from './command/remind'
import HouseCommand from './command/house'

export default class MessageHandler {
  private static instance: MessageHandler
  map: Map<string, ICommand>

  private constructor() {
    this.map = new Map()
    this.map.set("#remind", new RemindCommand())
    this.map.set("#提醒", new RemindCommand())
    this.map.set("#weather", new WeatherCommand())
    this.map.set("#one", new OneCommand())
    this.map.set("#house", new HouseCommand())
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
