import type Task from './task'
/**
 * 定时任务
 */
export default class Schedule {
    private static instance: Schedule
    scheduleList: Task[] = []
    timer: any

    private constructor() {
    }

    public static getInstance() {
        if (!Schedule.instance) {
            this.instance = new Schedule()
        }
        return Schedule.instance
    }

    /**
     * 添加任务
     * @param task 任务
     * @param time 时间
     */
    add(task: Task) {
        const time = task.time
        if (time && this.getTime(time) >= new Date().getTime()) {
            let needStart = false
            // 如果当前没有task，需要开启任务 || 如果时间在数组第一个元素之前需要重新计时
            if (this.scheduleList.length === 0 || (this.scheduleList[0] && this.getTime(time) < this.getTime(this.scheduleList[0].time))) {
                needStart = true
            }
            this.scheduleList.push(task)
            this.scheduleList.sort((first: Task, next: Task) => {
                return this.getTime(first.time) - this.getTime(next.time)
            })
            if (needStart) {
                this.start()
            }
        }
    }

    /**
     * 删除任务
     * @param time 
     */
    remove(time: string) {
        this.scheduleList = this.scheduleList.filter(item => item.time !== time)
    }

    /**
     * 开启定时任务
     */
    start() {
        this.stop()
        if (this.scheduleList.length > 0) {
            const nextTime = this.scheduleList[0]?.time || ''
            const timeout = this.getTime(nextTime) - new Date().getTime()
            this.timer = setTimeout(() => { this.executeTask() }, timeout);
        }
    }

    /**
     * 获取指定格式时间毫秒值
     * @param nextTime 
     */
    private getTime(nextTime: string) {
        let milliseconds = 0
        const regexTime = /^(([0-2][0-3])|([0-1][0-9])):[0-5][0-9]$/ // 15:15
        const regexDate = /^(\d{4})-(\d{2})-(\d{2}) (([0-2][0-3])|([0-1][0-9])):[0-5][0-9]$/ // 2020-10-20 15:15
        if (regexTime.test(nextTime)) {
            const nextDate = new Date()
            const timeSplit = nextTime.split(':')
            nextDate.setHours(parseInt(timeSplit[0] || ''))
            nextDate.setMinutes(parseInt(timeSplit[1] || ''))
            milliseconds = nextDate.getTime()
        } else if (regexDate.test(nextTime)) {
            milliseconds = new Date(nextTime).getTime()
        }
        return milliseconds
    }

    executeTask() {
        if (this.scheduleList.length > 0) {
            const firstTask = this.scheduleList.shift()
            if (firstTask) firstTask.execute()
            this.start()
        }
    }

    /**
     * 停止任务
     */
    stop() {
        if (this.timer) clearTimeout(this.timer)
    }

}