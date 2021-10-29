import {
  // Contact,
  Message,
  log
} from 'wechaty'
import ICommand from '../../command/command'
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
import TVCommand from '../../command/tv'
import NBNHHSHCommand from '../../command/nbnhhsh'
import LimitFriendCommand from '../../command/limit-friend'
import MovieCommand from '../../command/movie'
import TaobaoCommand from '../../command/taobao'
// import FortuneGodCommand from './command/fortunegod'

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
    this.map.set("烦", chpCommand)
    this.map.set("烦躁", chpCommand)
    this.map.set("#dujitang", new DjtCommand())
    this.map.set("#垃圾", new GarbageCommand())
    this.map.set("#烟花", new FireworksCommand())
    this.map.set("#炸弹", new BomeCommand())
    this.map.set("#都是炮", new FireworkMixCommand())
    this.map.set("#tv", new TVCommand())
    this.map.set("#hhsh", new NBNHHSHCommand())
    this.map.set("#朋友", new LimitFriendCommand())
    this.map.set("#电影", new MovieCommand())
    this.map.set("#淘宝", new TaobaoCommand())
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
    log.info('MessageHandler', message.to())
    log.info('MessageHandler', '--------------------------------------------------------------------')

    const text = message.text().split(" ")[0]
    const command = this.map.get(text)
    command?.execute(message)
  }

}
