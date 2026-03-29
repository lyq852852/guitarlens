# GuitarLens 快速开始指南

## 5 分钟快速上手

### 1️⃣ 安装依赖

```bash
# 进入项目目录
cd GuitarLens

# 安装 Python 依赖
pip install -r requirements.txt
```

**首次安装可能需要 5-10 分钟**（下载依赖包）

### 2️⃣ 准备音频文件

准备一个吉他歌曲，支持格式：
- MP3
- WAV
- FLAC
- OGG
- M4A

示例：`wonderwall.mp3`

### 3️⃣ 运行引擎

```bash
# 完整处理（分离 + 分析）
python engine.py wonderwall.mp3 --output ./output

# 或指定模式
python engine.py wonderwall.mp3 --output ./output --mode full
```

### 4️⃣ 查看结果

```bash
# 查看分离的音轨
ls -lh output/*.wav

# 查看分析结果
cat output/analysis_result.json | python -m json.tool
```

---

## 输出说明

### 分离的音轨

```
output/
├── guitar.wav      # ✅ 吉他轨（这是你需要的）
├── bass.wav        # 贝斯轨
├── drums.wav       # 鼓轨
├── vocals.wav      # 人声轨
└── other.wav       # 其他轨
```

### 分析结果 (analysis_result.json)

```json
{
  "input_file": "wonderwall.mp3",
  "output_dir": "./output",
  "tracks": {
    "guitar": "./output/guitar.wav",
    ...
  },
  "guitar_analysis": {
    "bpm": {
      "bpm": 87.5,
      "confidence": 0.8
    },
    "key": {
      "key": "Em",
      "confidence": 0.75
    },
    "pitch": {
      "notes": [
        {
          "start_time": 0.0,
          "end_time": 0.5,
          "pitch": 329.63,
          "note_name": "E4"
        },
        ...
      ]
    }
  }
}
```

---

## 常见问题

### ❓ 首次运行很慢？

**正常现象！** 首次运行会：
1. 下载 Demucs 模型 (~800MB)
2. 下载 basic-pitch 模型 (~50MB)
3. 处理音频（3-5 分钟）

**总耗时**: 10-20 分钟（首次）

### ❓ 识别不准确？

这是 Phase 1 的基础版本。后续会加入：
- 手动修正功能
- 更好的和弦识别
- 指位优化

### ❓ 内存不足？

Demucs 需要 ~2GB 内存。如果不足：
1. 关闭其他应用
2. 使用轻量级模型（后续版本）

### ❓ 支持哪些格式？

✅ 支持：MP3, WAV, FLAC, OGG, M4A, AAC  
❌ 不支持：MID, ABC, Tab 文本

---

## 下一步

### 现在你可以：

1. ✅ 分离吉他轨
2. ✅ 检测 BPM 和调性
3. ✅ 识别音符

### 即将推出（Phase 2-5）：

- 🎵 可视化谱面（GuitarPro 级别）
- ✏️ 手动编辑功能
- 📤 导出 PDF / GuitarPro
- 🎸 跟弹练习模式
- 🖥️ 完整桌面应用

---

## 进阶用法

### Python 脚本调用

```python
from engine import GuitarLensEngine

# 创建引擎
engine = GuitarLensEngine(output_dir="./my_output")

# 完整处理
result = engine.process_full_song("song.mp3")

# 访问结果
print(f"BPM: {result['guitar_analysis']['bpm']['bpm']}")
print(f"调性: {result['guitar_analysis']['key']['key']}")

# 访问音符
notes = result['guitar_analysis']['pitch']['notes']
for note in notes[:5]:  # 前 5 个音符
    print(f"{note['note_name']}: {note['start_time']:.2f}s")
```

### 仅分析吉他轨

```python
# 如果已经有分离好的吉他轨
result = engine.process_guitar_track("guitar.wav")
```

### 单独操作

```python
# 仅检测 BPM
bpm_info = engine.detect_bpm("song.mp3")
print(f"BPM: {bpm_info['bpm']}")

# 仅检测调性
key_info = engine.detect_key("song.mp3")
print(f"调性: {key_info['key']}")

# 仅检测音高
pitch_info = engine.detect_pitch("guitar.wav")
print(f"音符数: {len(pitch_info['notes'])}")
```

---

## 测试

运行测试脚本：

```bash
python test_engine.py
```

输出示例：
```
============================================================
GuitarLens 引擎测试
============================================================

[TEST 1] 检查依赖...
✓ Demucs 已安装
✓ basic-pitch 已安装
✓ librosa 已安装

[TEST 2] 测试音频处理...
✓ 创建测试音频: ./test_output/test_sine.wav

[TEST 3] 测试 BPM 检测...
✓ BPM: 120.0

[TEST 4] 测试调性检测...
✓ 调性: C

[TEST 5] 测试音高检测...
✓ 检测到 10 个音符

============================================================
测试完成！
============================================================
```

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `engine.py` | 核心引擎 |
| `test_engine.py` | 测试脚本 |
| `requirements.txt` | 依赖列表 |
| `README.md` | 项目说明 |
| `API.md` | API 文档 |
| `PROJECT_STRUCTURE.md` | 项目结构 |
| `QUICKSTART.md` | 本文件 |

---

## 获取帮助

### 查看完整文档

- **API 文档**: `API.md`
- **项目结构**: `PROJECT_STRUCTURE.md`
- **开发日志**: `DEVLOG.md`

### 常见错误

**错误**: `ModuleNotFoundError: No module named 'demucs'`
```bash
# 解决: 安装依赖
pip install -r requirements.txt
```

**错误**: `FileNotFoundError: [Errno 2] No such file or directory: 'song.mp3'`
```bash
# 解决: 检查文件路径
ls -la song.mp3
```

**错误**: `MemoryError`
```bash
# 解决: 关闭其他应用，或使用轻量级模型
```

---

## 下一个版本

**Phase 2 预告**:
- Electron 桌面应用
- 实时波形显示
- 音频播放器
- 基础 UI

**敬请期待！** 🎸

---

**快速开始指南**  
**版本**: 0.1.0-alpha  
**最后更新**: 2026-03-27
