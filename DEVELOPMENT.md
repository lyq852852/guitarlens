# GuitarLens - 正式开发指南

## 项目概况

**GuitarLens** 是一款 AI 驱动的吉他扒带软件，能够自动分离吉他轨、识别音符和弦、生成可编辑谱面。

- **版本**: 0.4.0
- **状态**: 正式开发中
- **许可证**: MIT
- **开发者**: Mac

## 开发环境设置

### 前置要求

```bash
# 检查 Node.js
node --version  # 需要 16+

# 检查 npm
npm --version   # 需要 8+

# 检查 Python
python3 --version  # 需要 3.8+

# 检查 Git
git --version
```

### 安装依赖

```bash
# 进入项目目录
cd /Users/satanl/.qclaw/workspace/GuitarLens

# 安装 npm 依赖
npm install

# 安装 Python 依赖
pip install -r requirements.txt
```

## 项目结构

```
GuitarLens/
├── src/                    # React 源代码
│   ├── components/         # React 组件
│   ├── utils/              # 工具函数
│   ├── styles/             # 样式文件
│   ├── App.tsx             # 主应用
│   └── index.tsx           # 入口文件
├── electron/               # Electron 主进程
│   ├── main.js             # 主进程
│   └── preload.js          # 预加载脚本
├── python/                 # Python 音频处理
│   ├── engine.py           # 核心引擎
│   └── test_engine.py      # 测试脚本
├── build/                  # 构建资源
│   ├── icon.png            # 应用图标
│   └── entitlements.mac.plist
├── public/                 # 静态资源
│   └── index.html          # HTML 模板
├── dist/                   # 构建输出
├── package.json            # npm 配置
├── tsconfig.json           # TypeScript 配置
├── webpack.config.js       # Webpack 配置
├── electron-builder.json   # 打包配置
└── requirements.txt        # Python 依赖
```

## 开发工作流

### 1. 启动开发服务器

```bash
# 启动 React 开发服务器 + Electron
npm start

# 或分别启动
npm run react-start      # 启动 React
npm run electron-start   # 启动 Electron
```

### 2. 开发代码

#### 前端开发 (React + TypeScript)

```bash
# 编辑 src/ 目录下的文件
# 自动热重载

# 常见文件:
src/App.tsx              # 主应用组件
src/components/          # 组件库
src/utils/               # 工具函数
src/styles/              # 样式
```

#### 后端开发 (Python)

```bash
# 编辑 python/ 目录下的文件
python engine.py <audio_file>  # 测试

# 常见文件:
python/engine.py         # 核心引擎
python/test_engine.py    # 测试脚本
```

### 3. 构建应用

```bash
# 构建 React
npm run build

# 构建 Electron
npm run electron-build

# 生成安装文件
npm run dist-all         # 所有平台
npm run dist-mac         # 仅 Mac
npm run dist-win         # 仅 Windows
```

### 4. 测试

```bash
# 运行功能测试
bash ~/Desktop/GuitarLens_v0.4.0/RUN_TEST.sh

# 运行单元测试
npm test

# 运行 Python 测试
python python/test_engine.py
```

## 核心功能模块

### 1. 音频处理引擎 (Python)

**文件**: `python/engine.py`

**功能**:
- 音轨分离 (Demucs)
- 音高识别 (basic-pitch)
- 和弦识别
- BPM 检测

**使用**:
```python
from engine import GuitarLensEngine

engine = GuitarLensEngine()
result = engine.process_audio('song.mp3')
# 返回 JSON 格式的结果
```

### 2. 谱面渲染系统 (React + TypeScript)

**文件**: `src/components/ScoreViewer.tsx`

**功能**:
- 六线谱 (Tab) 显示
- 五线谱 (Staff) 显示
- 和弦图显示
- 多视图切换

**使用**:
```tsx
<ScoreViewer 
  notes={notes}
  chords={chords}
  viewMode="tab"
  onNoteClick={handleNoteClick}
/>
```

### 3. 编辑功能系统 (React + TypeScript)

**文件**: `src/components/ScoreEditor.tsx`

**功能**:
- 音符编辑
- 和弦编辑
- 撤销/重做
- 快捷键支持

**使用**:
```tsx
const { state, dispatch } = useEditor();
dispatch({ type: 'ADD_NOTE', payload: note });
dispatch({ type: 'UNDO' });
```

### 4. 导出功能 (React + Python)

**文件**: `src/utils/exportUtils.ts`

**功能**:
- PDF 导出
- MusicXML 导出
- GuitarPro 导出

**使用**:
```typescript
export async function exportToPDF(score: Score): Promise<Blob> {
  // 生成 PDF
}
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm start` | 启动开发模式 |
| `npm run build` | 构建 React 应用 |
| `npm run dist-all` | 生成所有平台安装文件 |
| `npm test` | 运行测试 |
| `npm run lint` | 代码检查 |
| `npm run format` | 代码格式化 |

## 代码规范

### TypeScript

```typescript
// 使用类型注解
interface Note {
  pitch: number;
  duration: number;
  string: number;
  fret: number;
}

// 使用 const 和 let
const MAX_FRET = 24;
let currentNote: Note | null = null;

// 使用箭头函数
const handleClick = (note: Note) => {
  // ...
};
```

### Python

```python
# 使用类型提示
from typing import List, Dict

def process_audio(file_path: str) -> Dict[str, any]:
    """处理音频文件"""
    pass

# 使用 docstring
class GuitarLensEngine:
    """吉他扒带引擎"""
    pass
```

## 调试技巧

### 前端调试

```bash
# 启用 DevTools
npm start

# 在应用中按 Ctrl+Shift+I (Windows) 或 Cmd+Option+I (Mac)
```

### 后端调试

```bash
# 启用 Python 调试
python -m pdb python/engine.py

# 或使用 print 调试
print(f"Debug: {variable}")
```

## 常见问题

### Q: 应用启动很慢？
A: 首次启动需要下载模型文件（~1.5 GB），请耐心等待。

### Q: 如何修改应用图标？
A: 替换 `build/icon.png`，然后重新构建。

### Q: 如何添加新的导出格式？
A: 在 `src/utils/exportUtils.ts` 中添加新的导出函数。

### Q: 如何修改应用名称？
A: 修改 `package.json` 中的 `name` 和 `productName`。

## 发布流程

### 1. 更新版本

```bash
# 修改 package.json 中的 version
# 修改 CHANGELOG.md

npm version patch  # 0.4.0 -> 0.4.1
npm version minor  # 0.4.0 -> 0.5.0
npm version major  # 0.4.0 -> 1.0.0
```

### 2. 构建应用

```bash
npm run dist-all
```

### 3. 创建 GitHub Release

```bash
git tag v0.4.0
git push origin v0.4.0

# 在 GitHub 上创建 Release
# 上传 dist/ 中的文件
```

### 4. 发布到应用市场

- Mac App Store
- Windows Store
- 其他应用市场

## 性能优化

### 前端优化

- 使用 React.memo 避免不必要的重新渲染
- 使用 useMemo 缓存计算结果
- 使用 useCallback 缓存函数
- 代码分割和懒加载

### 后端优化

- 使用多进程处理音频
- 缓存模型文件
- 优化算法复杂度

## 安全性

- 不要在代码中硬编码密钥
- 使用环境变量存储敏感信息
- 定期更新依赖
- 进行安全审计

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件

## 联系方式

- Email: support@guitarlens.app
- Discord: https://discord.gg/guitarlens
- GitHub: https://github.com/guitarlens/guitarlens

---

**开发愉快！** 🎸
