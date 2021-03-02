import axios from 'axios'
import ICommand from './command'
import { Message } from 'wechaty'

/**
* 毒鸡汤
*/
export default class DjtCommand implements ICommand {

  async execute(message: Message) {
    const text = await new DuJiTang().spider()
    if (message.to() && message.self()) {
      await message.to()?.say(text)
    } else {
      await message.say(text)
    }
  }
}

class DuJiTang {
  // 毒鸡汤
  // url = `https://lengzhishi.net/dujitang/api.php`
  url = `https://du.shadiao.app/api.php`

  async spider() {
    const { data } = await axios.get(this.url)
    return data
  }

}