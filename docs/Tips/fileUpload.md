# 文件上传

## 前端

::: code-group

```html [load.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        font-family:
          system-ui,
          -apple-system,
          Segoe UI,
          Roboto,
          Arial,
          sans-serif;
        padding: 16px;
      }
      .row {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }
      .card {
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 12px;
        max-width: 760px;
      }
      .muted {
        color: #6b7280;
        font-size: 12px;
      }
      progress {
        width: 320px;
        height: 16px;
      }
      #result {
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 12px;
        background: #0b1020;
        color: #e5e7eb;
        padding: 10px;
        border-radius: 10px;
      }
      button {
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        background: #fff;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      input[type='text'] {
        width: 360px;
        max-width: 100%;
        padding: 8px 10px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <div id="myDiv" data-color="red"></div>

    <div class="card" style="margin-top: 14px">
      <div class="row">
        <input id="fileInput" type="file" />
        <button id="uploadBtn" type="button">上传</button>
        <button id="cancelBtn" type="button" disabled>取消</button>
      </div>

      <div class="row" style="margin-top: 10px">
        <label class="muted" for="uploadUrl">上传地址</label>
        <input
          id="uploadUrl"
          type="text"
          value="http://localhost:3000/upload"
        />
      </div>

      <div class="row" style="margin-top: 10px">
        <progress id="progress" value="0" max="100"></progress>
        <span id="progressText" class="muted">0%</span>
      </div>

      <div id="fileMeta" class="muted" style="margin-top: 10px"></div>
      <div id="result" style="margin-top: 10px"></div>
    </div>

    <script>
      const myDiv = document.getElementById('myDiv')
      console.log(myDiv.dataset.color)
      console.log(myDiv.getAttribute('data-color'))

      const fileInput = document.getElementById('fileInput')
      const uploadBtn = document.getElementById('uploadBtn')
      const cancelBtn = document.getElementById('cancelBtn')
      const uploadUrlInput = document.getElementById('uploadUrl')
      const progressEl = document.getElementById('progress')
      const progressText = document.getElementById('progressText')
      const resultEl = document.getElementById('result')
      const fileMetaEl = document.getElementById('fileMeta')

      let currentXhr = null

      /**
       * 设置上传按钮是否禁用
       * @param {boolean} busy - 是否禁用
       */
      function setBusy(busy) {
        uploadBtn.disabled = busy
        cancelBtn.disabled = !busy
        fileInput.disabled = busy
        uploadUrlInput.disabled = busy
      }

      /**
       * 设置上传进度
       * @param {number} percent - 进度百分比
       */
      function setProgress(percent) {
        const v = Math.max(0, Math.min(100, percent))
        progressEl.value = v
        progressText.textContent = `${v}%`
      }

      /**
       * 显示上传结果
       * @param {string|object} payload - 上传结果
       */
      function showResult(payload) {
        if (typeof payload === 'string') {
          resultEl.textContent = payload
          return
        }
        // 是对象就抓换为json对象
        try {
          // 第三个参数是缩进空格数，这里设置为2个
          resultEl.textContent = JSON.stringify(payload, null, 2)
        } catch {
          resultEl.textContent = String(payload)
        }
      }

      /**
       * 监听文件选择变化
       */
      fileInput.addEventListener('change', () => {
        const f = fileInput.files?.[0]
        // 没选择直接返回
        if (!f) {
          fileMetaEl.textContent = ''
          return
        }
        fileMetaEl.textContent = `已选择：${f.name}（${f.type || 'unknown'}，${f.size} bytes）`
      })

      /**
       * 监听取消按钮点击事件
       */
      cancelBtn.addEventListener('click', () => {
        // 当前在上传文件再取消
        if (currentXhr) currentXhr.abort()
      })

      /**
       * 监听上传按钮点击事件
       */
      uploadBtn.addEventListener('click', async () => {
        const file = fileInput.files?.[0]
        if (!file) {
          showResult('请先选择文件')
          return
        }

        const uploadUrl = uploadUrlInput.value.trim()
        if (!uploadUrl) {
          showResult('请填写上传地址')
          return
        }

        setProgress(0)
        showResult('准备上传...')
        setBusy(true)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('filename', file.name)
        formData.append('contentType', file.type || '')

        const xhr = new XMLHttpRequest()
        // 保存当前xhr  后续用于取消上传
        currentXhr = xhr

        // 第三个参数是是否异步
        xhr.open('POST', uploadUrl, true)
        xhr.responseType = 'text'

        // 监听上传进度
        xhr.upload.onprogress = (e) => {
          if (!e.lengthComputable) return
          // 更新上传进度
          const pct = Math.round((e.loaded / e.total) * 100)
          setProgress(pct)
        }

        // 监听上传完成
        xhr.onload = () => {
          setBusy(false)
          currentXhr = null
          setProgress(100)

          const text = xhr.responseText ?? ''
          const contentType = xhr.getResponseHeader('content-type') || ''
          if (contentType.includes('application/json')) {
            try {
              showResult(JSON.parse(text))
              return
            } catch {}
          }
          showResult(text || `上传完成（HTTP ${xhr.status}）`)
        }

        xhr.onerror = () => {
          setBusy(false)
          currentXhr = null
          showResult('上传失败：网络错误/跨域被拦截')
        }

        xhr.onabort = () => {
          setBusy(false)
          currentXhr = null
          showResult('已取消上传')
        }

        xhr.send(formData)
      })
    </script>
  </body>
</html>
```

