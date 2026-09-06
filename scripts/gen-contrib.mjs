// 生成首页“近一年提交热力图”的数据快照（真实 git 提交数，按天聚合）。
// 用法: node scripts/gen-contrib.mjs
// 输出: docs/.vitepress/data/contrib.json —— 组件直接 import，不依赖运行时 git。
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function collect() {
  // git 不可用（例如在无 git 的构建机上）→ 返回空数据，避免拖垮构建
  try {
    const out = execFileSync('git', ['log', '--date=short', '--pretty=format:%ad'], {
      cwd: root,
      encoding: 'utf8',
    })
    const days = {}
    for (const d of out.split(/\r?\n/).filter(Boolean)) {
      days[d] = (days[d] || 0) + 1
    }
    return days
  } catch {
    return {}
  }
}

const now = new Date()
const days = collect()
const refDate = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-')

const data = {
  generatedAt: now.toISOString(),
  // 组件以此日期锚定“今天”，保证 SSR/客户端渲染一致、不随时间漂移
  refDate,
  total: Object.values(days).reduce((a, b) => a + b, 0),
  days,
}

const dir = join(root, 'docs/.vitepress/data')
mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'contrib.json'), JSON.stringify(data, null, 2))
console.log(`contrib.json: ${data.total} commits, ${Object.keys(days).length} active days`)
