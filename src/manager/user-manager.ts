import type { Contact, Wechaty } from 'wechaty'

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

    public async findUser(search: string): Promise<Contact | undefined> {
        const user = await this.bot.Contact.find(search)
        return user
    }

    /**
    * getSelf
    */
    public async getSelf(): Promise<Contact | undefined> {
        // 文件传输助手发送消息提示
        return this.findUser('File Transfer')
    }

}