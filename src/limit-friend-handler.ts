import {
  // Contact,
  Message,
  log
} from 'wechaty'

export default class LimitFriendHandler {
  private static instance: LimitFriendHandler

  private constructor() { }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new LimitFriendHandler()
    }
    return this.instance
  }

  public async handleMessage(message: Message) {
    log.info('LimitFriendHandler', message.toString())
    // 自动回复
    switch (this.getRandomInt(3)) {
      case 0:
        message.say("[自动回复] 人工服务请按1")
        break;
      case 1:
        message.say("[自动回复] 您的消息已送到对方已读就是不回")
        break;
      case 2:
        message.say("[自动回复] 回复技能冷却中")
        break;
    }
    //todo 机器人自动回复
    // const text = message.text()

  }

  getRandomInt(max: any) {
    return Math.floor(Math.random() * max);
  }
}
