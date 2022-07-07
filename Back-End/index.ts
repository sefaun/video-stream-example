import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { RedisClient } from './connections/redis'


const start = async () => {
  try {

    const redis_client = new RedisClient()
    await redis_client.RedisConnect('redis://localhost:6379', 'my_password')

    const app = express()

    app.use(morgan('dev'))
    app.use(cors())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.get('/api/v1/:stream_no', async (req, res, _next) => {

      const stream = await redis_client.client.get(`stream::${req.params.stream_no}`)

      // res.setHeader('Content-Transfer-Encoding', 'binary')
      res.setHeader('Accept-Ranges', 'bytes')
      res.setHeader('Content-Type', 'video/mp4')
      return res.status(200).send(stream)

    })

    // Not Found
    app.use((_req, res, _next) => {
      return res.status(404).json({ success: false, message: 'Not Found' })
    })

    const port = 5000
    app.listen(port, () => console.log(`🟢 Video Stream Server is Running on Port ${port}`))

  } catch (error) {
    return start()
  }
}

start()