import { mkdir, readdir, rename, rm, writeFile } from 'node:fs/promises'

await rm('dist/client', { recursive: true, force: true })
await mkdir('dist/client', { recursive: true })
const buildEntries = await readdir('dist', { withFileTypes: true })
for (const entry of buildEntries) {
  if (['.openai', 'client', 'server'].includes(entry.name)) continue
  await rename(`dist/${entry.name}`, `dist/client/${entry.name}`)
}

const source = String.raw`const mediaPrefix = '/media/'
const uploadPrefix = '/api/media-upload/'

function notFound() {
  return new Response('Not found', { status: 404 })
}

function uploadAuthorized(request, env) {
  if (!env.UPLOAD_TOKEN) return false
  return request.headers.get('authorization') === 'Bearer ' + env.UPLOAD_TOKEN
}

function mediaKey(url, prefix) {
  return decodeURIComponent(url.pathname.slice(prefix.length))
}

async function serveMedia(request, env, url) {
  if (!env.FILES) return notFound()
  const key = mediaKey(url, mediaPrefix)
  if (!key || key.includes('..')) return notFound()

  if (request.method === 'HEAD') {
    const object = await env.FILES.head(key)
    if (!object) return notFound()
    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)
    headers.set('accept-ranges', 'bytes')
    headers.set('content-length', String(object.size))
    headers.set('cache-control', 'public, max-age=31536000, immutable')
    return new Response(null, { status: 200, headers })
  }

  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } })
  }

  const object = await env.FILES.get(key, {
    onlyIf: request.headers,
    range: request.headers,
  })
  if (!object) return notFound()

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('accept-ranges', 'bytes')
  headers.set('cache-control', 'public, max-age=31536000, immutable')

  if (!('body' in object)) return new Response(null, { status: 412, headers })

  if (object.range) {
    const start = object.range.offset
    const length = object.range.length
    headers.set('content-range', 'bytes ' + start + '-' + (start + length - 1) + '/' + object.size)
    headers.set('content-length', String(length))
    return new Response(object.body, { status: 206, headers })
  }

  headers.set('content-length', String(object.size))
  return new Response(object.body, { status: 200, headers })
}

async function uploadMedia(request, env, url) {
  if (!env.FILES || !uploadAuthorized(request, env)) return notFound()
  const key = mediaKey(url, uploadPrefix)
  if (!key || key.includes('..')) return notFound()
  const action = url.searchParams.get('action')

  if (request.method === 'POST' && action === 'create') {
    const upload = await env.FILES.createMultipartUpload(key, {
      httpMetadata: {
        contentType: 'video/mp4',
        cacheControl: 'public, max-age=31536000, immutable',
      },
    })
    return Response.json({ key: upload.key, uploadId: upload.uploadId })
  }

  const uploadId = url.searchParams.get('uploadId')
  if (!uploadId) return new Response('Missing uploadId', { status: 400 })
  const upload = env.FILES.resumeMultipartUpload(key, uploadId)

  if (request.method === 'PUT' && action === 'part') {
    const partNumber = Number(url.searchParams.get('partNumber'))
    if (!Number.isInteger(partNumber) || partNumber < 1 || !request.body) {
      return new Response('Invalid part', { status: 400 })
    }
    const part = await upload.uploadPart(partNumber, request.body)
    return Response.json(part)
  }

  if (request.method === 'POST' && action === 'complete') {
    const payload = await request.json()
    const object = await upload.complete(payload.parts)
    return Response.json({ key: object.key, size: object.size, etag: object.etag })
  }

  if (request.method === 'DELETE' && action === 'abort') {
    await upload.abort()
    return new Response(null, { status: 204 })
  }

  return new Response('Method not allowed', { status: 405 })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname.startsWith(mediaPrefix)) return serveMedia(request, env, url)
    if (url.pathname.startsWith(uploadPrefix)) return uploadMedia(request, env, url)

    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || request.method !== 'GET') return response

    url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  },
}
`

await mkdir('dist/server', { recursive: true })
await writeFile('dist/server/index.js', source, 'utf8')
