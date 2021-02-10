import { Message } from 'wechaty';
import IFilter from './filter'

export default class NewYearFilter implements IFilter {
    execute(message: Message) {
        // 对新年祝福的处理
        //  新年 新春 春节 + 快乐
        const text = message.text()
        // 如果不是春节附近 return false
        if(!(this.isToday("2021-2-11") || this.isToday("2021-2-12"))) {
            return false
        }
        if (!text.startsWith("#新年快乐") && this.contains(text, "快乐") &&
            (this.contains(text, "新年") || this.contains(text, "新春") || this.contains(text, "春节"))) {
            this.sayMessage(message, "#新年快乐")
            return true
        }
        return false
    }

    isToday(str: string){
        const date = new Date()
        var y = date.getFullYear() // 年
        var m = date.getMonth() + 1 // 月份从0开始的
        var d = date.getDate() //日
        return str == (y + '-' + m + '-' + d)
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