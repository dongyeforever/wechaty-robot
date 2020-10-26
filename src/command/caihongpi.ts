import axios from 'axios'
import ICommand from './command'
import { Message } from 'wechaty'

/**
* 彩虹屁，哈哈哈
*/
export default class ChpCommand implements ICommand {

  async execute(message: Message) {
    const text = await new CaiHongPi().spider()
    await message.say(text)
  }
}

class CaiHongPi {
  // 彩虹屁
  url = `https://lengzhishi.net/caihongpi/api.php`

  async spider() {
    const { data } = await axios.get(this.url)
    return data
  }

}