# GuitarLens v0.5.0 API 文档

## Python 音频处理引擎

### GuitarLensEngine

```python
from python.engine_v2 import GuitarLensEngine

engine = GuitarLensEngine(
    cache_dir='~/.guitarlens/cache',  # 可选，缓存目录
    log_level='INFO'                  # 可选：DEBUG / INFO / WARNING / ERROR
)
```

---

### `process_audio(file_path, progress_callback, use_cache)`

处理音频文件，返回分析结果。

**参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file_path` | `str` | 必填 | 音频文件路径 |
| `progress_callback` | `Callable[[float], None]` | `None` | 进度回调（0.0–1.0） |
| `use_cache` | `bool` | `True` | 是否使用缓存 |

**返回值**

```python
{
    "bpm": 120.5,           # 每分钟节拍数
    "key": "C",             # 调性
    "duration": 183.4,      # 时长（秒）
    "sample_rate": 44100,   # 采样率
    "timestamp": "2026-03-29T18:00:00",
    "notes": [
        {
            "pitch": 440.0,       # 频率（Hz）
            "midi_note": 69,      # MIDI 音符号（0–127）
            "start_time": 0.0,    # 开始时间（秒）
            "duration": 0.5,      # 时值（秒）
            "string": 1,          # 弦（1–6，1 为最细弦）
            "fret": 5,            # 品位（0–24）
            "confidence": 0.95    # 置信度（0–1）
        },
        ...
    ],
    "chords": [
        {
            "name": "C",          # 和弦名称
            "start_time": 0.0,    # 开始时间（秒）
            "duration": 1.0,      # 时值（秒）
            "notes": [60, 64, 67],# 组成音（MIDI）
            "confidence": 0.88    # 置信度（0–1）
        },
        ...
    ]
}
```

**示例**

```python
def on_progress(p):
    print(f"{p*100:.0f}%")

result = engine.process_audio(
    "song.mp3",
    progress_callback=on_progress,
    use_cache=True
)

print(f"BPM: {result['bpm']:.1f}")
print(f"Key: {result['key']}")
print(f"Notes: {len(result['notes'])}")
```

---

### `get_cache_stats()`

返回缓存统计信息。

```python
stats = engine.get_cache_stats()
# {
#   "cache_dir": "/Users/xxx/.guitarlens/cache",
#   "cache_count": 12,
#   "total_size": 5242880,
#   "total_size_mb": 5.0
# }
```

---

### `clear_cache()`

清空所有缓存文件。

```python
engine.clear_cache()
```

---

## React 组件 API

### `<ScoreViewer />`

谱面查看器主组件。

```tsx
import { ScoreViewer } from './components/ScoreViewer_v2';

<ScoreViewer
  notes={notes}           // Note[]  必填
  chords={chords}         // Chord[] 必填
  viewMode="tab"          // 'tab' | 'staff' | 'both' | 'chords'
  currentTime={0}         // number  当前播放时间（秒）
  isPlaying={false}       // boolean 是否正在播放
  onNoteClick={fn}        // (note: Note) => void
  onChordClick={fn}       // (chord: Chord) => void
/>
```

---

### `<ProgressBar />`

进度条组件。

```tsx
import { ProgressBar } from './components/ProgressBar';

<ProgressBar
  progress={75}           // number  0–100
  isVisible={true}        // boolean
  label="处理中..."       // string  可选标签
  animated={true}         // boolean 是否显示动画
/>
```

---

### `<ErrorBoundary />`

错误边界组件，捕获子组件异常。

```tsx
import { ErrorBoundary } from './components/ErrorBoundary';

<ErrorBoundary
  fallback={(error, retry) => (
    <div>
      <p>{error.message}</p>
      <button onClick={retry}>重试</button>
    </div>
  )}
>
  <ScoreViewer ... />
</ErrorBoundary>
```

---

### `<ToastContainer />`

通知容器组件。

```tsx
import { ToastContainer, useToast } from './components/Toast';

function App() {
  const { toasts, removeToast, success, error } = useToast();

  return (
    <>
      <button onClick={() => success('操作成功！')}>测试</button>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
```

---

## React Hooks API

### `useAsync(options)`

管理异步操作状态。

```typescript
import { useAsync } from './hooks/useAsync';

const { isLoading, error, progress, execute, setProgress } = useAsync({
  onSuccess: (data) => console.log('成功', data),
  onError: (err) => console.error('失败', err),
  onProgress: (p) => console.log(`进度: ${p}%`),
});

// 执行异步操作
await execute(async () => {
  setProgress(50);
  return await processAudio('song.mp3');
});
```

---

### `useTheme(initialTheme?)`

主题管理。

```typescript
import { useTheme } from './hooks/useTheme';

const { theme, isDark, toggleTheme, setDarkMode } = useTheme('auto');
// theme: 'auto' | 'light' | 'dark'
// isDark: boolean

toggleTheme();        // auto → light → dark → auto
setDarkMode(true);    // 直接设置深色模式
```

---

### `useResponsive()`

响应式屏幕信息。

```typescript
import { useResponsive, useMediaQuery } from './hooks/useResponsive';

const { width, height, size, deviceType, isMobile, isTablet, isDesktop } = useResponsive();

const isSmall = useMediaQuery('(max-width: 768px)');
```

---

## 数据类型定义

```typescript
interface Note {
  pitch: number;       // 频率（Hz）
  midi_note: number;   // MIDI 音符号（0–127）
  start_time: number;  // 开始时间（秒）
  duration: number;    // 时值（秒）
  string: number;      // 弦（1–6）
  fret: number;        // 品位（0–24）
  confidence: number;  // 置信度（0–1）
}

interface Chord {
  name: string;        // 和弦名称，如 "Am7"
  start_time: number;  // 开始时间（秒）
  duration: number;    // 时值（秒）
  notes: number[];     // 组成音（MIDI 音符号）
  confidence: number;  // 置信度（0–1）
}

type ViewMode = 'tab' | 'staff' | 'both' | 'chords';
type Theme = 'light' | 'dark' | 'auto';
type ToastType = 'success' | 'error' | 'warning' | 'info';
```

---

## IPC 通信（Electron）

主进程与渲染进程通过 IPC 通信：

```javascript
// 渲染进程 → 主进程
window.electronAPI.processAudio(filePath, (progress) => {
  console.log(`进度: ${progress}%`);
});

// 主进程 → 渲染进程（通过 preload.js 暴露）
// electron/preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  processAudio: (filePath, onProgress) =>
    ipcRenderer.invoke('process-audio', filePath, onProgress),
  exportPDF: (scoreData) =>
    ipcRenderer.invoke('export-pdf', scoreData),
  saveProject: (projectData) =>
    ipcRenderer.invoke('save-project', projectData),
  loadProject: (filePath) =>
    ipcRenderer.invoke('load-project', filePath),
});
```
