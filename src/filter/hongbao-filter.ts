import { Message } from 'wechaty';
import WechatHelper from '../manager/wechat-helper';
import StringUtil from '../util/string-util';
import IFilter from './filter'

export default class HongBaoFilter implements IFilter {

    execute(message: Message) {
        const text = message.text()
        const room = message.room() || ''
        const from = message.talker().name()
        if (text.startsWith('收到红包')) {
            const msg = `[爱心][${StringUtil.isNull(room) ? '' : room + ' '}${from}] ${text}`
            WechatHelper.pushMessage(msg)
            return true
        }
        return false
    }
}