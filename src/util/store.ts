import { readFileSync, writeFileSync } from 'fs'
var path = require('path')

export default class Store {
    private fileName: string

    constructor(fileName: string) {
        this.fileName = fileName
    }

    add(key: string, message: any) {
        try {
            const data = this.getAll()
            if (data[key]) {
                data[key] = [...data[key], JSON.stringify(message)]
            } else {
                data[key] = [JSON.stringify(message)]
            }
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
            const data = this.readFromFile() || "{}"
            const obj = JSON.parse(data)
            return obj
        } catch (error) {
            console.log(error)
        }
    }

    writeToFile(data: string) {
        writeFileSync(path.resolve(__dirname, this.fileName), JSON.stringify(data), 'utf-8')
    }

    readFromFile() {
        return readFileSync(path.resolve(__dirname, this.fileName), 'utf-8')
    }
}
