import type { Message } from 'wechaty'

export default interface ICommand {
    execute(message: Message): void
}