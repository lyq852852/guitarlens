# GuitarLens v0.5.0 - 发布部署指南

## 发布前准备

### 1. 开发环境要求

| 工具 | 版本 | 说明 |
|------|------|------|
| Node.js | 20.x LTS | 必需 |
| npm | 10.x | 必需 |
| Python | 3.8+ | 必需 |
| Git | 2.x | 必需 |

### 2. 安装依赖

```bash
cd /Users/satanl/.qclaw/workspace/GuitarLens

# 安装 Node.js 依赖
npm install --legacy-peer-deps

# 安装 Python 依赖
pip3 install -r requirements.txt
```

> 注意：`--legacy-peer-deps` 用于解决 react-scripts 和 TypeScript 的 peer dependency 冲突。

### 3. 本地开发

```bash
# 启动开发服务器
npm start
```

应用会在 http://localhost:3000 打开。

### 4. 构建

```bash
# 构建 React 应用
npm run build

# 打包 macOS 应用
npm run dist-mac

# 打包 Windows 应用
npm run dist-win

# 打包全平台
npm run dist-all
```

### 5. 测试

```bash
# 单元测试 + 集成测试
npm test

# E2E 测试（需要先运行 npm start）
npm run test:e2e

# 测试覆盖率
npm run test:coverage
```

---

## 发布流程

### macOS

1. 运行 `npm run dist-mac`
2. 输出文件：`dist/GuitarLens-0.5.0.dmg`
3. 测试安装：
   - 双击 DMG 挂载
   - 拖拽到 Applications
   - 从 Launchpad 启动
   - 首次运行右键 → 打开（绕过 Gatekeeper）

### Windows

1. 运行 `npm run dist-win`
2. 输出文件：`dist/GuitarLens-0.5.0-Setup.exe`
3. 测试安装：
   - 双击运行安装程序
   - 按提示完成安装
   - 从开始菜单启动

---

## 首次运行注意事项

### AI 模型下载

首次启动时，应用会自动下载以下模型（约 1.5 GB）：

- `htdemucs_6s` — Demucs 音轨分离模型
- `basic-pitch` — 音高识别模型

下载位置：`~/.guitarlens/models/`

确保：
- 网络连接稳定
- 磁盘空间充足（至少 5 GB）

---

## macOS 签名和公证（可选）

如果需要分发给其他用户，需要对应用进行签名和公证：

```bash
# 签名
codesign --deep --force --verify --verbose --sign "Developer ID Application: Your Name (TEAM_ID)" dist/mac-arm64/GuitarLens.app

# 公证
xcrun notarytool submit dist/GuitarLens-0.5.0.dmg --apple-id "your@email.com" --team-id "TEAM_ID" --password "app-specific-password" --wait

# Staple
xcrun stapler staple dist/GuitarLens-0.5.0.dmg
```

---

## GitHub Release

### 1. 创建 Tag

```bash
git tag v0.5.0
git push origin v0.5.0
```

### 2. 创建 Release

1. 打开 https://github.com/guitarlens/guitarlens/releases/new
2. 选择 tag: v0.5.0
3. Release title: `GuitarLens v0.5.0`
4. 描述内容来自 `RELEASE_NOTES.md`
5. 上传构建文件：
   - `GuitarLens-0.5.0.dmg`
   - `GuitarLens-0.5.0-mac.zip`
   - `GuitarLens-0.5.0-Setup.exe`
   - `GuitarLens-0.5.0-win.zip`
6. 点击 "Publish release"

---

## 发布后检查

- [ ] GitHub Release 页面正确显示
- [ ] 下载链接有效
- [ ] DMG 安装正常
- [ ] Windows 安装程序正常
- [ ] 首次启动模型下载正常
- [ ] 核心功能可用（上传、处理、查看、导出）
- [ ] 更新官网（如有）
- [ ] 发布公告（Discord、社交媒体）

---

## 故障排除

### npm install 失败

```bash
# 清除缓存
npm cache clean --force

# 删除现有 node_modules
rm -rf node_modules package-lock.json

# 使用 legacy-peer-deps
npm install --legacy-peer-deps
```

### Electron 下载失败

```bash
# 设置镜像
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/

# 重新安装
npm install --legacy-peer-deps
```

### 构建失败

```bash
# 检查 Node 版本
node --version  # 需要 16+

# 检查 Python 版本
python3 --version  # 需要 3.8+

# 清理并重建
rm -rf dist build node_modules
npm install --legacy-peer-deps
npm run build
```

---

## 联系方式

- **Email**: support@guitarlens.app
- **Discord**: https://discord.gg/guitarlens
- **GitHub Issues**: https://github.com/guitarlens/guitarlens/issues
