import * as redis from 'redis'
import { RedisClientType } from "redis"


export class RedisClient {
  client: RedisClientType

  RedisConnect(host: string, password: string) {

    return new Promise(async (resolve, _reject) => {
      console.log('🟡 Redis Connecting !')

      this.client = redis.createClient({ url: host, password: password })

      this.client.on('connect', (_) => {
        console.log('🟢 Redis Connected !')
        resolve(true)
      })

      this.client.on('error', (err) => {
        console.log(err)
      })

      await this.client.connect()
    })

  }
}