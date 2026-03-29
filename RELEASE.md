# GuitarLens 发布指南

## 📦 打包和发布

### 快速开始

#### Mac 用户
```bash
# 生成 Mac 安装文件（.dmg）
npm run dist-mac

# 或生成所有格式
npm run dist-all
```

#### Windows 用户
```bash
# 生成 Windows 安装文件（.exe）
npm run dist-win

# 或生成所有格式
npm run dist-all
```

#### 跨平台
```bash
# 生成 Mac 和 Windows 安装文件
npm run dist-all
```

### 输出文件

打包完成后，安装文件会生成在 `dist/` 目录：

#### Mac
- `GuitarLens-0.4.0.dmg` - Mac 安装文件（推荐）
- `GuitarLens-0.4.0.zip` - Mac 便携版

#### Windows
- `GuitarLens-0.4.0.exe` - Windows 安装文件（推荐）
- `GuitarLens-0.4.0-Portable.exe` - Windows 便携版

### 安装说明

#### Mac 安装
1. 下载 `GuitarLens-0.4.0.dmg`
2. 双击打开 DMG 文件
3. 将 GuitarLens 拖到 Applications 文件夹
4. 在 Applications 中找到 GuitarLens 并双击运行

#### Windows 安装
1. 下载 `GuitarLens-0.4.0.exe`
2. 双击运行安装程序
3. 按照提示完成安装
4. 在开始菜单或桌面找到 GuitarLens 快捷方式

#### 便携版使用
1. 下载便携版文件
2. 解压或直接运行
3. 无需安装，可在任何地方运行

### 系统要求

#### Mac
- macOS 10.13 或更高版本
- Intel 或 Apple Silicon 处理器
- 2 GB RAM
- 2 GB 磁盘空间

#### Windows
- Windows 7 或更高版本
- Intel 或 AMD 处理器
- 2 GB RAM
- 2 GB 磁盘空间

### 代码签名（可选）

如果需要代码签名以通过 Gatekeeper（Mac）或 SmartScreen（Windows）：

#### Mac 签名
```bash
# 设置环境变量
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate_password"

# 打包
npm run dist-mac
```

#### Windows 签名
```bash
# 在 electron-builder.json 中配置
{
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "certificate_password"
  }
}

# 打包
npm run dist-win
```

### 自动更新

GuitarLens 支持自动更新。要启用自动更新：

1. 在 GitHub 上创建 Release
2. 上传安装文件到 Release
3. 应用会自动检查更新

### 故障排除

#### 打包失败
```bash
# 清理缓存
rm -rf dist node_modules

# 重新安装依赖
npm install

# 重新打包
npm run dist
```

#### 应用无法启动
- 检查 Python 环境是否正确配置
- 检查 Demucs 模型是否已下载
- 查看应用日志（`~/.guitarlens/logs/`）

#### 文件过大
- 使用便携版（更小）
- 删除不需要的模型文件
- 使用压缩工具进一步压缩

### 发布到应用市场

#### Mac App Store
1. 获取 Apple Developer 账户
2. 创建应用 ID
3. 配置代码签名
4. 提交应用审核

#### Windows Store
1. 获取 Microsoft Partner 账户
2. 创建应用
3. 上传 MSIX 包
4. 提交应用审核

### 版本管理

更新版本号：

```bash
# 在 package.json 中更新版本
{
  "version": "0.5.0"
}

# 在 electron-builder.json 中更新版本
{
  "version": "0.5.0"
}

# 创建 Git 标签
git tag v0.5.0
git push origin v0.5.0
```

### 发布清单

- [ ] 更新版本号
- [ ] 更新 CHANGELOG
- [ ] 测试应用功能
- [ ] 生成安装文件
- [ ] 测试安装过程
- [ ] 创建 GitHub Release
- [ ] 上传安装文件
- [ ] 发布公告

---

**更新时间**: 2026-03-28 00:30 GMT+8
