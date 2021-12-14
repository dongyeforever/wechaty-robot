import type { Message } from 'wechaty';
import WechatHelper from '../manager/wechat-helper';
import type IFilter from './filter'

export default class ExpressFilter implements IFilter {

    execute(message: Message) {
        const text = message.text()
        if (text.startsWith('【菜鸟智能柜】') || text.startsWith('【京东快递柜】')) {
            const msg = `#提醒 19:30 ${text}`
            WechatHelper.sayMessage(msg)
            return true
        }
        return false
    }
}