import { Message } from 'wechaty'
import IFilter from './filter'
import FilterChain from './filter-chain'

export default class FilterManager {
    filterChain: FilterChain
    static instance: FilterManager

    constructor() {
        this.filterChain = new FilterChain()
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new FilterManager()
        }
        return this.instance
    }

    setFilter(filter: IFilter) {
        this.filterChain.addFilter(filter)
    }

    filterMessage(mesage: Message) {
        this.filterChain.execute(mesage)
    }
}