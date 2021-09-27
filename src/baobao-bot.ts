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
import RemindStore from './util/remind-store'
import Task from './util/task'
import Schedule from './util/schedule'
import LimitFriendFilter from './filter/limit-friend-filter'
import UserManager from './manager/user-manager'
import BinanceManager from './manager/binance-manager'
import WechatHelper from './manager/wechat-helper'
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
  // 定时任务
  executeSelfTask()
  executeFamilyTask()

  // 消息过滤器
  FilterManager.getInstance().setFilter(new CommandFilter())
  FilterManager.getInstance().setFilter(new LimitFriendFilter())
  // 初始化提醒消息
  initRemindTask()
  // 用户管理
  UserManager.init(bot)
}

function executeSelfTask() {
  // 天气
  const rule = new schedule.RecurrenceRule()
  rule.hour = [7, 23]
  rule.minute = 0
  rule.second = 0
  schedule.scheduleJob(rule, async () => {
    const qun = await bot.Room.find(config.GROUP_LIST[0])
    qun?.say("#weather")
  })

  // binance 价格查询
  const binance = new BinanceManager()
  binance.start()

  // 查找群组
  // config.GROUP_LIST.forEach(async item => {
  //   // 房源
  //   schedule.scheduleJob(config.HOUSE_JOB, async () => {
  //     const qun = await bot.Room.find(item)
  //     qun?.say("#house")
  //   })
  // })
}

// 房源
function executeFamilyTask() {
  // 已买第一套房，临时关闭
  // schedule.scheduleJob(config.HOUSE_JOB, async () => {
  //   const qunList = await bot.Room.findAll()
  //   qunList.forEach(item => {
  //     item.topic().then(topic => {
  //       if (topic.indexOf(config.FAMILY_GROUP) !== -1) { item.say("#house") }
  //     })
  //   })
  // })
}

// 初始化提醒
function initRemindTask(this: any) {
  const data = RemindStore.getInstance().getAll()
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const item = data[key]
      let msgJson = JSON.parse(item)
      const task = new Task(key, async () => {
        sendMessage(msgJson)
        RemindStore.getInstance().remove(key)
      })
      Schedule.getInstance().add(task)
    }
  }
}

async function sendMessage(msgJson: any) {
  const payload = msgJson.payload
  const roomId = payload.roomId
  const text: string = payload.text
  const content = `[爱心]提醒 \n• ${text.substring(4)}`
  if (roomId) {
    // 群消息
    let room = await bot.Room.find({ id: roomId })
    room?.say(content)
  } else {
    let targetId = (payload.toId === bot.userSelf().id) ? payload.fromId : payload.toId
    let contact: Contact | null = await bot.Contact.find({ id: targetId })
    contact?.say(content)
  }
  WechatHelper.pushMessage(content)
}