```js [load.js]
const myDiv = document.getElementById('myDiv')
console.log(myDiv.dataset.color)
console.log(myDiv.getAttribute('data-color'))

const fileInput = document.getElementById('fileInput')
const uploadBtn = document.getElementById('uploadBtn')
const cancelBtn = document.getElementById('cancelBtn')
const uploadUrlInput = document.getElementById('uploadUrl')
const progressEl = document.getElementById('progress')
const progressText = document.getElementById('progressText')
const resultEl = document.getElementById('result')
const fileMetaEl = document.getElementById('fileMeta')

let currentXhr = null

/**
 * 设置上传按钮是否禁用
 * @param {boolean} busy - 是否禁用
 */
function setBusy(busy) {
  uploadBtn.disabled = busy
  cancelBtn.disabled = !busy
  fileInput.disabled = busy
  uploadUrlInput.disabled = busy
}

/**
 * 设置上传进度
 * @param {number} percent - 进度百分比
 */
function setProgress(percent) {
  const v = Math.max(0, Math.min(100, percent))
  progressEl.value = v
  progressText.textContent = `${v}%`
}

/**
 * 显示上传结果
 * @param {string|object} payload - 上传结果
 */
function showResult(payload) {
  if (typeof payload === 'string') {
    resultEl.textContent = payload
    return
  }
  // 是对象就抓换为json对象
  try {
    // 第三个参数是缩进空格数，这里设置为2个
    resultEl.textContent = JSON.stringify(payload, null, 2)
  } catch {
    resultEl.textContent = String(payload)
  }
}

/**
 * 监听文件选择变化
 */
fileInput.addEventListener('change', () => {
  const f = fileInput.files?.[0]
  // 没选择直接返回
  if (!f) {
    fileMetaEl.textContent = ''
    return
  }
  fileMetaEl.textContent = `已选择：${f.name}（${f.type || 'unknown'}，${f.size} bytes）`
})

/**
 * 监听取消按钮点击事件
 */
cancelBtn.addEventListener('click', () => {
  // 当前在上传文件再取消
  if (currentXhr) currentXhr.abort()
})

/**
 * 监听上传按钮点击事件
 */
uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files?.[0]
  if (!file) {
    showResult('请先选择文件')
    return
  }

  const uploadUrl = uploadUrlInput.value.trim()
  if (!uploadUrl) {
    showResult('请填写上传地址')
    return
  }

  setProgress(0)
  showResult('准备上传...')
  setBusy(true)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('filename', file.name)
  formData.append('contentType', file.type || '')

  const xhr = new XMLHttpRequest()
  // 保存当前xhr  后续用于取消上传
  currentXhr = xhr

  // 第三个参数是是否异步
  xhr.open('POST', uploadUrl, true)
  xhr.responseType = 'text'

  // 监听上传进度
  xhr.upload.onprogress = (e) => {
    if (!e.lengthComputable) return
    // 更新上传进度
    const pct = Math.round((e.loaded / e.total) * 100)
    setProgress(pct)
  }

  // 监听上传完成
  xhr.onload = () => {
    setBusy(false)
    currentXhr = null
    setProgress(100)

    const text = xhr.responseText ?? ''
    const contentType = xhr.getResponseHeader('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        showResult(JSON.parse(text))
        return
      } catch {}
    }
    showResult(text || `上传完成（HTTP ${xhr.status}）`)
  }

  xhr.onerror = () => {
    setBusy(false)
    currentXhr = null
    showResult('上传失败：网络错误/跨域被拦截')
  }

  xhr.onabort = () => {
    setBusy(false)
    currentXhr = null
    showResult('已取消上传')
  }

  xhr.send(formData)
})
```

