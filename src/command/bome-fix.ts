import ICommand from './command'
import { Message, } from 'wechaty'

/**
* 炸弹
*/
export default class BomeFixCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    const timesStr = text.split(' ')[1]
    const reg = /^[0-9]+.?[0-9]*$/
    let times = 5
    if (reg.test(timesStr)) {
      times = parseInt(timesStr)
      if (times > 100) {
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
        const number = Math.floor(Math.random() * 10)
        if (number < 5) {
          this.sayMessage(message, "[烟花]")
        } else {
          this.sayMessage(message, "[庆祝]")
        }
      }, delayTimes[index])
    }
  }

  async sayMessage(message: Message, text: string) {
    if (message.to() && message.self()) {
      await message.to()?.say(text)
    } else {
      await message.say(text)
    }
  }
}