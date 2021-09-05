import ICommand from './command'
import { Message } from 'wechaty'
import UserManager from '../manager/user-manager'
import LimitFriendStore from '../util/limit-friend-store'

/**
* 限制的好友
*/
export default class LimitFriendCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    if (message.from() && message.self()) {
      // 是我自己
      const name = text.split(' ')[1]
      const user = UserManager.getInstance().findUser(name)
      user.then(data => {
        if (data && data != null) {
          const id = data.id
          LimitFriendStore.getInstance().add(id, data)
        }
      })
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