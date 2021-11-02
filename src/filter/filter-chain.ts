import type { Message } from 'wechaty';
import type IFilter from './filter'

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
           if (filter.execute(message)) {
               return
           }
        }
    }
}