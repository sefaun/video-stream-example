import express from 'express'
import fs from 'fs'
import cors from 'cors'
import morgan from 'morgan'


const start = async () => {
  try {

    const app = express()

    app.use(morgan('dev'))
    app.use(cors())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.get('/api/v1/video-stream', async (req, res, _next) => {

      const resolved_path = './video.mp4'
      const fileSize = fs.statSync(resolved_path).size
      const range = req.headers.range

      const parts = range.replace(/bytes=/, '').split('-')

      const start = Number(parts[0])
      const end = parts[1] ? Number(parts[1]) : 500000

      if (start >= fileSize) {
        return res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize)
      }

      const chunksize = (end - start) + 1
      const file = fs.createReadStream(resolved_path, { start, end });

      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`)
      res.setHeader('Accept-Ranges', 'bytes')
      res.setHeader('Content-Length', chunksize)
      res.setHeader('Content-Type', 'video/mp4')

      return file.pipe(res)

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