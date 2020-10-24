export default class Task {
    time: string = ''
    execute: Function = () => { }
    
    constructor(time: string = '', execute: Function = () => { }) {
        this.time = time
        this.execute = execute
    }
}