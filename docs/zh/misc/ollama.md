# Ollama

[Ollama](https://ollama.com/) 把「下载模型 → 加载进显存/内存 → 起一个本地 HTTP 服务」这套流程打包成一条命令，本质是**本地模型运行时 + OpenAI 风格的本地 API 服务**。默认监听 `127.0.0.1:11434`。

## 安装

| 系统    | 方式                                                              |
| ------- | ----------------------------------------------------------------- |
| Windows | 下载 [OllamaSetup.exe](https://ollama.com/download) 双击安装       |
| macOS   | 下载 dmg，或直接 `brew install ollama`                            |
| Linux   | `curl -fsSL https://ollama.com/install.sh \| sh`                  |

验证：

```bash
ollama -v        # 版本号
ollama serve     # Windows/macOS 安装包已注册为后台服务，一般不用手动起
```

模型默认存放位置：

| 系统    | 路径                                              |
| ------- | ------------------------------------------------- |
| macOS   | `~/.ollama/models`                                |
| Linux   | `/usr/share/ollama/.ollama/models`                |
| Windows | `C:\Users\<用户名>\.ollama\models`                |

换盘用环境变量 `OLLAMA_MODELS` 指定（Linux 记得给 `ollama` 账号读写权限）。

## 模型管理

模型库：<https://ollama.com/library>，按 `名字:标签` 引用，标签就是量化档位（默认 `latest`，通常是 Q4_K_M）。

```bash
ollama pull qwen3:8b        # 下载
ollama list                 # 已下载的模型（简写 ollama ls）
ollama show qwen3:8b        # 看参数量、量化、上下文长度、能力标签
ollama show --modelfile qwen3:8b   # 反查它的 Modelfile
ollama rm qwen3:8b          # 删除
ollama cp qwen3:8b my-model # 复制一份改名
ollama ps                   # 当前加载进内存的模型（含显存占用、剩余存活时间）
ollama stop qwen3:8b        # 手动卸载出内存
```

显存/内存经验值：Q4 量化下**约 0.6 GB / 1B 参数**，再加上下文窗口的 KV cache 开销。

| 可用内存·显存 | 建议参数量 | 代表模型                          |
| ------------- | ---------- | --------------------------------- |
| 8 GB          | 1–4B       | `qwen3:4b`、`llama3.2:3b`         |
| 16 GB         | 7–9B       | `qwen3:8b`、`llama3.1:8b`         |
| 32 GB         | 14–32B     | `qwen3:32b`                       |
| 64 GB+        | 70B        | `llama3.3:70b`                    |

嵌入模型：`nomic-embed-text`、`bge-m3`。具体版本以 library 页面为准。

## 对话

```bash
ollama run qwen3:8b                 # 进入交互式 REPL
ollama run qwen3:8b "解释一下事件循环"   # 单次问答后退出
ollama run -v qwen3:8b "..."        # 打印 token 统计（eval rate、耗时）
```

管道输入：

```bash
cat error.log | ollama run qwen3:8b "总结这些报错的共同原因"
git diff | ollama run qwen3:8b "写一条中文 commit message"
```

REPL 内的斜杠命令：

| 命令              | 作用                                             |
| ----------------- | ------------------------------------------------ |
| `/bye`            | 退出                                             |
| `/clear`          | 清空当前会话上下文                               |
| `/show info`      | 看模型信息（`/show system`、`/show template` 等）|
| `/set system ...` | 本次会话设置 system prompt                       |
| `/set parameter temperature 0.2` | 临时改参数                      |
| `/set verbose`    | 打开统计输出                                     |
| `/?`              | 帮助                                             |

快捷键：`Ctrl+D` 退出、`Ctrl+L` 清屏、`Esc Esc` 编辑上一条消息；多行输入用 `"""` 包起来。

## Modelfile 自定义模型

把 system prompt、参数、模板固化成一个可复用的模型别名：

```dockerfile
FROM qwen3:8b

PARAMETER temperature 0.2
PARAMETER num_ctx 8192
PARAMETER stop "<|end|>"

SYSTEM """
你是一个资深前端代码审查助手。
只输出问题清单，按严重程度排序，每条给出文件位置和修改建议。
"""
```

```bash
ollama create code-reviewer -f Modelfile   # 创建
ollama run code-reviewer                   # 像普通模型一样用
ollama show --modelfile code-reviewer      # 回看配置
ollama rm code-reviewer                    # 删除（不影响基础模型）
```

指令：`FROM`（必填，基础模型）、`PARAMETER`、`TEMPLATE`、`SYSTEM`、`MESSAGE`（预置对话历史）、`LICENSE`、`ADAPTER`（LoRA）。

常用 `PARAMETER`：

| 参数           | 默认  | 说明                                   |
| -------------- | ----- | -------------------------------------- |
| `temperature`  | 0.8   | 随机性，代码类任务调低到 0.1–0.3       |
| `num_ctx`      | 2048  | 上下文窗口，越大越吃内存               |
| `top_p`        | 0.9   | 核采样                                 |
| `top_k`        | 40    | 候选词范围                             |
| `repeat_penalty` | 1.0 | 重复惩罚，>1 生效                      |
| `seed`         | 0     | 固定种子便于复现                       |
| `num_predict`  | -1    | 最大生成 token 数，-1 不限             |
| `stop`         | —     | 停止序列                               |

## REST API

服务起来后所有能力都是 HTTP，`stream` 默认 `true`（NDJSON 逐行返回），要一次性拿结果就显式传 `"stream": false`。

| 端点                | 方法     | 用途                       |
| ------------------- | -------- | -------------------------- |
| `/api/chat`         | POST     | 多轮对话（推荐）           |
| `/api/generate`     | POST     | 单轮补全                   |
| `/api/embed`        | POST     | 向量嵌入                   |
| `/api/tags`         | GET      | 模型列表（同 `/api/list`） |
| `/api/show`         | POST     | 模型详情                   |
| `/api/ps`           | GET      | 运行中的模型               |
| `/api/pull`         | POST     | 下载模型                   |
| `/api/create`       | POST     | 由 Modelfile 创建模型      |
| `/api/delete`       | DELETE   | 删除模型                   |
| `/api/version`      | GET      | 服务版本                   |

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3:8b",
  "stream": false,
  "messages": [{ "role": "user", "content": "用一句话说明 Vite 的热更新原理" }]
}'
```

### OpenAI 兼容端点

`http://localhost:11434/v1`，可以直接喂给 OpenAI SDK 和任何基于它的库：

```js
import OpenAI from 'openai'

const client = new OpenAI({ baseURL: 'http://localhost:11434/v1', apiKey: 'ollama' })

const res = await client.chat.completions.create({
  model: 'qwen3:8b',
  messages: [{ role: 'user', content: '你好' }],
})
```

`apiKey` 随便填（Ollama 不校验），但**不能为空**，部分 SDK 会先做非空校验。

### 浏览器直连（CORS）

前端页面直接 fetch 本地 Ollama 会被 CORS 拦，需要把来源加进 `OLLAMA_ORIGINS`（默认只允许 `127.0.0.1` / `0.0.0.0`）：

```powershell
# Windows，设置后重启 Ollama 服务
[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "http://localhost:5173,chrome-extension://*", "User")
```

```bash
# macOS / Linux
export OLLAMA_ORIGINS=http://localhost:5173
ollama serve
```

流式读取示例：

```js
const res = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    model: 'qwen3:8b',
    stream: true,
    messages: [{ role: 'user', content: '写一个防抖函数' }],
  }),
})

const reader = res.body.getReader()
const decoder = new TextDecoder()
let buf = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  buf += decoder.decode(value, { stream: true })

  const lines = buf.split('\n')
  buf = lines.pop()
  for (const line of lines) {
    if (!line.trim()) continue
    process.stdout.write(JSON.parse(line).message?.content ?? '')
  }
}
```

注意返回的是 NDJSON 而不是 SSE，所以分隔符是换行、没有 `data: ` 前缀，`EventSource` 用不了，得自己拆包。

## 常用环境变量

| 变量                     | 默认                              | 说明                                    |
| ------------------------ | --------------------------------- | --------------------------------------- |
| `OLLAMA_HOST`            | `127.0.0.1:11434`                 | 监听地址，改 `0.0.0.0` 才能被局域网访问 |
| `OLLAMA_MODELS`          | 见上文各系统路径                  | 模型存放目录                            |
| `OLLAMA_KEEP_ALIVE`      | `5m`                              | 空闲多久后卸载出内存；`-1` 常驻、`0` 立即卸载 |
| `OLLAMA_NUM_PARALLEL`    | `1`                               | 单个模型的并发请求数                    |
| `OLLAMA_MAX_LOADED_MODELS` | 每 GPU 3 个                     | 同时驻留的模型数上限                    |
| `OLLAMA_CONTEXT_LENGTH`  | `4096`                            | 服务端默认上下文长度                    |
| `OLLAMA_ORIGINS`         | `127.0.0.1,0.0.0.0`               | 允许的浏览器来源（CORS）                |
| `OLLAMA_MAX_QUEUE`       | `512`                             | 排队请求上限，超出直接拒绝              |
| `OLLAMA_FLASH_ATTENTION` | 支持时自动                        | `1` 强制开、`0` 关，省显存提速          |
| `OLLAMA_KV_CACHE_TYPE`   | `f16`                             | KV cache 量化，`q8_0` / `q4_0` 更省显存 |
| `HTTPS_PROXY`            | —                                 | 拉模型走代理（官方建议别设 `HTTP_PROXY`）|

## 局域网访问

设 `OLLAMA_HOST=0.0.0.0:11434` 后重启服务，其他机器用 `http://<内网IP>:11434` 访问。Ollama **没有鉴权**，只在可信内网开放，暴露公网务必加反向代理 + 鉴权。

Linux systemd 部署时改环境变量：

```bash
sudo systemctl edit ollama.service
```

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_KEEP_ALIVE=-1"
```

## 常见问题

**`ollama run` 报模型不存在**：先 `ollama pull`，`run` 虽然会自动拉，但网络受限时会直接失败，用 `pull` 更好定位。

**第一次响应特别慢**：模型要从磁盘加载进显存，之后受 `OLLAMA_KEEP_ALIVE` 控制。想让模型常驻设 `-1`，`ollama ps` 能看到剩余存活时间。

**中文输出夹带英文 / 复读**：多为量化档位太低或 `num_ctx` 太小，换更大的量化标签，或把 `temperature` 降到 0.2 左右。

**显存不够**：降参数量 → 降量化档位 → 开 `OLLAMA_FLASH_ATTENTION=1` + `OLLAMA_KV_CACHE_TYPE=q8_0` → 减小 `num_ctx`。

**Windows 端口被占用**：`netstat -ano | findstr 11434` 找 PID，或直接换 `OLLAMA_HOST=127.0.0.1:11435`。

**彻底卸载**：删程序本体 + 删 `C:\Users\<用户名>\.ollama` 目录（模型文件都在这里，往往几十 GB）。
