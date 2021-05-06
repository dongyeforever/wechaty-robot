import { readFileSync, writeFileSync } from 'fs'
import { Message } from 'wechaty'
var path = require('path')

export default class RemindStore {
    private static instance: RemindStore
    private constructor() {
    }

    public static getInstance() {
        if (!RemindStore.instance) {
            this.instance = new RemindStore()
        }
        return RemindStore.instance
    }

    add(key: string, message: Message) {
        try {
            const data = this.getAll()
            data[key] = JSON.stringify(message)
            this.writeToFile(data)
        } catch (error) {
            console.log(error)
        }
    }

    remove(key: string) {
        try {
            const data = this.getAll()
            delete data[key]
            this.writeToFile(data)
        } catch (error) {
            console.log(error)
        }
    }

    get(key: string) {
        try {
            const data = this.getAll()
            return data[key]
        } catch (error) {
            console.log(error)
        }
    }

    getAll() {
        try {
            const data = this.readFromFile()
            const obj = JSON.parse(data)
            return obj
        } catch (error) {
            console.log(error)
        }
    }

    writeToFile(data: string) {
        writeFileSync(path.resolve(__dirname, '../config/remind-config.json'), JSON.stringify(data), 'utf-8')
    }

    readFromFile() {
        return readFileSync(path.resolve(__dirname, '../config/remind-config.json'), 'utf-8')
    }
}