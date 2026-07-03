# useDeferredValue

## 语法

```js
const deferredValue = useDeferredValue(value);
```

- `value`：延迟更新的值（支持任意类型）
- `deferredValue`：延迟更新的值,在初始渲染期间，返回的延迟值将与您提供的值相同

## 用法

以下示例展示了如何使用 `useDeferredValue` 延迟处理输入内容，以提高大型数据的搜索性能。

```js
import React, { useState, useTransition, useDeferredValue } from 'react'
import { Input, List } from 'antd'
import mockjs from 'mockjs'
interface Item {
   name: number
   address: string
}
export const App = () => {
   const [val, setVal] = useState('')
   const [list] = useState<Item[]>(() => {
    // 使用 Mock.js 生成模拟数据
      return mockjs.mock({
         'list|10000': [
            {
               'id|+1': 1,
               name: '@natural',
               'address': '@county(true)',
            }
         ]
      }).list
   })
   const deferredQuery = useDeferredValue(val)
   const isStale = deferredQuery !== val // 检查是否为延迟状态
   const findItem = () => {
      //过滤列表，仅在 deferredQuery 更新时触发
      return list.filter(item => item.name.toString().includes(deferredQuery))
   }
   return (
      <div>
         <Input value={val} onChange={(e) => setVal(e.target.value)} />
         <List style={{opacity: isStale ? '0.2' : '1', transition: 'all 1s'}} renderItem={(item) => <List.Item>
            <List.Item.Meta title={item.name} description={item.address} />
         </List.Item>} dataSource={findItem()}>
         </List>
      </div>
   )
}

export default App
```

使用`useDeferredValue`后，输入框中的搜索内容不会立即触发列表过滤，避免频繁的渲染。输入停止片刻后(看起来像节流)，列表会自动更新为符合条件的数据，确保了较流畅的交互体验。

## 注意事项

- `useDeferredValue` 并不是防抖,防抖是需要一个固定的延迟时间，譬如1秒后再处理某些行为，但是`useDeferredValue`并不是一个固定的延迟，它会根据用户设备的情况进行延迟，当设备情况好，那么延迟几乎是无感知的