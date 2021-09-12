export default class StringUtil {

    constructor() {
    }

    static isNull(obj: any) {
        return obj == null || obj == '' || obj == undefined;
    }
}