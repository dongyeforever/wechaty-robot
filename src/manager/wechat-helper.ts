import axios from "axios"
import type { FileBox } from 'file-box'
import type { Message } from "wechaty"
import StringUtil from "../util/string-util"
import UserManager from "./user-manager"

const PUSH_HOST = 'http://wxpusher.zjiecode.com/api/send/message'

export default class WechatHelper {

    // 发消息
    static async sayMessage(text: string, message?: Message) {
        if (StringUtil.isNull(text)) return
        if (message) {
            // 根据 message 决定发送方和接收方
            if (message.listener() && message.self()) {
                await message.listener()?.say(text)
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

    static async sendFile(fileBox: FileBox, message: Message) {
        if (message.listener() && message.self()) {
            await message.listener()?.say(fileBox)
        } else {
            await message.say(fileBox)
        }
    }

    /**
     * 通过「推送精灵」推送消息
     * @param msg 消息文本
     */
    static async pushMessage(msg: string) {
        const { data } = await axios.post(PUSH_HOST, {
            "appToken": "AT_6eWyJkoDtpfGn8hLm2d6ULwxj4cYlIXB",
            "content": msg,
            "contentType": 1,//内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown 
            "uids": [//发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。
                "UID_nwqAYkZxS4V6yVWyd74XoTphSRUy"
            ]
        })
        if (!data.status) {
            console.log(data)
        }
    }

}