:::

## 后端

安装依赖

```bash
npm init -y
npm i express cors multer
node server.js
```

```js [server.js]
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const app = express()

app.use(
  cors({
    origin: '*'
  })
)

const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '')
    const safeExt = ext.slice(0, 20)
    const name = `${crypto.randomUUID()}${safeExt}`
    cb(null, name)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
})

app.use('/uploads', express.static(uploadDir))

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ ok: false, message: '缺少文件字段 file' })
    return
  }

  res.json({
    ok: true,
    originalName: req.file.originalname,
    storedName: req.file.filename,
    size: req.file.size,
    mime: req.file.mimetype,
    url: `/uploads/${req.file.filename}`,
    fields: req.body // 这里能拿到你额外 append 的 filename/contentType
  })
})

app.listen(3000, () => {
  console.log('Upload server running at http://localhost:3000')
})
```

## 大文件上传

核心原理

- **分片**：通过`File`对象（继承自`Blob`的`.slice(start, end)`的方法，将文件分为若干块
- **并发上传**：使用`Promise`控制并发数量，避免同时发生太多请求导致浏览器或服务器压力太大
- **断点续传**：记录已上传的分片索引，失败时只重传未完成的分片
- **完整性校验**：上传前计算文件哈希（如`spark-md5`，后端根据哈希避免重复上传或校验分片）

> 对大文件计算哈希较耗时，可采取"抽样哈希"或Web Worker 避免阻塞UI

后端：`multer + express + cors`

## 前端

::: code-group

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input type="file" id="uploadFile" />
    <button id="uploadBtn">上传</button>
    <div>链接地址：<a href="" target="_blank" id="linkUrl"></a></div>

    <script src="https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js"></script>
    <script src="./bigFileUpload.js" type="module"></script>
  </body>
</html>
```

```js [bigFileUpload.js]
const fileInput = document.getElementById('uploadFile')
const linkUrlSpan = document.getElementById('linkUrl')
const API_BASE = 'http://localhost:3000'

document.getElementById('uploadBtn').addEventListener('click', async () => {
  const file = fileInput.files?.[0]
  if (!file) {
    alert('请选择文件')
    return
  }

  // 1. 计算文件hash值
  const fileHash = await calculateHash(file)
  // 2. 分片
  const chunks = splitChunk(file)
  // 3. 上传并合并
  await uploadChunks(file, chunks, fileHash)
  alert('上传完成')
})

/**
 * 获取文件并计算hash值
 * @param {*} file
 * @returns
 */
