# prompts

[prompts](https://www.npmjs.com/package/prompts)

## Installation

```bash
npm install -d prompts
```

## Usages

```js [prompts.js]
import prompts from 'prompts'
;(async () => {
  const response = await prompts({
    type: 'number',
    name: 'value',
    message: 'How old are you?',
    validate: (value) => (value < 18 ? 'Nightclub is 18+ only' : true)
  })

  console.log(response)
})()
```

```bash
node prompts.js
# 直到你输入的数大于18才通过严重
```

## Dynamic Prompts

Prompt propeties can be function too.Prompt Objects with `type` set to `falsy` value are skipped

```js [prompts.js]
import prompts from 'prompts'

const questions = [
  {
    type: 'text',
    name: 'dish',
    message: 'Do you like pizza?'
  },
  {
    type: (prev) => (prev === 'yes' ? 'text' : null),
    name: 'topping',
    message: 'Name a topping'
  }
]

;(async () => {
  const response = await prompts(questions)
  console.log(response)
})()
```

```bash
$ bun prompts.js
√ Do you like pizza? ... yes
√ Name a topping ... aaa
{
  dish: "yes",
  topping: "aaa",
}
```

## Prompt Chain

Prompts with a list of prompts objects.Returns an object with the response.Make sure to give each prompt
a unique `name` property to prevent overwriting values.

```js [prompts.js]
import { LogLevels } from 'consola'
import prompts from 'prompts'

const questions = [
  {
    type: 'text',
    name: 'username',
    message: 'What is your Github username?'
  },
  {
    type: 'number',
    name: 'age',
    message: 'How old are you?'
  },
  {
    type: 'text',
    name: 'about',
    message: 'Tell something about yourself',
    initial: 'Why should I?'
  }
]

;(async () => {
  const response = await prompts(questions)
  console.log(response)
})()
```
