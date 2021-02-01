import { Message } from 'wechaty';
import IFilter from './filter'
import MessageHandler from '../message-handler'

export default class CommandFilter implements IFilter {

    execute(message: Message) {
        // 烦躁特殊处理
        if (message.text().startsWith("#")) {
            MessageHandler.getInstance().handleMessage(message)
            return true
        }
        // 烦躁特殊处理
        if (message.text() === "烦躁" || message.text() === "烦") {
            MessageHandler.getInstance().handleMessage(message)
            return true
        }
        return false
    }

}