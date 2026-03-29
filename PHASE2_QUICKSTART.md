# Phase 2 快速启动指南

## 🚀 3 步启动应用

### 1️⃣ 安装依赖
```bash
cd /Users/satanl/.qclaw/workspace/GuitarLens
npm install
```

### 2️⃣ 启动开发服务器
```bash
npm start
```

### 3️⃣ 应用启动
- Electron 窗口会自动打开
- React 开发服务器运行在 http://localhost:3000
- 开发者工具已启用

---

## 📋 可用命令

```bash
# 启动开发模式（Electron + React）
npm start

# 仅启动 React 开发服务器
npm run react-start

# 构建 React 应用
npm run react-build

# 启动 Electron（需要先构建 React）
npm run electron-start

# 开发模式（并发运行 React + Electron）
npm run electron-dev

# 构建并打包应用
npm run build

# 打包成 DMG（Mac）
npm run electron-build

# 运行 Python 测试
npm test
```

---

## 🎯 功能演示

### 1. 上传音频
- 拖拽音频文件到上传区
- 或点击选择文件

### 2. 查看波形
- 波形自动显示
- 可以点击波形跳转到指定位置

### 3. 播放音频
- 点击播放按钮
- 使用进度条拖拽

### 4. 处理音频
- 点击 "Process Audio" 按钮
- 查看处理进度
- 等待结果显示

### 5. 查看结果
- BPM 和调性
- 识别的音符列表
- 分离的音轨文件路径

---

## 🔧 开发提示

### 修改 UI
编辑 `src/App.css` 和 `src/styles/components.css`

### 添加新组件
1. 在 `src/components/` 创建新文件
2. 在 `src/App.tsx` 导入并使用

### 修改 Electron 主进程
编辑 `electron/main.js`

### 修改 IPC 通信
编辑 `electron/preload.js` 和 `electron/main.js`

---

## 🐛 常见问题

**Q: npm install 失败？**
A: 尝试清除缓存：`npm cache clean --force`

**Q: Electron 窗口不显示？**
A: 检查控制台错误，确保 React 已构建

**Q: Python 处理失败？**
A: 确保 Python 3.8+ 已安装，依赖已安装

**Q: 波形不显示？**
A: 检查音频文件格式是否支持

---

## 📦 打包应用

### Mac DMG
```bash
npm run electron-build
```

输出文件：`dist/GuitarLens-0.2.0.dmg`

### Windows EXE
```bash
npm run electron-build
```

输出文件：`dist/GuitarLens Setup 0.2.0.exe`

---

## 🎨 自定义主题

编辑 `src/App.css` 中的颜色变量：

```css
/* 修改渐变色 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 修改主色 */
color: #667eea;
```

---

## 📚 文档

- **API 文档**: `API.md`
- **项目结构**: `PROJECT_STRUCTURE.md`
- **Phase 2 完成**: `PHASE2_COMPLETE.md`

---

**祝你使用愉快！** 🎸✨

---

**GuitarLens v0.2.0**  
**开发者**: Mac  
**许可证**: MIT
