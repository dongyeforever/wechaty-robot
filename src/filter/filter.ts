import { Message } from "wechaty";

/**
 * 消息拦截器
 */
export default interface IFilter {

    execute:(message: Message) => boolean
}