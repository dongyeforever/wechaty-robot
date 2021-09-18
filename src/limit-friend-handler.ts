import {
  Message
} from 'wechaty'
// import axios from 'axios'

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
    // 自动回复消息不处理
    // 13 撤回消息 MessageType.recall 
    if (message.type() === 13 || message.text().endsWith("#自动回复")) return
    // TODO 自己的消息，撤回
    // if (message.self()) {
    //   await message.recall()
    //   return
    // }

    switch (this.getRandomInt(3)) {
      case 0:
        message.say("人工服务请按1. #自动回复")
        break;
      case 1:
        message.say("您的消息已送到对方已读就是不回 #自动回复")
        break;
      case 2:
        message.say("回复技能冷却中 #自动回复")
        break;
    }

    //机器人自动回复
    // this.autoReply(message).then(reply => {
    //   message.say(`${reply} #自动回复`)
    // }).catch(e => {
    //   console.log(e);
    // })
  }

  // private async autoReply(message: Message) {
  //   const url = 'http://api.ruyi.ai/v1/message'
  //   const text = message.text()
  //   const { data } = await axios.get(url, {
  //     headers: { 'Content-Type': 'application/json' },
  //     params: { 'q': text, 'user_id': '8e051663-f044-4c63-a1da-d23e28c9b8f1', 'app_key': '4c4be42e-527d-4c50-9a78-7c84d04d1e28' }
  //   })

  //   const outputs = data['result']['intents'][0]['outputs']
  //   const reply = outputs[0]['property']['text']
  //   return reply
  // }

  getRandomInt(max: any) {
    return Math.floor(Math.random() * max)
  }
}
