# Git 基本命令

## 基础

```bash
git init                # 初始化本地仓库
git clone [git-url]    # 克隆远程仓库
```

## 配置

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 暂存/提交

```bash
git add .           # 暂存所有修改
git add [file_path] # 暂存指定文件
git commit -m "Commit message"  # 提交暂存的修改
```

## 查看修改

```bash
git status          # 查看当前分支状态
git diff            # 查看暂存区与工作目录的差异
git log             # 查看提交历史
```

## 管理分支

```bash
git branch          # 查看所有分支
git branch [branch-name]  # 创建新分支
git branch -a       # 查看所有远程分支
git checkout [branch-name]  # 切换到指定分支
git checkout -b [branch-name]  # 创建新分支并切换到它
git branch -d [branch-name]  # 删除本地分支
```

## 远程仓库

```bash
git remote add origin [git-url]  # 添加远程仓库
git remote -v # 列出所有远程仓库
git pull [remote-name] [branch-name]  # 从远程仓库拉取指定分支
git push -u [remote-name] [branch-name]  # 推送本地分支到远程仓库
```

## 取消修改

```bash
git reset --hard  HEAD~1  # 撤销最近的提交
git reset # 取消暂存的修改
```

## 合并

```bash
git merge [branch-name]  # 合并指定分支到当前分支
git rebase [branch-name]  # 重基当前分支到指定分支
git tag [tag-name]  # 创建标签
```
