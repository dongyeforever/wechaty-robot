import { Message } from "wechaty"
import StringUtil from "../util/string-util"
import UserManager from "./user-manager"

export default class WechatHelper {

    // 发消息
    static async sayMessage(text: string, message: Message | null) {
        if (StringUtil.isNull(text)) return
        if (message) {
            // 根据 message 决定发送方和接收方
            if (message.to() && message.self()) {
                await message.to()?.say(text)
            } else {
                await message.say(text)
            }
        } else {
            // 发消息给自己 
            UserManager.getInstance().getSelf().then(user => {
                user?.say(text)
            })
        }
    }

}