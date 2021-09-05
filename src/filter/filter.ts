import { Message } from "wechaty";

/**
 * 消息拦截器
 */
export default interface IFilter {

    // return true 代表已经处理并且不需要别的处理器处理
    // false 不处理交给下一个处理器处理
    execute:(message: Message) => boolean
}