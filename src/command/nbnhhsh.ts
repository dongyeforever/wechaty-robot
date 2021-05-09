import axios from 'axios'
import ICommand from './command'
import { Message } from 'wechaty'

/**
* 能不能好好说话
*/
export default class NBNHHSHCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    const nbnhhsh = text.split(' ')[1]

    const host = 'https://lab.magiconch.com/api/nbnhhsh/guess'
    const { data } = await axios.post(host, {
      text: nbnhhsh
    })
    const trans = data[0].trans || []
    this.sayMessage(message, `【${nbnhhsh}】\n${trans.join("\n")}`)
  }

  async sayMessage(message: Message, text: string) {
    if (message.to() && message.self()) {
      await message.to()?.say(text)
    } else {
      await message.say(text)
    }
  }
}