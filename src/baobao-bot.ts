import { QRCodeTerminal } from 'wechaty-plugin-contrib'
import {
  Contact,
  Message,
  log,
  WechatyBuilder
} from 'wechaty'
import config from './config/index'
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import FilterManager from './filter/filter-manager'
import RemindStore from './util/remind-store'
import Task from './util/task'
import Schedule from './util/schedule'
import CommandFilter from './filter/command-filter'
import HongBaoFilter from './filter/hongbao-filter'
import ExpressFilter from './filter/express-filter'
import LimitFriendFilter from './filter/limit-friend-filter'
import RecallFilter from './filter/recall-filter'
import UserManager from './manager/user-manager'
// import BinanceManager from './manager/binance-manager'
import WechatHelper from './manager/wechat-helper'
import HistoryMessageManager from './manager/history-message'

const bot = WechatyBuilder.build({
  name: 'baobao-bot',
  puppetOptions: {
    uos: true  // 开启uos协议
  },
  puppet: 'wechaty-puppet-wechat',
})

function onLogin(user: Contact) {
  log.info('StarterBot', '%s login', user)
  setTimeout(main, 10000)
}

function onLogout(user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage(message: Message) {
  // 保存消息
  HistoryMessageManager.getInstance().enqueue({ id: message.id, data: message })
  // 处理消息
  FilterManager.getInstance().filterMessage(message)
}

function onError(e: any) {
  console.error(e)
}

bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)
bot.on('error', onError)

bot.use(QRCodeTerminal({
  small: true
}))
bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(console.error)

// 登录成功之后的事情
function main() {
  // 定时任务
  executeSelfTask()
  executeFamilyTask()

  // 消息过滤器
  FilterManager.getInstance().setFilter(new CommandFilter())
  FilterManager.getInstance().setFilter(new HongBaoFilter())
  FilterManager.getInstance().setFilter(new ExpressFilter())
  FilterManager.getInstance().setFilter(new LimitFriendFilter())
  FilterManager.getInstance().setFilter(new RecallFilter())
  // 用户管理
  UserManager.init(bot)
  // 初始化提醒消息
  initRemindTask()
}

function executeSelfTask() {
  // 天气
  const rule = new RecurrenceRule()
  rule.hour = [7, 23]
  rule.minute = 0
  rule.second = 0
  scheduleJob(rule, async () => {
    const group = config.GROUP_LIST[0]
    const topic = group?.topic || ''
    const qun = await bot.Room.find(topic)
    qun?.say("#weather")
  })

  // binance 价格查询
  // const binance = new BinanceManager()
  // binance.start()

  // 查找群组
  // config.GROUP_LIST.forEach(async item => {
  //   // 房源
  //   scheduleJob(config.HOUSE_JOB, async () => {
  //     const qun = await bot.Room.find(item)
  //     qun?.say("#house")
  //   })
  // })
}

// 房源
function executeFamilyTask() {
  // 已买第一套房，临时关闭
  // scheduleJob(config.HOUSE_JOB, async () => {
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
    let targetId = (payload.toId === new bot.ContactSelf().id) ? payload.fromId : payload.toId
    let contact: Contact | undefined = await bot.Contact.find({ id: targetId })
    contact?.say(content)
  }
  WechatHelper.pushMessage(content)
}
