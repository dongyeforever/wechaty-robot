import type ICommand from './command'
import type { Message } from 'wechaty'
import WechatHelper from '../manager/wechat-helper'
import { WebSocket } from 'ws'
import * as CryptoJS from 'crypto-js'
import StringUtil from '../util/string-util'
/**
* ai
*/

const API_ID = 'a754ac95'
const API_SECRET = 'MzYwNGE3ODQ4ZTUwNWRlMmVjMDUyOTY2'
const API_KEY = '64d6242b29c1f8256a9e2e3afa53dd35'


export default class AiCommand implements ICommand {
  // 讯飞星火
  url = `wss://spark-api.xf-yun.com/v2.1/chat`
  // ai 回答结果
  answer: string = ''

  async execute(message: Message) {
    const text = message.text()
    const prompt = text.split(' ')[1] || ''
    if (StringUtil.isNull(prompt)) {
      return
    }

    const ws = new WebSocket(this.getUrl())
    // console.log("url", this.getUrl())

    const params = this.buildAiParams(prompt, message.talker().id)
    ws.on('open', () => {
      this.answer = ''
      ws.send(params)
    })

    ws.on('message', (data: any) => {
      // console.log('received: %s', data)
      const response = JSON.parse(data)
      const header = response.header
      if (header.code == 0) {
        const texts = response.payload.choices.text
        if (texts) {
          for (const text of texts) {
            this.answer += text.content
          }
        }
      }
    })

    ws.on('error', console.error)
    // 监听断开连接
    ws.on('close', () => {
      console.log('断开连接')
      WechatHelper.sayMessage(this.answer, message)
    })

  }

  private getUrl() {
    const os = require('os')
    const host = os.hostname()
    const date = new Date().toUTCString()
    const algorithm = 'hmac-sha256'
    const headers = 'host date request-line'
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2.1/chat HTTP/1.1`
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, API_SECRET)
    const signature = CryptoJS.enc.Base64.stringify(signatureSha)
    const authorizationOrigin = `api_key="${API_KEY}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    const authorization = btoa(authorizationOrigin)
    return `${this.url}?authorization=${authorization}&date=${date}&host=${host}`
  }

  private buildAiParams(prompt: string, uid: string) {
    const params = {
      "header": {
        "app_id": API_ID,
        "uid": CryptoJS.MD5(uid).toString()
      },
      "parameter": {
        "chat": {
          "domain": "generalv2"
        }
      },
      "payload": {
        "message": {
          "text": [
            {
              "role": "user",
              "content": prompt
            }
          ]
        }
      }
    }
    return JSON.stringify(params)
  }

}
