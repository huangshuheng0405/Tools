# \_\_dirname

在ES模块中（`"type: module"`或`.mjs`文件中），`__dirname`是不可用的，解决方法时通过`import.meta.url`来手动构建

```js
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
```

## import.meta.url

`import.meta.url`是**ES模块**中的一个元属性，它返回当前模块文件的绝对URL字符串（通常以`file:///`开头，指向文件在文件系统中的位置）

配合`fileURLToPath`函数，可以将URL转换为
