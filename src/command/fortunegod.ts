import ICommand from './command'
import { Message, } from 'wechaty'

/**
* 爆竹
*/
export default class FortuneGodCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    const timesStr = text.split(' ')[1]
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
        this.sayMessage(message, "[爆竹]")
      }, delayTimes[index])
    }

    setTimeout(() => {
      this.sayMessage(message, "[烟花]")
      this.sayMessage(message, "谢谢老板，财神到！")
    }, delayTime + 800)
  }

  async sayMessage(message: Message, text: string) {
    if (message.to() && message.self()) {
      await message.to()?.say(text)
    } else {
      await message.say(text)
    }
  }
}