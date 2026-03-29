# GuitarLens - 开发工作流程

## 日常开发流程

### 早上开始

```bash
# 1. 进入项目目录
cd /Users/satanl/.qclaw/workspace/GuitarLens

# 2. 更新代码
git pull origin main

# 3. 安装依赖（如果有更新）
npm install
pip install -r requirements.txt

# 4. 启动开发服务器
npm start
```

### 开发中

```bash
# 编辑代码
# src/ 目录下的文件会自动热重载
# python/ 目录下的文件需要手动重启

# 查看实时日志
npm run logs

# 打开 DevTools
Cmd + Option + I (Mac)
Ctrl + Shift + I (Windows)
```

### 提交代码

```bash
# 1. 查看修改
git status
git diff

# 2. 添加文件
git add .

# 3. 提交
git commit -m "feat: 添加新功能"

# 4. 推送
git push origin feature-branch
```

### 晚上结束

```bash
# 1. 运行测试
npm test
bash ~/Desktop/GuitarLens_v0.4.0/RUN_TEST.sh

# 2. 构建应用
npm run build

# 3. 提交代码
git add .
git commit -m "chore: 日常提交"
git push origin main
```

## 功能开发流程

### 1. 创建特性分支

```bash
git checkout -b feature/new-feature
```

### 2. 开发功能

```bash
# 编辑代码
# 测试功能
npm start

# 运行测试
npm test
```

### 3. 提交代码

```bash
git add .
git commit -m "feat: 实现新功能"
```

### 4. 创建 Pull Request

```bash
git push origin feature/new-feature

# 在 GitHub 上创建 PR
# 等待代码审查
# 合并到 main
```

## Bug 修复流程

### 1. 创建 Bug 分支

```bash
git checkout -b bugfix/bug-name
```

### 2. 修复 Bug

```bash
# 编辑代码
# 测试修复
npm start

# 运行测试
npm test
```

### 3. 提交代码

```bash
git add .
git commit -m "fix: 修复 Bug"
```

### 4. 创建 Pull Request

```bash
git push origin bugfix/bug-name

# 在 GitHub 上创建 PR
# 等待代码审查
# 合并到 main
```

## 版本发布流程

### 1. 准备发布

```bash
# 更新版本号
npm version minor  # 0.4.0 -> 0.5.0

# 更新 CHANGELOG
# 编辑 CHANGELOG.md

# 提交版本更新
git add .
git commit -m "chore: 发布 v0.5.0"
```

### 2. 构建应用

```bash
# 构建 React
npm run build

# 生成安装文件
npm run dist-all
```

### 3. 创建 Release

```bash
# 创建 Git tag
git tag v0.5.0

# 推送 tag
git push origin v0.5.0

# 在 GitHub 上创建 Release
# 上传 dist/ 中的文件
```

### 4. 发布应用

```bash
# 上传到应用市场
# Mac App Store
# Windows Store
# 其他应用市场
```

## 代码审查流程

### 作为提交者

1. 创建 PR
2. 填写 PR 描述
3. 等待审查
4. 根据反馈修改代码
5. 合并 PR

### 作为审查者

1. 查看代码变更
2. 检查代码质量
3. 检查测试覆盖
4. 提供反馈
5. 批准或请求修改

## 测试流程

### 单元测试

```bash
npm test
```

### 集成测试

```bash
npm run test:integration
```

### 功能测试

```bash
bash ~/Desktop/GuitarLens_v0.4.0/RUN_TEST.sh
```

### 手动测试

1. 启动应用
2. 上传音频文件
3. 处理音频
4. 查看结果
5. 编辑谱面
6. 导出文件

## 性能测试

```bash
# 启用性能分析
npm run start:profile

# 查看性能报告
npm run analyze
```

## 安全审计

```bash
# 检查依赖安全性
npm audit

# 修复安全问题
npm audit fix
```

## 文档更新流程

### 更新文档

```bash
# 编辑 .md 文件
# 提交更改
git add .
git commit -m "docs: 更新文档"
git push origin main
```

### 发布文档

```bash
# 构建文档网站
npm run docs:build

# 部署文档
npm run docs:deploy
```

## 问题排查流程

### 1. 收集信息

- 错误信息
- 操作步骤
- 系统信息
- 日志文件

### 2. 复现问题

```bash
# 启用调试模式
npm start --debug

# 查看日志
tail -f ~/Library/Logs/GuitarLens/app.log
```

### 3. 分析问题

- 查看代码
- 查看日志
- 使用 DevTools

### 4. 修复问题

```bash
# 创建 bugfix 分支
git checkout -b bugfix/issue-name

# 修复代码
# 测试修复
# 提交代码
```

## 性能优化流程

### 1. 分析性能

```bash
npm run analyze
```

### 2. 识别瓶颈

- 使用 Chrome DevTools
- 使用 Python Profiler

### 3. 优化代码

- 减少重新渲染
- 缓存计算结果
- 优化算法

### 4. 验证改进

```bash
npm run benchmark
```

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `npm start` | 启动开发模式 |
| `npm run build` | 构建应用 |
| `npm test` | 运行测试 |
| `npm run lint` | 代码检查 |
| `npm run format` | 代码格式化 |
| `npm run dist-all` | 生成安装文件 |
| `git status` | 查看状态 |
| `git add .` | 添加文件 |
| `git commit -m "msg"` | 提交代码 |
| `git push` | 推送代码 |
| `git pull` | 拉取代码 |

## 最佳实践

### 代码提交

- 提交前运行测试
- 提交信息要清晰
- 一次提交一个功能
- 避免大型提交

### 代码审查

- 及时审查代码
- 提供建设性反馈
- 批准前确保质量
- 记录审查意见

### 文档

- 及时更新文档
- 保持文档准确
- 添加代码注释
- 编写 API 文档

### 测试

- 编写单元测试
- 编写集成测试
- 进行手动测试
- 测试覆盖率 > 80%

---

**开发愉快！** 🎸
