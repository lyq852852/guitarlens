# GuitarLens Phase 2 - Electron 框架搭建

## 📋 Phase 2 规划

### 目标
搭建完整的 Electron 桌面应用框架，集成 Python 引擎，实现基础 UI 和音频播放功能。

### 核心功能
1. ✅ Electron + React 项目初始化
2. ✅ 音频文件导入（拖拽 + 文件选择）
3. ✅ 波形显示（WaveSurfer.js）
4. ✅ 音频播放器（播放/暂停/进度条）
5. ✅ Python 引擎集成（IPC 通信）
6. ✅ 处理进度显示
7. ✅ 结果展示（BPM、调性、音符列表）

### 项目结构

```
GuitarLens/
├── electron/                    # Electron 应用
│   ├── main.js                  # 主进程
│   ├── preload.js               # 预加载脚本
│   └── ipc/
│       └── handlers.js          # IPC 处理器
│
├── src/                         # React 前端
│   ├── App.tsx
│   ├── components/
│   │   ├── AudioUpload.tsx      # 文件上传
│   │   ├── Waveform.tsx         # 波形显示
│   │   ├── Player.tsx           # 播放器
│   │   ├── ProgressBar.tsx      # 进度条
│   │   └── ResultPanel.tsx      # 结果展示
│   ├── hooks/
│   │   ├── useAudio.ts          # 音频管理
│   │   └── useEngine.ts         # 引擎通信
│   ├── styles/
│   │   └── globals.css
│   └── index.tsx
│
├── public/
│   └── index.html
│
├── python/                      # Python 引擎（从 Phase 1 复制）
│   ├── engine.py
│   └── requirements.txt
│
├── package.json
├── tsconfig.json
├── webpack.config.js
└── electron-builder.json
```

### 技术栈

**前端**:
- Electron 27+
- React 18+
- TypeScript
- Tailwind CSS
- WaveSurfer.js（波形）
- shadcn/ui（组件库）

**后端**:
- Node.js（主进程）
- Python（音频处理）
- IPC（进程间通信）

### 开发步骤

#### Step 1: 项目初始化
- [ ] 创建 Electron + React 项目
- [ ] 配置 TypeScript
- [ ] 配置 Webpack
- [ ] 配置 Tailwind CSS

#### Step 2: 基础 UI
- [ ] 创建主窗口
- [ ] 设计布局（上传区 + 波形 + 播放器 + 结果）
- [ ] 实现响应式设计

#### Step 3: 音频处理
- [ ] 实现文件上传（拖拽 + 选择）
- [ ] 集成 WaveSurfer.js
- [ ] 实现音频播放器

#### Step 4: Python 集成
- [ ] 配置 IPC 通信
- [ ] 实现 Python 子进程调用
- [ ] 处理进度反馈

#### Step 5: 结果展示
- [ ] 显示 BPM、调性
- [ ] 显示音符列表
- [ ] 显示分离的音轨

#### Step 6: 打包测试
- [ ] 配置 electron-builder
- [ ] 生成 .dmg（Mac）
- [ ] 测试应用

### 预期时间
- Step 1-2: 2-3 小时
- Step 3-4: 3-4 小时
- Step 5-6: 2-3 小时
- **总计**: 7-10 小时

### 成功标准
- ✅ 应用能正常启动
- ✅ 能导入音频文件
- ✅ 能显示波形
- ✅ 能播放音频
- ✅ 能调用 Python 引擎
- ✅ 能显示处理结果
- ✅ 能打包成 .dmg

---

**开始时间**: 2026-03-27 22:48 GMT+8
**预计完成**: 2026-03-28 06:00 GMT+8
