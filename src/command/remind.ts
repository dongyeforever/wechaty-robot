import type ICommand from './command'
import type { Message } from 'wechaty'
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
    let time = text.split('<br/>')[0]
    if (!time) {
      return
    }
    time = time.replace('：', ':') // 防止时间使用中文冒号
    // 格式不正确处理
    const regexDate = /(\d{4})-(\d{2})-(\d{2}) (([0-2][0-3])|([0-1][0-9])):[0-5][0-9]/ // 2020-10-20 15:15
    const realDate = time.match(regexDate)
    let dateTime = ''
    if (realDate) {
      dateTime = realDate[0] || ''
    } else {
      const regexTime = /(([0-2][0-3])|([0-1][0-9])):[0-5][0-9]/ // 15:15
      const realTime = time.match(regexTime)
      if (realTime) {
        dateTime = realTime[0] || ''
      } else {
        WechatHelper.sayMessage("格式不识别，正确格式为: \n #提醒 16:21 内容\n #提醒 2020-10-21 16:21 内容", message)
        return
      }
    }

    if (!this.isValidateDateTime(dateTime)) {
      WechatHelper.sayMessage(`[爱心] ${dateTime} 已过去`, message)
      return
    }
    const content = text.substring(text.indexOf(dateTime) + dateTime.length).trim()
    WechatHelper.sayMessage(`[好的] 将会在 ${dateTime} 提醒你`, message)

    // 存储消息
    RemindStore.getInstance().add(dateTime, message)
    // 添加定时任务
    const task = new Task(dateTime, () => {
      const text = `[爱心]提醒 \n• ${content}`
      WechatHelper.sayMessage(text, message)
      WechatHelper.pushMessage(text)
      // 删除消息
      RemindStore.getInstance().remove(dateTime)
    })
    Schedule.getInstance().add(task)
  }

  /**
   * 判断时间是否已过期
   */
  private isValidateDateTime(dateTime: string) {
    return this.getMilliSeconds(dateTime) > Date.now()
  }

  private getMilliSeconds(dateTime: string) {
    let milliseconds = 0
    const regexTime = /^(([0-2][0-3])|([0-1][0-9])):[0-5][0-9]$/ // 15:15
    const regexDate = /^(\d{4})-(\d{2})-(\d{2}) (([0-2][0-3])|([0-1][0-9])):[0-5][0-9]$/ // 2020-10-20 15:15
    if (regexTime.test(dateTime)) {
      const nextDate = new Date()
      const timeSplit = dateTime.split(':')
      nextDate.setHours(parseInt(timeSplit[0] || ''))
      nextDate.setMinutes(parseInt(timeSplit[1] || ''))
      milliseconds = nextDate.getTime()
    } else if (regexDate.test(dateTime)) {
      milliseconds = new Date(dateTime).getTime()
    }
    return milliseconds
  }

}
