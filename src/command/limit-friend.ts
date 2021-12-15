import type ICommand from './command'
import type { Message } from 'wechaty'
import UserManager from '../manager/user-manager'
import LimitFriendStore from '../util/limit-friend-store'
import StringUtil from '../util/string-util'

/**
* 限制的好友
*/
export default class LimitFriendCommand implements ICommand {

  async execute(message: Message) {
    const text = message.text()
    if (message.talker() && message.self()) {
      // 是我自己才有权限执行这个指令
      let name = text.split(' ')[1] || ''
      if (StringUtil.isNull(name)) {
        // 未指定 名字，默认我说话的对方
        this.addContactDirect(message)
        return
      }

      const user = UserManager.getInstance().findUser(name)
      user.then(data => {
        if (data && data != null) {
          const id = data.id
          LimitFriendStore.getInstance().add(id, data)
        }
      })
    }
  }

  private addContactDirect(message: Message) {
    if (message.room() == null) { // 非群消息
      const toUser = message.listener()
      if (toUser) {
        LimitFriendStore.getInstance().add(toUser.id, toUser)
      }
    }
  }
}