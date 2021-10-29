import { Message } from 'wechaty';
import IFilter from './filter'
import MessageHandler from './handler/message-handler'
import config from '../config/index'

export default class CommandFilter implements IFilter {

    execute(message: Message) {
        // 命令处理
        if (message.text().startsWith("#")) {
            MessageHandler.getInstance().handleMessage(message)
            return true
        }
        // 烦躁特殊处理
        this.handleAntsy(message).then(result => {
            if (result) {
                MessageHandler.getInstance().handleMessage(message)
            }
            return result
        })
        return false
    }

    private async handleAntsy(message: Message): Promise<boolean> {
        if (message.text() === "烦躁" || message.text() === "烦") {
            const room = message.room()
            if (room) {
                const topic = await room.topic()
                if (topic == config.GROUP_LIST[0].topic) {
                    return true
                }
            } else {
                return true
            }
        }
        if (message.text() === "嗨 睿睿") {
            return true
        }
        return false
    }

}