import ICommand from './command'
import { Message, } from 'wechaty'
import Schedule from '../util/schedule'
import Task from '../util/task'
import RemindStore from '../util/remind-store'
import WechatHelper from '../manager/wechat-helper'

/**
 * 提醒功能
 */
export default class RemindCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    const time = text.split('<br/>')[0]
    // 格式不正确处理
    const regexDate = /(\d{4})-(\d{2})-(\d{2}) (([0-2][0-3])|([0-1][0-9])):[0-5][0-9]/ // 2020-10-20 15:15
    const realDate = time.match(regexDate)
    let dateTime = ''
    if (realDate) {
      dateTime = realDate[0]
    } else {
      const regexTime = /(([0-2][0-3])|([0-1][0-9])):[0-5][0-9]/ // 15:15
      const realTime = time.match(regexTime)
      if (realTime) {
        dateTime = realTime[0]
      } else {
        WechatHelper.sayMessage("格式不识别，正确格式为：\n #remind 16:21 内容\n #remind 2020-10-21 16:21 内容", message)
        return
      }
    }

    const content = text.substring(text.indexOf(dateTime) + dateTime.length).trim()
    WechatHelper.sayMessage(`[好的] 将会在 ${dateTime} 提醒你`, message)
    // 存储消息
    RemindStore.getInstance().add(dateTime, message)
    // 添加定时任务
    const task = new Task(dateTime, () => {
      WechatHelper.sayMessage(`[爱心]提醒 \n• ${content}`, message)
      // 删除消息
      RemindStore.getInstance().remove(dateTime)
    })
    Schedule.getInstance().add(task)
  }
}
