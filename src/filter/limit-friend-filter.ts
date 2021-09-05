import { Message } from 'wechaty';
import IFilter from './filter'
import LimitFriendHandler from '../limit-friend-handler'
import LimitFriendStore from '../util/limit-friend-store'

export default class LimitFriendFilter implements IFilter {

    execute(message: Message) {
        // 限制消息处理
        if (this.isLimitFriend(message) && this.isLimitTime()) {
            LimitFriendHandler.getInstance().handleMessage(message)
            return true
        }
        return false
    }

    isLimitFriend(message: Message): boolean {
        const data = LimitFriendStore.getInstance().getAll()
        const from = message.from()
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (key === from?.id) {
                    return true
                }
            }
        }
        return false
    }

    isLimitTime(): boolean {
        const date = new Date()
        const hour = date.getHours()
        if (hour >= 7 && hour <= 21) {
            return false
        }
        return true
    }
}