# GuitarLens v0.5.0 构建产物指南

## 当前状态

- ✅ 代码已推送到 Gitee
- ✅ Release v0.5.0 已创建
- ⏳ 需要构建 DMG/EXE 安装包

---

## 构建方法

### 方法 1：在有更多内存的机器上构建（推荐）

**要求**：8GB+ 内存

```bash
# 1. 克隆仓库
git clone https://gitee.com/ubiee/guitarlens.git
cd guitarlens

# 2. 切换到 v0.5.0 tag
git checkout v0.5.0

# 3. 运行构建脚本
./build.sh
```

**构建产物位置**：
- macOS: `dist/GuitarLens-0.5.0.dmg`
- macOS: `dist/GuitarLens-0.5.0-mac.zip`
- Windows: `dist/GuitarLens-0.5.0-Setup.exe`
- Windows: `dist/GuitarLens-0.5.0-win.zip`

---

### 方法 2：使用 GitHub Actions 自动构建

**步骤**：

1. 在 GitHub 创建仓库 `guitarlens`
2. 推送代码：
   ```bash
   git remote add github https://github.com/YOUR_USERNAME/guitarlens.git
   git push github master
   git push github v0.5.0
   ```
3. GitHub Actions 自动构建（约 10-15 分钟）
4. 下载构建产物
5. 上传到 Gitee Release

---

### 方法 3：使用 Docker 构建

```bash
# 拉取 Node.js 镜像
docker run --rm -it -v $(pwd):/app -w /app node:20 bash

# 在容器内执行
./build.sh
```

---

## 上传构建产物到 Gitee Release

1. 访问: https://gitee.com/ubiee/guitarlens/releases
2. 编辑 v0.5.0 Release
3. 上传构建产物：
   - `GuitarLens-0.5.0.dmg`
   - `GuitarLens-0.5.0-mac.zip`
   - `GuitarLens-0.5.0-Setup.exe`
   - `GuitarLens-0.5.0-win.zip`
4. 保存

---

## 项目统计

| 指标 | 数值 |
|------|------|
| 开发时间 | 4.4 小时 |
| 文件数 | 100 |
| 代码行数 | 16063 |
| Phase | 9/9 完成 |

---

**GuitarLens v0.5.0 开发完成！** 🎸
