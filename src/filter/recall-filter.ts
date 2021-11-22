import type { Message } from 'wechaty'
import { FileBox } from "file-box"
import HistoryMessageManager from '../manager/history-message'
import WechatHelper from '../manager/wechat-helper'
import type IFilter from './filter'
import UserManager from '../manager/user-manager'
import * as fs from 'fs'
import * as path from 'path'

export default class RecallFilter implements IFilter {

    execute(message: Message) {
        console.log(message);
        // Audio(2) Image(6) Video(4)
        if (message.type() === 2 || message.type() === 6) {
            this.saveFile(message)
        }

        // 撤回消息 MessageType.Recalled == 13
        if (message.type() === 13) {
            const recallMessageId = message.text()
            const msg = HistoryMessageManager.getInstance().getMessageById(recallMessageId)
            if (!msg) {
                return false
            }
            let pushMessage = `${msg.talker().name()} 撤回了一条消息:`
            if (msg.type() === 7) { // Text(7)
                pushMessage = `${pushMessage} ${msg.text()}`
            } else {
                const newMessage: any = Object.assign({}, msg)
                const fileName = newMessage['_payload']['filename']
                pushMessage = `${pushMessage} ${fileName}`
                this.sendFile(fileName)
            }
            WechatHelper.pushMessage(pushMessage)
            return true
        }
        return false
    }

    private async saveFile(msg: Message) {
        if (msg.listener()?.name() === 'filehelper') {
            return
        }
        const file = await msg.toFileBox()
        const name = file.name
        console.log('Save file to: ' + name)
        await file.toFile()
        
        fs.rename(path.join(__dirname, "../../", name), this.getTmpFile(name), (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    private async sendFile(fileName: string) {
        const filebox = FileBox.fromFile(this.getTmpFile(fileName))
        UserManager.getInstance().getSelf().then(user => {
            user?.say(filebox)
        })
    }

    private getTmpFile(fileName: string) {
        return path.join(__dirname, '../../cache/', fileName)
    }
}