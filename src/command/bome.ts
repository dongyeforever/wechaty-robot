import ICommand from './command'
import { Message, } from 'wechaty'

/**
* 炸弹
*/
export default class BomeCommand implements ICommand {

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

    for (let index = 0; index < times; index++) {
      setTimeout(() => {
        this.sayMessage(message, "[炸弹]")
      }, index * 200)
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