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
// import { PuppetPadplus } from 'wechaty-puppet-padplus'
import config from './config/index'
import { generate } from 'qrcode-terminal'
import schedule from 'node-schedule'
import FilterManager from './filter/filter-manager'
import CommandFilter from './filter/command-filter'
import NewYearFilter from './filter/new-year-filter'

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
  FilterManager.getInstance().filterMessage(message)
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

  // puppet: new PuppetPadplus({
  //   token: config.puppet_token
  // })
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

  // 个人定时任务
  executeSelfTask()

  // 查找群组
  config.GROUP_LIST.forEach(async item => {
    // 房源
    schedule.scheduleJob(config.HOUSE_JOB, async () => {
      const qun = await bot.Room.find(item)
      qun?.say("#house")
    })
  })

  // 消息过滤器
  FilterManager.getInstance().setFilter(new CommandFilter())
  FilterManager.getInstance().setFilter(new NewYearFilter())
}

function executeSelfTask() {
  const rule = new schedule.RecurrenceRule()
  rule.hour = [7, 23]
  rule.minute = 0
  rule.second = 0
  schedule.scheduleJob(rule, async () => {
    const qun = await bot.Room.find(config.GROUP_LIST[0])
    qun?.say("#weather")
  })
}