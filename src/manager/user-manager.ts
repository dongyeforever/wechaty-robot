import { Contact, Wechaty } from 'wechaty'

export default class UserManager {
    private static instance: UserManager
    private bot: Wechaty

    private constructor(bot: Wechaty) {
        this.bot = bot
    }

    public static init(bot: Wechaty) {
        if (!this.instance) {
            this.instance = new UserManager(bot)
        }
    }

    public static getInstance() {
        return this.instance
    }

    public async findUser(userName: string): Promise<Contact | null> {
        const user = await this.bot.Contact.find(userName)
        return user
    }

    /**
    * getSelf
    */
    public getSelf(): Promise<Contact | null> {
        const selfId = this.bot.puppet.selfId()
        return this.findUser(selfId)
    }

}