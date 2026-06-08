# \_\_filename

```js
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
console.log(__filename) // 输出当前文件的绝对路径
```
