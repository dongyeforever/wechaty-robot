import { Message } from 'wechaty';
import IFilter from './filter'

export default class FilterChain {
    filters: IFilter[]
    
    constructor() {
        this.filters = []
    }

    addFilter(filter: IFilter) {
        this.filters.push(filter)
    }

    execute(message: Message) {
        for (let filter of this.filters) {
            filter.execute(message)
        }
    }
}