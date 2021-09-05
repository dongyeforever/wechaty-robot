import Store from './store'

export default class RemindStore extends Store {
    private static instance: RemindStore

    private constructor() {
        super('../config/remind-config.json')
    }

    public static getInstance() {
        if (!RemindStore.instance) {
            this.instance = new RemindStore()
        }
        return RemindStore.instance
    }
}