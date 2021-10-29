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
}