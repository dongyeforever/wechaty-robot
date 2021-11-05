import type { Message } from "wechaty"

export default class HistoryMessageManager {
    items: HistoryMessage[] = []
    maxCount = 100
    static instance: HistoryMessageManager

    public static getInstance() {
        if (!this.instance) {
            this.instance = new HistoryMessageManager()
        }
        return this.instance
    }

    //入队
    enqueue(data: HistoryMessage) {
        if (!data) {
            return
        }
        this.items.push(data)
        if (this.size() > this.maxCount) {
            this.dequeue()
        }
    }
    //出队
    dequeue() {
        var result = this.items.shift()
        return typeof result != 'undefined' ? result : false
    }
    //队列是否为空
    isEmpty() {
        return this.items.length === 0
    }
    //返回队列长度
    size() {
        return this.items.length
    }
    //清空队列
    clear() {
        this.items = []
    }
    //返回队列
    show() {
        return this.items
    }

    getMessageById(id: string): Message | undefined {
        const item = this.items.find(item => item.id === id)
        return item?.data
    }
}

interface HistoryMessage {
    id: string
    data: Message
}