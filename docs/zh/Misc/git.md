# git

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

本地未推送的提交，撤销提交保留修改

```bash
git reset --soft HEAD~1
```

如果已经`git push`到远程仓库，不要使用`reset`

```bash
git revert HEAD
```

- 生成一个新的提交，内容正好是撤销最近一次提交的改动
