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

## git push -u

`-u`是`--set-upstream`的简写，推送的同时，把本地分支和远程分支**关联起来**

```bash
git push -u origin <branch-name>
```

第一次推送一个新分支时要带上`-u`，它做了两件事：

1. 把本地分支推送到远程的`origin/<branch-name>`
2. 记录这个本地分支的**上游分支**（upstream），也就是告诉git「以后这个本地分支对应哪个远程分支」

关联好之后，后续在这个分支上直接

```bash
git push

git pull
```

就行，不用再写`origin <branch-name>`，git会自动找到上游分支

查看本地分支和上游分支的对应关系

```bash
git branch -vv
```

输出里带`[origin/main]`的，就是已经关联过上游的分支

如果推送时看到

```plaintext
fatal: The current branch xxx has no upstream branch.
```

说明当前分支还没设置上游，加上`-u`重新推一次即可

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

## git switch

Git 2.23 引入的命令，专门用来切换分支，把原本`git checkout`里「切换分支」的职责单独拆出来，语义更清晰

切换分支

```bash
git switch <branch-name>
```

创建新分支并切换到该分支（相当于`git checkout -b`）

```bash
git switch -c <branch-name>
```

切回上一个分支

```bash
git switch -
```

### 和 checkout 的区别

| 命令           | 用途                             |
| -------------- | -------------------------------- |
| `git switch`   | 只用于切换分支                   |
| `git checkout` | 既能切换分支，也能恢复工作区文件 |

`git checkout <branch>`和`git checkout <file>`写法完全一样，容易误操作，所以官方把它拆成了`git switch`（切分支）和`git restore`（恢复文件）

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

这样做的好处是：`main`始终保持可用，功能没开发完也不会影响别人，出问题直接删掉分支就行

### 1. 切出功能分支

先让`main`保持在最新状态，再从它切出分支

```bash
git switch main

git pull

git switch -c feature
```

一定要先`pull`，如果基于过期的代码开发，合并时冲突会多很多

### 2. 开发并提交

```bash
git add .

git commit -m "✨ feat: 新增xxx功能"
```

提交粒度尽量小，一个提交只做一件事，这样出问题时用`revert`单独撤销某一个提交就行

### 3. 推送并关联上游

第一次推送要带`-u`

```bash
git push -u origin feature
```

### 4. 合并回 main

功能开发完、自测通过后，切回`main`合并

```bash
git switch main

git pull

git merge feature
```

如果在团队里协作，这一步通常是提一个 **PR / Merge Request**，由别人 review 后在平台上点合并，而不是自己本地`merge`完直接`push`

如果`main`上别人也改到了同一个文件的同一位置，这里就会冲突，解决方式见前面的`git pull`

不想要合并提交、希望历史是一条直线的话，可以改用`git rebase`

### 5. 推送 main

```bash
git push
```

### 6. 删除功能分支

合并完成后，`feature`的提交已经进到`main`里了，这个分支就没用了

删除本地分支

```bash
git branch -d feature
```

删除远程分支

```bash
git push origin --delete feature
```

`-d`是安全删除，如果分支还没合并会报错提醒你；确认真的不要了，可以用`-D`强制删除

### 整体流程

```plaintext
git switch main && git pull
git switch -c feature
        ↓ 开发、commit
git push -u origin feature
        ↓ 提 PR / code review
git switch main && git pull
git merge feature
git push
git branch -d feature
```

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
