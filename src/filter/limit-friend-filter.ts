import type { Message } from 'wechaty';
import type IFilter from './filter'
import LimitFriendHandler from './handler/limit-friend-handler'
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
        const from = message.talker()
        const to = message.listener()
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (key === from?.id || key === to?.id) {
                    return true
                }
            }
        }
        return false
    }

    isLimitTime(): boolean {
        const dateTime = new Date().getTime()
        const start = new Date()
        start.setHours(7)
        const end = new Date()
        end.setHours(20)
        if (dateTime >= start.getTime() && dateTime <= end.getTime()) {
            return false
        }
        return true
    }
}