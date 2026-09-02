import { createReadStream, readFileSync, statSync } from 'node:fs'
import { basename, resolve } from 'node:path'

const [siteUrl, uploadToken, libraryPath] = process.argv.slice(2)
if (!siteUrl || !uploadToken) {
  throw new Error('Usage: node scripts/upload-originals.mjs <site-url> <upload-token> [library-json]')
}

const librarySource = libraryPath
  ? resolve(libraryPath)
  : new URL('../work/video-library-local.json', import.meta.url)
const library = JSON.parse(readFileSync(librarySource, 'utf8'))
const partSize = 32 * 1024 * 1024
const headers = { authorization: `Bearer ${uploadToken}` }

async function request(url, options = {}, attempts = 4) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response
      throw new Error(`${response.status} ${await response.text()}`)
    } catch (error) {
      lastError = error
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
    }
  }
  throw lastError
}

async function uploadFile(entry, index) {
  const size = statSync(entry.source).size
  const publicUrl = `${siteUrl.replace(/\/$/, '')}/media/${entry.key}`
  const existing = await fetch(publicUrl, { method: 'HEAD' })
  if (existing.ok && Number(existing.headers.get('content-length')) === size) {
    console.log(`[${index + 1}/${library.length}] 已存在：${basename(entry.source)}`)
    return
  }

  const endpoint = `${siteUrl.replace(/\/$/, '')}/api/media-upload/${entry.key}`
  const created = await request(`${endpoint}?action=create`, { method: 'POST', headers })
  const { uploadId } = await created.json()
  const parts = []

  try {
    for (let offset = 0, partNumber = 1; offset < size; offset += partSize, partNumber += 1) {
      const end = Math.min(offset + partSize, size) - 1
      const stream = createReadStream(entry.source, { start: offset, end })
      const uploaded = await request(
        `${endpoint}?action=part&uploadId=${encodeURIComponent(uploadId)}&partNumber=${partNumber}`,
        { method: 'PUT', headers, body: stream, duplex: 'half' },
      )
      parts.push(await uploaded.json())
      const percent = Math.round(((end + 1) / size) * 100)
      console.log(`[${index + 1}/${library.length}] ${basename(entry.source)} ${percent}%`)
    }

    await request(`${endpoint}?action=complete&uploadId=${encodeURIComponent(uploadId)}`, {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ parts }),
    })
  } catch (error) {
    await fetch(`${endpoint}?action=abort&uploadId=${encodeURIComponent(uploadId)}`, {
      method: 'DELETE',
      headers,
    }).catch(() => {})
    throw error
  }

  const verified = await request(publicUrl, { method: 'HEAD' })
  if (Number(verified.headers.get('content-length')) !== size) {
    throw new Error(`Size mismatch after upload: ${entry.source}`)
  }
}

for (let index = 0; index < library.length; index += 1) {
  await uploadFile(library[index], index)
}

console.log(`全部 ${library.length} 个视频已上传并核对文件大小。`)