function calculateHash(file) {
  if (!globalThis.SparkMD5 || !globalThis.SparkMD5.ArrayBuffer) {
    return Promise.reject(new Error('缺少 SparkMD5 依赖'))
  }

  const HASH_CHUNK_SIZE = 2 * 1024 * 1024

  return new Promise((resolve, reject) => {
    // 用于增量计算 ArrayBuffer 哈希值
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()

    let start = 0

    reader.onerror = () => {
      reject(reader.error || new Error('读取文件失败'))
    }

    // 读取完的回调
    reader.onload = (e) => {
      if (e?.target?.result) spark.append(e.target.result)
      // 更新下次读取的位置
      start = Math.min(file.size, start + HASH_CHUNK_SIZE)
      if (start >= file.size) {
        // 读取完毕 获取最终的MD5字符串
        resolve(spark.end())
        return
      }
      loadNext()
    }

    function loadNext() {
      // 防止超过文件大小，导致读取错误
      const end = Math.min(file.size, start + HASH_CHUNK_SIZE)
      // 读取该块的ArrayBuffer 数据
      reader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNext()
  })
}

const CHUNK_SIZE = 5 * 1024 * 1024 // 每片 5MB

/**
 * 分片文件
 * @param {*} file 文件
 * @returns 分片后的文件数组
 * 每个元素是一个对象，包含索引、文件块和hash值
 */
function splitChunk(file) {
  const chunks = []
  let start = 0
  let index = 0
  while (start < file.size) {
    const end = Math.min(start + CHUNK_SIZE, file.size)
    chunks.push({
      index,
      blob: file.slice(start, end),
      hash: null
    })
    start = end
    index++
  }

  return chunks
}

/**
 * 上传文件片
 * @param {*} fileHash 文件hash值
 * @param {*} chunk 分片对象
 * @returns 上传结果
 * 包含分片索引、hash值、上传状态等
 */
async function uploadChunk(fileHash, chunk) {
  const formData = new FormData()
  formData.append('fileHash', fileHash)
  formData.append('chunkIndex', String(chunk.index))
  formData.append('chunk', chunk.blob)

  // 可携带额外参数： 总分片数、 文件名称等
  const response = await fetch(`${API_BASE}/upload/chunk`, {
    method: 'post',
    body: formData
  })

  const payload = await readResponsePayload(response)
  if (!response.ok) {
    throw new Error(
      typeof payload === 'string' ? payload : JSON.stringify(payload)
    )
  }
  return payload
}

async function uploadChunks(file, chunks, fileHash) {
  // 询问后端已上传的分片索引 （断点续传）
  const uploadIndexes = await getUploadedChunks(fileHash)

  // 过滤出未上传的分片
  const pendingChunks = chunks.filter(
    (chunk) => !uploadIndexes.includes(chunk.index)
  )

  const CONCURRENCY = 3 // 控制并发数量
  const queue = [...pendingChunks]
  const activeTasks = new Set()
  const results = []

  while (queue.length > 0 || activeTasks.size > 0) {
    while (activeTasks.size < CONCURRENCY && queue.length > 0) {
      const chunk = queue.shift()
      // 上传单个分片
      const task = uploadChunk(fileHash, chunk)
        .then((result) => {
          activeTasks.delete(task)
          results.push({ index: chunk.index, success: true })
        })
        .catch((err) => {
          activeTasks.delete(task)
          results.push({ index: chunk.index, success: false, error: err })
          // 失败可重试 这里简化逻辑
        })
      activeTasks.add(task)
    }
    if (activeTasks.size > 0) {
      await Promise.race(activeTasks)
    }
  }

  // 所有分片完成后 可通知后端合并
  const allUploaded = results.every((item) => item.success)
  if (allUploaded) {
    await mergeChunks(fileHash, file.name, chunks.length)
  }
}

/**
 * 获取已上传的分片索引
 * @param {*} fileHash 文件hash值
 * @returns 已上传的分片索引数组
 */
async function getUploadedChunks(fileHash) {
  const res = await fetch(
    `${API_BASE}/upload/status?fileHash=${encodeURIComponent(fileHash)}`
  )
  const payload = await readResponsePayload(res)
  if (!res.ok) {
    throw new Error(
      typeof payload === 'string' ? payload : JSON.stringify(payload)
    )
  }

  if (Array.isArray(payload)) return payload.map((n) => Number(n))
  if (payload && Array.isArray(payload.uploaded))
    return payload.uploaded.map((n) => Number(n))
  return []
}

/**
 * 合并文件片
 * @param {*} hash 文件hash值
 * @param {*} name 文件名称
 * @param {*} total 总分片数
 */
async function mergeChunks(hash, name, total) {
  const res = await fetch(`${API_BASE}/upload/merge`, {
    method: 'post',
    body: JSON.stringify({ hash, name, total }),
    headers: {
      'content-type': 'application/json'
    }
  })
  const data = await res.json()
  const linkUrl = `${API_BASE}/uploads/${data.filename}`
  linkUrlSpan.href = linkUrl
  linkUrlSpan.textContent = linkUrl

  const payload = await readResponsePayload(res)
  if (!res.ok) {
    throw new Error(
      typeof payload === 'string' ? payload : JSON.stringify(payload)
    )
  }
  return payload
}

async function readResponsePayload(res) {
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    return await res.json().catch(() => null)
  }
  return await res.text()
}
```

:::

## 后端

```js [server.js]
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const fsp = require('fs/promises')

