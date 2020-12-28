import ICommand from './command'
import { Message, } from 'wechaty'
import Schedule from '../util/schedule'
import Task from '../util/task'

/**
 * 提醒功能
 */
export default class RemindCommand implements ICommand {

    async execute(message: Message) {
      const text = message.text()
      const time = text.split('<br/>')[0].split(' ')[1]
      // 格式不正确处理
      const regexTime = /^(([0-2][0-3])|([0-1][0-9])):[0-5][0-9]$/ // 15:15
      const regexDate = /^(\d{4})-(\d{2})-(\d{2}) (([0-2][0-3])|([0-1][0-9])):[0-5][0-9]$/ // 2020-10-20 15:15
      if (!regexTime.test(time) && !regexDate.test(time)) {
        this.sayMessage(message, "格式不识别，正确格式为：\n #remind 16:21 内容\n #remind 2020-10-21 16:21 内容")
        return
      }
      const content = text.substring(text.indexOf(time) + time.length).trim()
      this.sayMessage(message, `将会在 ${time} 给你发送提醒：👇\n\n${content}`)
      // 添加定时任务
      const task = new Task(time, () => {
        this.sayMessage(message, content)
      })
      Schedule.getInstance().add(task)
    }

    async sayMessage(message: Message, text: string) {
      if (message.to() && message.self()) {
        await message.to()?.say(text)
      } else {
        await message.say(text)
      }
    }
  }
  