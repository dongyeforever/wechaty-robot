import type ICommand from './command'
import type { Message, } from 'wechaty'

/**
* 烟花 炸弹 基类
*/
export default abstract class BaseBomeCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    const timesStr = text.split(' ')[1] || ''
    const reg = /^[0-9]+.?[0-9]*$/
    let times = 10
    if (reg.test(timesStr)) {
      times = parseInt(timesStr)
      if(times > 100) {
        times = 100
      }
    }

    const delayTimes = []
    let delayTime = 0
    for (let index = 0; index < times; index++) {
      if (index > 0) {
        if (index % 5 === 1) {
          delayTime = delayTime + 100
        } else if (index % 5 === 2) {
          delayTime = delayTime + 200
        } else if (index % 5 === 0) {
          delayTime = delayTime + 1500
        } else {
          delayTime = delayTime + 800
        }
      }
      delayTimes.push(delayTime)
      setTimeout(() => {
        this.sendMessage(message)
      }, delayTimes[index])
    }
  }

  // 发送具体的消息
  abstract sendMessage(message: Message): void
}