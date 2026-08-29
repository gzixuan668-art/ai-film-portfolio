import { createReadStream, readFileSync, statSync } from 'node:fs'

const videoLibrary = JSON.parse(
  readFileSync(new URL('../work/video-library-local.json', import.meta.url), 'utf8'),
)

export function originalVideoDevServer() {
  const byKey = new Map(videoLibrary.map((item) => [item.key, item.source]))

  return {
    name: 'original-video-dev-server',
    configureServer(server) {
      server.middlewares.use('/media', (request, response, next) => {
        if (!request.url || !['GET', 'HEAD'].includes(request.method ?? '')) return next()

        const key = decodeURIComponent(request.url.split('?')[0].replace(/^\//, ''))
        const source = byKey.get(key)
        if (!source) return next()

        try {
          const { size } = statSync(source)
          const range = request.headers.range
          response.setHeader('Accept-Ranges', 'bytes')
          response.setHeader('Content-Type', 'video/mp4')
          response.setHeader('Cache-Control', 'no-store')

          if (range) {
            const match = /^bytes=(\d*)-(\d*)$/.exec(range)
            if (!match) {
              response.statusCode = 416
              response.setHeader('Content-Range', `bytes */${size}`)
              return response.end()
            }

            const start = match[1] ? Number(match[1]) : 0
            const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1
            if (start > end || start >= size) {
              response.statusCode = 416
              response.setHeader('Content-Range', `bytes */${size}`)
              return response.end()
            }

            response.statusCode = 206
            response.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
            response.setHeader('Content-Length', end - start + 1)
            if (request.method === 'HEAD') return response.end()
            return createReadStream(source, { start, end }).pipe(response)
          }

          response.statusCode = 200
          response.setHeader('Content-Length', size)
          if (request.method === 'HEAD') return response.end()
          return createReadStream(source).pipe(response)
        } catch {
          return next()
        }
      })
    },
  }
}