const app = express()

// 允许跨域
app.use(cors({ origin: '*' }))
// 解析 json 格式
app.use(express.json({ limit: '2mb' }))

// 获取当前目录
const ROOT = __dirname
// 临时存储文件目录
const CHUNKS_DIR = path.join(ROOT, 'chunks')
// 合并后最终存储目录
const UPLOADS_DIR = path.join(ROOT, 'uploads')

// 同步创建 chunks 目录，recursive: true 表示如果父目录不存在也会递归创建。
fs.mkdirSync(CHUNKS_DIR, { recursive: true })
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

// 将该目录暴露为静态资源 前端可以通过 http://localhost:3000/uploads/文件名 直接访问
app.use('/uploads', express.static(UPLOADS_DIR))

const upload = multer({
  // 会将文件内容以 Buffer 对象保存在 req.file.buffer 属性 你可以直接访问这个buffer 例如写到任意目录
  storage: multer.memoryStorage(),
  // 限定每个分片文件大小为 50MB
  limits: { fileSize: 50 * 1024 * 1024 }
})

/**
 * 安全文件名 把文件名中的特殊字符替换为下划线
 * @param {*} name 文件名
 * @returns 安全后的文件名
 * @description 防止用户上传恶意文件名导致路径遍历攻击
 */
function safeFileName(name) {
  const base = path.basename(name || 'file')
  return base.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
}

/**
 * 分片文件路径
 * @param {*} fileHash 文件哈希值
 * @param {*} chunkIndex 分片索引
 * @returns 分片文件的完整路径
 * @description 构建分片文件的路径，用于存储和合并文件
 */
function chunkPath(fileHash, chunkIndex) {
  return path.join(CHUNKS_DIR, fileHash, `${chunkIndex}.part`)
}

// 查询已上传分片
app.get('/upload/status', async (req, res) => {
  try {
    // 从查询参数中获取文件哈希值
    const fileHash = String(req.query.fileHash || '')
    // fileHash 不能为空
    if (!fileHash)
      return res.status(400).json({ ok: false, message: 'missing fileHash' })

    // 构建分片临时文件目录路径
    const dir = path.join(CHUNKS_DIR, fileHash)
    let files = []
    try {
      files = await fsp.readdir(dir)
    } catch {
      // 如果目录不存在，说明没有任何分片上传过
      return res.json({ ok: true, uploaded: [] })
    }

    const uploaded = files
      .filter((x) => x.endsWith('.part'))
      .map((x) => Number(x.replace('.part', '')))
      .filter((n) => Number.isInteger(n) && n >= 0)
      .sort((a, b) => a - b)

    res.json({ ok: true, uploaded })
  } catch (e) {
    res.status(500).json({ ok: false, message: e?.message || 'status error' })
  }
})

