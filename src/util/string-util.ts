export default class StringUtil {

    constructor() {
    }

    static isNull(obj: any) {
        return obj == null || obj == '' || obj == undefined
    }

    static isNotNull(obj: any) {
        return !StringUtil.isNull(obj)
    }

    static stringify(params: any) {
        const data = Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&')
        return data
    }

    /**
     * 获取消息中的命令
     */
    static getMessageCommand(text: string): string {
        const regExp = /^(#?[\u4e00-\u9fa5_a-zA-Z0-9]+)\s?/g
        const result = text.match(regExp)
        if (result) {
            return result[0].trim()
        }
        return ''
        // return text.split(" ")[0] || ''
    }

    /**
     * 获取消息中的内容
     */
    static getMessageContent(text: string): string {
        const command = this.getMessageCommand(text)
        if (this.isNotNull(command)) {
            return text.substring(command!.length).trim()
        }
        return text
    }

}