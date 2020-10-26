/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
import {
  Contact,
  Message,
  ScanStatus,
  Wechaty,
  log,
} from 'wechaty'
import config from './config/index'
import { generate } from 'qrcode-terminal'
import MessageHandler from './message-handler'
import schedule from 'node-schedule'

// You can safely ignore the next line because it is using for CodeSandbox
require('./.code-sandbox.js')

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    generate(qrcode, { small: true })  // show qrcode on console

    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin(user: Contact) {
  log.info('StarterBot', '%s login', user)
  setTimeout(main, 10000)
}

function onLogout(user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage(message: Message) {
  // 烦躁特殊处理
  if (!message.text().startsWith("#") && message.text() !== "烦躁") return
  MessageHandler.getInstance().handleMessage(message)
}

const bot = new Wechaty({
  name: 'baobao-bot',
  /**
   * Specify a `puppet` for a specific protocol (Web/Pad/Mac/Windows, etc).
   *
   * You can use the following providers:
   *  - wechaty-puppet-hostie
   *  - wechaty-puppet-puppeteer
   *  - wechaty-puppet-padplus
   *  - etc.
   *
   * Learn more about Wechaty Puppet Providers at:
   *  https://github.com/wechaty/wechaty-puppet/wiki/Directory
   */

  // puppet: 'wechaty-puppet-hostie',

})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(async e => {
    log.error('StarterBot', e)
  })

// 登录成功之后的事情
function main() {
  // const baobao = await bot.Contact.find({ alias: config.ALIAS })
  // log.infoStarterBot `${baobao?.id}-${baobao?.name()}`)
  // 查找群组
  config.GROUP_LIST.forEach(async item => {
    // 定时任务
    const rule = new schedule.RecurrenceRule()
    rule.hour = [7, 23]
    rule.minute = 0
    rule.second = 0
    schedule.scheduleJob(rule, async () => {
      const qun = await bot.Room.find({ topic: item.ID })
      qun?.say("#weather")
    })

    // 房源
    schedule.scheduleJob(config.HOUSE_JOB, async () => {
      const qun = await bot.Room.find({ topic: item.ID })
      qun?.say("#house")
    })

    // 定时ding一下
    schedule.scheduleJob(config.HOUSE_JOB, async () => {
      const qun = await bot.Room.find({ topic: "小号群" })
      qun?.say("#ding")
    })
  })
}
