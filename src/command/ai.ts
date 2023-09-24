import type ICommand from './command'
import type { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'
import WebSocket from 'ws'

/**
* ai
*/

// const API_SECRET = 'MzYwNGE3ODQ4ZTUwNWRlMmVjMDUyOTY2'
// const API_KEY = '64d6242b29c1f8256a9e2e3afa53dd35'

// function getWebsocketUrl() {
//   return new Promise((resolve, reject) => {
//     var apiKey = API_KEY
//     var apiSecret = API_SECRET
//     var url = 'wss://spark-api.xf-yun.com/v1.1/chat'
//     var host = location.host
//     var date = new Date().toGMTString()
//     var algorithm = 'hmac-sha256'
//     var headers = 'host date request-line'
//     var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`
//     var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
//     var signature = CryptoJS.enc.Base64.stringify(signatureSha)
//     var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
//     var authorization = btoa(authorizationOrigin)
//     url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
//     resolve(url)
//   })
// }

export default class AiCommand implements ICommand {
  // 讯飞星火
  url = `wss://spark-api.xf-yun.com/v1.1/chat`

  async execute(message: Message) {
    const text = message.text()
    const prompt = text.split(' ')[1] || ''

    const ws = new WebSocket(this.url)
    ws.on('error', console.error)

    ws.on('open', function open() {
      ws.send(prompt)
    })

    ws.on('message', function message(data: any) {
      console.log('received: %s', data)
    })
    WechatHelper.sayMessage(prompt, message)
  }

}
