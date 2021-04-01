import axios from 'axios'
import ICommand from './command'
import { Message } from 'wechaty'

/**
* 垃圾分类
*/
export default class GarbageCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    const garbage = text.split(' ')[1]
    const result = await new Garbage().spider(garbage)
    if (message.to() && message.self()) {
      await message.to()?.say(result)
    } else {
      await message.say(result)
    }
  }
}

class Garbage {
  // 垃圾分类 api
  url = `https://api.66mz8.com/api/garbage.php?name=`

  async spider(garbage: String) {
    const { data } = await axios.get(encodeURI(`${this.url}${garbage}`))
    if (data.code === 200) return `${garbage} -- ${data.data}`
    else return `${garbage} -- ${data.msg}`
  }

}