# Sequelize

[sequelize](https://www.npmjs.com/package/sequelize) 是一个 Node.js ORM，支持 MySQL / PostgreSQL / SQLite / MSSQL，提供模型定义、CRUD、关联、事务、校验、Hook 等能力。

ORM（Object Relational Mapping）对象关系映射，用J`JS`对象操作数据库

## Installation

安装 `sequelize` + 对应数据库驱动（任选其一）：

::: code-group

```bash [npm]
npm i sequelize
```

```bash [yarn]
yarn add sequelize
```

```bash [pnpm]
pnpm add sequelize
```

```bash [bun]
bun add sequelize
```

:::

驱动（按你的数据库选一个）：

::: code-group

```bash [npm]
npm i mysql2
```

```bash [yarn]
yarn add mysql2
```

```bash [pnpm]
pnpm add mysql2
```

```bash [bun]
bun add mysql2
```

:::

::: code-group

```bash [npm]
npm i pg pg-hstore
```

```bash [yarn]
yarn add pg pg-hstore
```

```bash [pnpm]
pnpm add pg pg-hstore
```

```bash [bun]
bun add pg pg-hstore
```

:::

::: code-group

```bash [npm]
npm i sqlite3
```

```bash [yarn]
yarn add sqlite3
```

```bash [pnpm]
pnpm add sqlite3
```

```bash [bun]
bun add sqlite3
```

:::

::: code-group

```bash [npm]
npm i tedious
```

```bash [yarn]
yarn add tedious
```

```bash [pnpm]
pnpm add tedious
```

```bash [bun]
bun add tedious
```

:::

## Quick Start

### 连接数据库

```js
import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('db_name', 'db_user', 'db_password', {
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql',
  logging: false
})
```

### 连通性检查

```js
await sequelize.authenticate()
```

## Model（模型定义）

### define（快速定义）

```js
import { DataTypes } from 'sequelize'
import { sequelize } from './sequelize.js'

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'users',
    underscored: true,
    timestamps: true
  }
)
```

### 同步表结构

会自动创建表

```js
await sequelize.sync()
```

常用参数：

- `sequelize.sync({ alter: true })`：尝试自动对齐表结构（开发环境常用）
- `sequelize.sync({ force: true })`：先删表再建表（会清数据）

## CRUD（常用）

### Create

```js
const user = await User.create({ name: 'Alice', email: 'alice@example.com' })
```

### Read

```js
const user = await User.findByPk(1)
const user2 = await User.findOne({ where: { email: 'alice@example.com' } })
const list = await User.findAll({
  where: { name: 'Alice' },
  order: [['id', 'DESC']],
  limit: 20,
  offset: 0
})
```

### Update

```js
await User.update({ name: 'Alice2' }, { where: { id: 1 } })

const user = await User.findByPk(1)
if (user) {
  user.name = 'Alice3'
  await user.save()
}
```

### Delete

```js
await User.destroy({ where: { id: 1 } })
```

### count / 分页

```js
const page = 1
const pageSize = 20

const result = await User.findAndCountAll({
  order: [['id', 'DESC']],
  limit: pageSize,
  offset: (page - 1) * pageSize
})

const total = result.count
const list = result.rows
```

## Query 速查

### where + Op

```js
import { Op } from 'sequelize'

const list = await User.findAll({
  where: {
    id: { [Op.gt]: 10 },
    name: { [Op.like]: '%Ali%' },
    email: { [Op.in]: ['a@x.com', 'b@x.com'] }
  }
})
```

### attributes（选择字段）

```js
const list = await User.findAll({
  attributes: ['id', 'name']
})
```

### order

```js
const list = await User.findAll({
  order: [
    ['createdAt', 'DESC'],
    ['id', 'DESC']
  ]
})
```

## Associations（关联）

### 一对多 / 多对一

```js
export const Post = sequelize.define(
  'Post',
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false }
  },
  { tableName: 'posts', underscored: true, timestamps: true }
)

User.hasMany(Post, { foreignKey: 'userId' })
Post.belongsTo(User, { foreignKey: 'userId' })
```

### include（联表查询）

```js
const list = await Post.findAll({
  include: [{ model: User }],
  limit: 20
})
```

## Transactions（事务）

```js
import { Transaction } from 'sequelize'

await sequelize.transaction(
  { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
  async (t) => {
    await User.create(
      { name: 'Bob', email: 'bob@example.com' },
      { transaction: t }
    )
    await Post.create({ title: 'Hello', userId: 1 }, { transaction: t })
  }
)
```

## Validations（校验） & Constraints（约束）

```js
export const Account = sequelize.define(
  'Account',
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 32]
      }
    }
  },
  { tableName: 'accounts', underscored: true, timestamps: true }
)
```

## Hooks（生命周期）

```js
User.addHook('beforeCreate', async (user) => {
  user.name = user.name.trim()
})
```

## 常用实践（备忘）

- 连接与模型统一导出：`db/sequelize.js` 负责实例，`models/*.js` 负责定义，`models/index.js` 统一注册关联
- `logging` 只在开发环境打开，线上建议关闭或接入日志系统
- `sync({ alter: true })` 更适合学习/小项目；正式项目更推荐迁移工具做 schema 变更
- 事务里所有写操作都要带 `{ transaction: t }`，不要漏
