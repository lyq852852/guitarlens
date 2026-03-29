# GuitarLens - 开发者快速参考

## 🚀 5 分钟快速开始

### 1. 环境检查

```bash
node --version    # 需要 16+
npm --version     # 需要 8+
python3 --version # 需要 3.8+
```

### 2. 安装依赖

```bash
cd /Users/satanl/.qclaw/workspace/GuitarLens
npm install
pip install -r requirements.txt
```

### 3. 启动开发

```bash
npm start
```

### 4. 打开应用

应用会自动在 http://localhost:3000 打开

### 5. 开始编码

编辑 `src/` 目录下的文件，自动热重载

## 📁 项目结构速查

```
src/
├── App.tsx              # 主应用
├── components/          # React 组件
│   ├── AudioUpload.tsx
│   ├── Player.tsx
│   ├── ScoreViewer.tsx
│   ├── ScoreEditor.tsx
│   └── ...
├── utils/               # 工具函数
│   ├── noteToTab.ts
│   ├── chordRecognizer.ts
│   ├── scoreConverter.ts
│   └── ...
└── styles/              # 样式
    └── App.css

electron/
├── main.js              # 主进程
└── preload.js           # 预加载脚本

python/
├── engine.py            # 核心引擎
└── test_engine.py       # 测试

build/
├── icon.png             # 应用图标
└── entitlements.mac.plist
```

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm start` | 启动开发模式 |
| `npm run build` | 构建应用 |
| `npm test` | 运行测试 |
| `npm run lint` | 代码检查 |
| `npm run dist-all` | 生成安装文件 |

## 💻 前端开发

### 添加新组件

```tsx
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

### 添加新工具函数

```typescript
// src/utils/myUtils.ts
export function myFunction(input: string): string {
  return input.toUpperCase();
}

export interface MyInterface {
  id: number;
  name: string;
}
```

### 使用 Tailwind CSS

```tsx
<div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
  <h1 className="text-2xl font-bold text-white">Title</h1>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Click me
  </button>
</div>
```

## 🐍 后端开发

### 修改音频处理

```python
# python/engine.py
class GuitarLensEngine:
    def process_audio(self, file_path: str) -> Dict:
        # 你的代码
        pass
```

### 测试音频处理

```bash
python python/engine.py test_audio.mp3
```

## 🧪 测试

### 运行所有测试

```bash
npm test
bash ~/Desktop/GuitarLens_v0.4.0/RUN_TEST.sh
```

### 运行特定测试

```bash
npm test -- --testNamePattern="MyTest"
```

## 🐛 调试

### 前端调试

```bash
# 启动开发模式
npm start

# 打开 DevTools
Cmd + Option + I (Mac)
Ctrl + Shift + I (Windows)
```

### 后端调试

```bash
# 启用 Python 调试
python -m pdb python/engine.py

# 或使用 print
print(f"Debug: {variable}")
```

## 📦 构建和发布

### 构建应用

```bash
npm run build
```

### 生成安装文件

```bash
npm run dist-all      # 所有平台
npm run dist-mac      # 仅 Mac
npm run dist-win      # 仅 Windows
```

### 发布版本

```bash
npm version minor     # 0.4.0 -> 0.5.0
npm run dist-all
git tag v0.5.0
git push origin v0.5.0
```

## 📝 代码规范

### TypeScript

```typescript
// ✅ 好的做法
interface User {
  id: number;
  name: string;
}

const getUser = (id: number): User => {
  // ...
};

// ❌ 避免
const getUser = (id) => {
  // ...
};
```

### Python

```python
# ✅ 好的做法
def process_audio(file_path: str) -> Dict[str, Any]:
    """处理音频文件"""
    pass

# ❌ 避免
def process_audio(file_path):
    pass
```

## 🔗 重要链接

- **项目位置**: `/Users/satanl/.qclaw/workspace/GuitarLens`
- **文档**: `DEVELOPMENT.md`, `WORKFLOW.md`
- **测试**: `~/Desktop/GuitarLens_v0.4.0/RUN_TEST.sh`
- **应用**: `~/Applications/GuitarLens.app`

## 🆘 常见问题

### Q: 应用启动失败？
A: 检查依赖是否安装：`npm install && pip install -r requirements.txt`

### Q: 代码没有热重载？
A: 检查文件是否保存，或重启开发服务器：`npm start`

### Q: 测试失败？
A: 运行 `npm test` 查看详细错误信息

### Q: 如何清理缓存？
A: 运行 `npm cache clean --force && rm -rf node_modules && npm install`

## 📚 学习资源

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Electron**: https://www.electronjs.org
- **Tailwind CSS**: https://tailwindcss.com
- **Python**: https://www.python.org

## 🎯 下一步

1. 阅读 `DEVELOPMENT.md` 了解详细信息
2. 阅读 `WORKFLOW.md` 了解工作流程
3. 查看 `src/` 目录下的代码
4. 运行 `npm start` 启动开发
5. 开始编码！

---

**祝你开发愉快！** 🎸
