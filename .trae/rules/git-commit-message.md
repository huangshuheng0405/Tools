---
alwaysApply: true
scene: git_message
---

`commit`规范模板

```
<emoji> <type>(<scope>): <description>
```

`scope` 表示影响的范围，例如`user`、`order`等。

| Emoji | type       | 用途      | 示例                          |
| ----- | ---------- | --------- | ----------------------------- |
| ✨    | `feat`     | 新功能    | `✨ feat: 新增购物车功能`     |
| 🐛    | `fix`      | 修 Bug    | `🐛 fix: 修复订单提交失败`    |
| 📝    | `docs`     | 文档      | `📝 docs: 更新 README`        |
| ♻️    | `refactor` | 重构      | `♻️ refactor: 重构用户服务`   |
| 🎨    | `style`    | 样式/UI   | `🎨 style: 优化登录页面样式`  |
| ⚡    | `perf`     | 性能优化  | `⚡ perf: 优化商品查询性能`   |
| ✅    | `test`     | 测试      | `✅ test: 添加用户登录测试`   |
| 🔧    | `chore`    | 杂项/配置 | `🔧 chore: 修改 Vite 配置`    |
| 📦    | `build`    | 构建/依赖 | `📦 build: 更新依赖版本`      |
| 👷    | `ci`       | CI/CD     | `👷 ci: 添加 GitHub Actions`  |
| ⏪    | `revert`   | 回滚      | `⏪ revert: 回滚用户模块修改` |
