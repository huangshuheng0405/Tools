# git

<svg width='200px' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><g clip-path="url(#devicon-git-icon-1-a)"><path fill="#DE4C36" d="m588.7 273.3-262-262c-15-15-39.5-15-54.6 0l-54.4 54.4 69 69a45.9 45.9 0 0 1 58 58.5l66.6 66.5a46 46 0 1 1-27.5 26l-62-62v163.1q6.5 3.3 12 8.7a46 46 0 1 1-49.9-10V220.8a46 46 0 0 1-25-60.3l-68-68L11.3 272a38.6 38.6 0 0 0 0 54.6l262 262c15 15 39.5 15 54.6 0l260.8-260.8c15-15 15-39.5 0-54.6"/></g><defs><clipPath id="devicon-git-icon-1-a"><path fill="#fff" d="M0 0h600v600H0z"/></clipPath></defs></svg>

![git-command](/Misc/git-command.jpg)

说明：

- workspace：工作区
- staging area：暂存区
- local repository：本地仓库
- remote reposiory：远程仓库

## git pull

`git pull`是用于从远程仓库拉去最新代码并合并到本地分支，它本质是两个命令的组合：`git fetch`和`git merge`。

`git fetch`用于从远程仓库拉去最新代码，但不会修改你的当前工作区代码
`git merge`将下载下来的远程分支代码合并到本地分支。
`git pull`命令的执行顺序是：`git fetch` -> `git merge`。
如果合并过程中出现冲突，用户需要手动解决冲突，然后提交合并后的代码。
如果合并过程中没有冲突，用户直接提交合并后的代码。

冲突处理

当本地修改与远程代码修改了同一文件的相同位置时，会触发冲突。
用户需要手动解决冲突，寻找 <<<<<<<、======= 和 >>>>>>> 标记，手动删改代码并保存

## git merge git rebase

git merge

创建一个新的合并提交，将两个历史连接在一起

假设你从`main`分支切出`feature`分支，此时`main`上也有了新的提交

```plaintext
C3---C4  (feature)
     /
C1---C2---C5   (main)
```

执行`git merge main`（在feature分支），git会找到C4和C5的公共祖先C2，然后创建一个新的合并提交C6，将C4和C5连接在一起。

```plaintext
C3---C4------\
     /        v
C1---C2-------C5---C6  (feature / main 合并点)
```

git rebase

把当前分支的提交依次摘下，重新在目标分支的顶部重放

执行`git rebase main`（在feature分支）

git会把C3、C4临时保存为补丁，将`feature`指针指向C5，然后依次重新应用C3、C4

```plaintext
C1---C2---C5---C3'---C4'  (feature 变基到了 main 顶部)
```

## 分支管理

创建新分支并切换到该分支

```bash
git checkout -b <branch-name>
```

查看所有分支

```bash
git branch
```

查看远程分支

```bash
git branch -r
```

合并分支

```bash
git merge <branch-name>
```

删除分支

```bash
git branch -d <branch-name>
```

删除远程分支

```bash
git push origin --delete <branch-name>
```

## reset

让当前分支的HEAD、暂存区、工作区，回退到某个历史提交的状态

```
工作区
   ↓ git add
暂存区
   ↓ git commit
本地仓库
```

### --soft

```bash
git reset --soft HEAD~1
```

撤销最近一次commit，但是**代码保留，而且放在暂存区**

也就是你可以直接重新`commit`

### --mixed

默认行为

```bash
git reset HEAD~1

git reset --mixed HEAD~1
```

撤销`commit`，同时取消`git add`，但**代码本身保留**

### --hard

最危险

```bash
git reset --hard HEAD~1
```

`commit`回退，暂存区回退，工作区代码也直接回退

### HEAD~1

```bash
git reset --soft HEAD~1
```

`HEAD`表示当前所在提交，`HEAD~3`表示上上上个提交。

```
A ← B ← C ← D
            ↑
           HEAD
```

相当于直接回退到`A`提交的状态

也可以直接指定commit

```bash
git log --oneline
```

查看hash值后，直接指定commit

## revert

新增一个提交，把某次提交的修改抵消掉

如果已经上传上去后，别的人已经基于这个提交做了修改，直接把提交干掉，会产生很多麻烦

### git revert HEAD

撤销最新的一次提交

```
C：
修改了 a.java
增加了 b.java
删除了 c.java
```

那么`revert C`会尝试

```
恢复 a.java
删除 b.java
恢复 c.java
```

这个和`HEAD~1`不一样

```
HEAD     = C
HEAD~1   = B
HEAD~2   = A
```

### 选择

```
                 我要撤销修改
                       │
              ┌────────┴────────┐
              │                 │
        还没有 push          已经 push
              │                 │
        reset 很方便       公共分支？
              │                 │
              │          ┌──────┴──────┐
              │          │             │
              │         是             否
              │          │             │
              │        revert       看情况
              │
          reset
```

## workflow

假如你要开发新功能，通常从`main`分支切出一个新分支，例如`feature`分支，然后在`feature`分支上开发新功能。
开发完成后，合并`feature`分支到`main`分支。
最后，删除`feature`分支。

## commit template

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
