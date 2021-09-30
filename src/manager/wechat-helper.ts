import axios from "axios"
import { Message } from "wechaty"
import StringUtil from "../util/string-util"
import UserManager from "./user-manager"

export default class WechatHelper {

    // 发消息
    static async sayMessage(text: string, message?: Message) {
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

    /**
     * 通过「推送精灵」推送消息
     * @param msg 消息文本
     */
    static async pushMessage(msg: string) {
        const { data } = await axios.get(`https://push.bot.qw360.cn/send/25d19400-1f1c-11ec-806f-9354f453c154?msg=${encodeURIComponent(msg)}`)
        if (!data.status) {
            console.log(data)
        }
    }

}