import Store from './store'

export default class LimitFriendStore extends Store {
    private static instance: LimitFriendStore

    private constructor() {
        super('../config/limit-friend.json')
    }

    public static getInstance() {
        if (!LimitFriendStore.instance) {
            this.instance = new LimitFriendStore()
        }
        return LimitFriendStore.instance
    }
}