// 上传单个分片
app.post('/upload/chunk', upload.single('chunk'), async (req, res) => {
  // upload.single('chunk') 告诉 Multer 从表单中提取名为 chunk 的文件字段，并将文件信息放到 req.file 中。
  try {
    // 因为使用了 multipart/form-data，所以 fileHash 和 chunkIndex 都在 req.body 中
    const fileHash = String(req.body.fileHash || '')
    const chunkIndex = Number(req.body.chunkIndex)

    if (!fileHash)
      return res.status(400).json({ ok: false, message: 'missing fileHash' })
    if (!Number.isInteger(chunkIndex) || chunkIndex < 0) {
      return res.status(400).json({ ok: false, message: 'invalid chunkIndex' })
    }
    if (!req.file)
      return res.status(400).json({ ok: false, message: 'missing chunk file' })

    // 构建临时目录
    const dir = path.join(CHUNKS_DIR, fileHash)
    await fsp.mkdir(dir, { recursive: true })

    // 将内存中的分片数据写入文件
    await fsp.writeFile(chunkPath(fileHash, chunkIndex), req.file.buffer)
    res.json({ ok: true, index: chunkIndex })
  } catch (e) {
    res
      .status(500)
      .json({ ok: false, message: e?.message || 'chunk upload error' })
  }
})

// 合并分片
app.post('/upload/merge', async (req, res) => {
  try {
    const hash = String(req.body.hash || '')
    const name = safeFileName(req.body.name || 'file')
    const total = Number(req.body.total)

    if (!hash)
      return res.status(400).json({ ok: false, message: 'missing hash' })
    if (!Number.isInteger(total) || total <= 0) {
      return res.status(400).json({ ok: false, message: 'invalid total' })
    }

    // 避免和用户上传同名文件覆盖
    const outName = `${hash}_${name}`
    // 最终文件路径 uploads/哈希_文件名
    const outPath = path.join(UPLOADS_DIR, outName)

    for (let i = 0; i < total; i++) {
      try {
        // 循环检查每个分片是否存在
        await fsp.access(chunkPath(hash, i))
      } catch {
        // 少任何一个  报告缺失的分片
        return res
          .status(400)
          .json({ ok: false, message: `missing chunk ${i}` })
      }
    }

    await new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(outPath)
      ws.on('error', reject)

      let i = 0
      const pipeNext = () => {
        if (i >= total) {
          ws.end()
          resolve()
          return
        }
        const rs = fs.createReadStream(chunkPath(hash, i))
        rs.on('error', reject)
        rs.on('end', () => {
          i++
          pipeNext()
        })
        // 设置 { end: false } 防止可写流在每次 pipe 后自动关闭，从而可以连续写入多个分片。
        rs.pipe(ws, { end: false })
      }

      pipeNext()
    })

    // 合并成功后 删除该文件哈希的整个临时分片目录 （包括所有的.part 文件）
    await fsp.rm(path.join(CHUNKS_DIR, hash), { recursive: true, force: true })

    // 返回最终文件名和可访问的url （通过之前的静态目录）
    res.json({
      ok: true,
      filename: outName,
      url: `/uploads/${encodeURIComponent(outName)}`
    })
  } catch (e) {
    res.status(500).json({ ok: false, message: e?.message || 'merge error' })
  }
})

app.listen(3000, () => {
  console.log('server running at http://localhost:3000')
})
```

`fs/promises`模块较`fs`：传统`fs`模块方法都是基于回调的，写起来很繁琐，而`fs/promises`直接`await`，代码写起来像同步一样
