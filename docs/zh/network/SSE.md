# SSE

```python
import os

from fastapi import FastAPI
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
import json
from starlette.responses import StreamingResponse

app = FastAPI()

llm = ChatOpenAI(
    model='qwen-max',
    streaming=True,
    temperature=0.7,
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
)

async def generate_sse(prompt: str):
    """异步生成 SSE事件流"""
    messages = [HumanMessage(content=prompt)]
    try:
        # 使用 astream 方法逐块获取响应
        async for chunk in llm.astream(messages):
            # chunk 是 AImessageChunk 取 content字段
            if chunk.content:
                # 按照 sse 格式 发送 data : {...}\n\n
                yield f'data: {json.dumps({"token": chunk.content}, ensure_ascii=False)}\n\n'
        # 发送结束标记
        yield f'data: {json.dumps({"done": True})}\n\n'
    except Exception as e:
        yield f'data: {json.dumps({"error": str(e)})}\n\n'

@app.get('/stream')
async def stream_endpoint(prompt: str):
    """"""
    return StreamingResponse(
        generate_sse(prompt),
        media_type='text/event-stream; charset=utf-8'
    )

@app.get('/')
async def root():
    return {"message": "Hello World"}

```

`StreamingResponse`

- 第一个参数必须是一个可迭代对象、生成器或异步生成器
- `media_type`: 内容类型
  - 如果是大模型打字机文本效果（SSE），通常固定为`text/event-stream; charset=utf-8`
  - 如果是大文件、视频下载，可能会是`application/octet-stream`

`json.dumps()`

- 把 Python 对象（字典、列表）转换为 JSON 字符串
- `ensure_ascii=False`: 避免 JSON 字符串中的 ASCII 字符被转义为 Unicode 编码

## 前端接收

有两种方法 接收 SSE 事件流

- 原生 `EventSource`

- fetch + `ReadableStream`

大模型开发中，通常有复杂的鉴权（如`Headers: {Authorization: 'Bearer ' + token}`）, 或者提示词很长需要`POST`请求，必须用`fetch`手动解析文本流

用原生的`fetch`手动去读缓存区(Reader)

```js
async function startStreaming() {
  const prompt = '请写一篇关于人工智能的短文'
  let fullText = ''

  try {
    // 1. 发起 fetch 请求
    const response = await fetch(
      `http://localhost:8000/stream?prompt=${encodeURIComponent(prompt)}`
    )

    if (!response.ok) throw new Error('网络响应不成功')

    // 2. 获取底层的读取器（Reader）和解码器（Decoder）
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    let buffer = '' // 缓存未处理完的文本块

    // 3. 循环循环读取网络流
    while (true) {
      const { value, done } = await reader.read()
      if (done) break // 网络连接彻底关闭

      // 将二进制数据解码为字符串
      buffer += decoder.decode(value, { stream: true })

      // 4. 按 SSE 的规范 "\n\n" 切割数据
      const lines = buffer.split('\n\n')
      // 最后一行可能是不完整的，留到下一次循环处理
      buffer = lines.pop()

      for (const line of lines) {
        // 检查是否符合 SSE 的 data: 格式
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim()
          if (!jsonStr) continue

          const data = JSON.parse(jsonStr)

          if (data.done) {
            console.log('大模型生成完毕')
            return
          }
          if (data.error) {
            console.error('大模型报错:', data.error)
            return
          }
          if (data.token) {
            fullText += data.token
            // 实时更新到 UI
            document.getElementById('chat-box').innerText = fullText
          }
        }
      }
    }
  } catch (error) {
    console.error('流式读取失败:', error)
  }
}
```

`response.body.getReader()`
普通的`fetch`（`await response.json()`）`是把等服务器全部响应完成后，才会解析 JSON 字符串

但流式传输不一样，`response.body`本质是一个`ReadableStream`，需要手动去读取

`reader.read()`

- value: 二进制数据，此时数据不是文本，而是`Uint8Array`（二进制字节数组）
- done: 是否读取完成

`decoder.decode(value, { stream: true })`

必须加`stream: true`，一个中文字符再`UTF-8`编码中通常占3个字节，网络传输是分块的，运气不好可能一个Chunk只传了2个字节，最后一个字节挤到了下一个Chunk里面，加了`stream: true`，会等下一个Chunk来了后评级来拼起来再解码，避免中文乱码
