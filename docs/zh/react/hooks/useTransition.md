# useTransition

帮你对状态更新进行“限流与降级”，从而防止耗时的任务阻塞用户的高频操作（如打字、点击、滚动），让应用保持丝滑流畅。

## 背景

在默认情况下，React 的所有状态更新都被视为**紧急任务（Urgent Updates）**。 想象一个经典的“搜索框”场景：用户输入关键字，页面不仅要更新输入框里的文字，还要同步过滤一个包含几万条数据的列表。

```js
// 默认做法：两个更新一样紧急
const handleChange = (e) => {
  setInputValue(e.target.value) // 1. 更新输入框（必须快！）
  setSearchQuery(e.target.value) // 2. 过滤大列表（非常慢！）
}
```

因为过滤大列表非常耗时，它会霸占浏览器的 JS 线程。当用户飞快地打字时，**输入框会明显卡顿、甚至卡死**，因为 React 必须等上一次大列表渲染完，才能处理下一次的打字输入。

## 基本语法

```js
const [isPending, startTransition] = useTransition()
```

- `isPending`：一个布尔值。当过渡任务正在后台偷偷渲染、还没渲染完成时，它是 `true`；渲染完成后变成 `false`。你可以用它来展示一个微小的加载菊花图（Spinner）。

- `startTransition`：一个函数。你把**不紧急、耗时**的状态更新代码包裹在它的回调函数里。

## 用法

先利用`mockjs`模拟数据

```sh
npm i mockhs
```

结合vite插件

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import type { Plugin } from 'vite'
import mockjs from 'mockjs'
import url from 'node:url'
const viteMockServer = (): Plugin => {
  return {
    name: 'vite-mock-server',
    //使用vite插件的钩子函数
    configureServer(server) {
      server.middlewares.use('/api/list', async (req, res) => {
        const parsedUrl = url.parse(req.originalUrl, true)
        //获取url参数 true表示返回对象 {keyWord: 'xx'}
        const query = parsedUrl.query
        res.setHeader('Content-Type', 'application/json')
        const data = mockjs.mock({
          //返回1000条数据
          'list|1000': [
            {
              'id|+1': 1, //id自增
              name: query.keyWord, //name为url参数中的keyWord
              address: '@county(true)' //address为随机地址
            }
          ]
        })
        //返回数据
        res.end(JSON.stringify(data))
      })
    }
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteMockServer()]
})
```

编写完成后访问我们的接口`http://localhost:5174/api/list?keyWord=xx`即可访问数据

前端界面利用`antd`

```tsx
import { useTransition, useState } from 'react';
import { Input, Flex, List } from "antd";
interface Item {
   id: number;
   name: string;
   address: string
}
const App = () => {
   const [inputValue, setInputValue] = useState('');
   const [isPending, startTransition] = useTransition(); // 开始过渡
   const [list, setList] = useState<Item[]>([])
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInputValue(value)
      fetch(`/api/list?keyWord=${value}`).then(res => res.json()).then(data => {
         const res = data?.list ?? [];
         // 使用过渡 useTransition
         startTransition(() => {
            setList([...res])
         })
         //不使用过渡 useTransition
         //setList([...res])
      })
   }
   return (
      <>
         <Flex>
            <Input
               value={inputValue}
               onChange={handleInputChange} // 实时更新
               placeholder="请输入姓名"
            />
         </Flex>
         {
            isPending && <div>loading...</div>
         }
         <List
            dataSource={list}
            renderItem={(item) => (
               <List.Item>
                  <List.Item.Meta
                     title={item.name}
                     description={item.address}
                  />
               </List.Item>
            )}
         />
      </>
   );
}

export default App;
```

## 注意事项

传给`startTransition`的回调函数必须是**同步的**，不能在里面写`setTimeout`或`fetch`异步请求

