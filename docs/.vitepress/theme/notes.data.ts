import { createContentLoader } from 'vitepress'

// 首页要显示各分类的篇数。用内容加载器而不是写死数字：
// 扫描发生在 dev / build 时，新增笔记后首页会自动跟着变，不需要手动维护。
export default createContentLoader('zh/**/*.md', {
  transform(raw): string[] {
    return raw.map((page) => page.url)
  },
})

declare const data: string[]
export { data }
