import fs from 'fs'
import { RedisClient } from './connections/redis'


const start = async () => {
  const video_stream = fs.readFileSync('./f1.mp4')

  const redis_client = new RedisClient()

  await redis_client.RedisConnect('redis://localhost:6379', 'my_password')

  const total_range = parseInt(((video_stream.length / 10000000) + 1).toString())

  for (let i = 0; i < total_range; i++) {
    await redis_client.client.set(`stream::${i + 1}`, video_stream.subarray(i * 10000000, (i + 1) * 10000000))
  }

}

start()