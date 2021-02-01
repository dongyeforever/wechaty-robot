import { Message } from 'wechaty';
import IFilter from './filter'

export default class NewYearFilter implements IFilter {
    execute(message: Message) {
        // 对新年祝福的处理
        //  新年 新春 春节 + 快乐
        const text = message.text()
        if (!text.startsWith("#新年快乐") && this.contains(text, "快乐") &&
            (this.contains(text, "新年") || this.contains(text, "新春") || this.contains(text, "春节"))) {
            this.sayMessage(message, "#新年快乐")
            return true
        }
        return false
    }

    contains(text: string, keywords: string): boolean {
        return text.indexOf(keywords) > -1
    }

    async sayMessage(message: Message, text: string) {
        if (message.to() && message.self()) {
            await message.to()?.say(text)
        } else {
            await message.say(text)
        }
    }
}