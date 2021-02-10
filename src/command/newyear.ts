import ICommand from './command'
import { Message, } from 'wechaty'

/**
* 炸弹
*/
export default class NewYearCommand implements ICommand {

  async execute(message: Message) {
    const msgArray = ["牛年大吉", "金牛贺岁", "[烟花]", "[庆祝]", "喜气牛牛", "牛转乾坤", "[烟花]", "[庆祝]",
      "恭喜发财", "财源滚滚", "[烟花]", "[庆祝]", "招财进宝"]

    const delayTimes = []
    let delayTime = 0
    for (let index = 0; index < msgArray.length; index++) {
      if (index > 2) {
        delayTime = delayTime + 500
      }
      delayTimes.push(delayTime)
      setTimeout(() => {
        this.sayMessage(message, msgArray[index])
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