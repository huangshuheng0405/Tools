# turbo

## quick start

```bash
bunx create-turbo@latest
```

这会生成一个预设好`apps`和`packages`的项目结构。

## `turbo.json`

```json [turbo.json]
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      // 表示 build 任务依赖于依赖包的 build 任务先完成
      "dependsOn": ["^build"],
      // 将打包后的 dist 目录缓存起来
      "outputs": ["dist/**"]
    },
    "lint": {},
    "dev": {
      // 这里的 cache 设置为 false，因为开发模式需要持续运行
      "cache": false,
      "persistent": true
    }
  }
}
```
