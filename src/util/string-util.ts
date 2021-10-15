export default class StringUtil {

    constructor() {
    }

    static isNull(obj: any) {
        return obj == null || obj == '' || obj == undefined
    }

    static isNotNull(obj: any) {
        return !StringUtil.isNull(obj)
    }
}