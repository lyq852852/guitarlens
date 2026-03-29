# GuitarLens Phase 5 - 打包发布

## 📋 Phase 5 规划

### 目标
生成可在 Mac 和 Windows 上直接安装和运行的桌面应用。

### 核心任务
1. ✅ 配置 electron-builder
2. ✅ 生成 Mac 安装文件（.dmg）
3. ✅ 生成 Windows 安装文件（.exe）
4. ✅ 生成便携版（Portable）
5. ✅ 代码签名配置
6. ✅ 自动更新配置

### 打包配置

#### Mac 配置
```json
{
  "mac": {
    "target": ["dmg", "zip"],
    "category": "public.app-category.music",
    "icon": "build/icon.icns",
    "certificateFile": "path/to/cert.p12",
    "certificatePassword": "password"
  }
}
```

#### Windows 配置
```json
{
  "win": {
    "target": ["nsis", "portable"],
    "icon": "build/icon.ico",
    "certificateFile": "path/to/cert.pfx",
    "certificatePassword": "password"
  }
}
```

### 文件结构

```
GuitarLens/
├── build/
│   ├── icon.icns          # Mac 图标
│   ├── icon.ico           # Windows 图标
│   ├── icon.png           # 通用图标
│   └── background.png     # DMG 背景
│
├── dist/
│   ├── GuitarLens-0.4.0.dmg           # Mac 安装文件
│   ├── GuitarLens-0.4.0.exe           # Windows 安装文件
│   ├── GuitarLens-0.4.0-Portable.exe  # Windows 便携版
│   └── GuitarLens-0.4.0.zip           # Mac 便携版
│
└── electron-builder.json  # 打包配置
```

### 开发步骤

#### Step 1: 准备资源
- [ ] 生成应用图标（icns/ico/png）
- [ ] 生成 DMG 背景图
- [ ] 准备许可证文件

#### Step 2: 配置 electron-builder
- [ ] 更新 electron-builder.json
- [ ] 配置 Mac 签名
- [ ] 配置 Windows 签名
- [ ] 配置自动更新

#### Step 3: 构建应用
- [ ] 构建 Mac 版本（.dmg）
- [ ] 构建 Windows 版本（.exe）
- [ ] 构建便携版本

#### Step 4: 测试
- [ ] 测试 Mac 安装
- [ ] 测试 Windows 安装
- [ ] 测试便携版本
- [ ] 测试应用功能

#### Step 5: 优化
- [ ] 减小文件大小
- [ ] 优化启动速度
- [ ] 添加启动画面

### 预期时间
- Step 1-2: 1-2 小时
- Step 3-4: 1-2 小时
- Step 5: 30 分钟
- **总计**: 2.5-4.5 小时

### 成功标准
- ✅ 生成 Mac .dmg 文件
- ✅ 生成 Windows .exe 文件
- ✅ 生成 Windows 便携版
- ✅ 生成 Mac 便携版
- ✅ 应用可正常安装
- ✅ 应用可正常运行
- ✅ 所有功能可用

---

**开始时间**: 2026-03-27 23:17 GMT+8
**预计完成**: 2026-03-28 03:30 GMT+8
