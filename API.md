# GuitarLens API 文档

## GuitarLensEngine 类

### 初始化

```python
from engine import GuitarLensEngine

engine = GuitarLensEngine(output_dir="./output")
```

**参数**:
- `output_dir` (str): 输出目录，默认 "./output"

---

## 方法

### load_audio(audio_path: str) -> Tuple[np.ndarray, int]

加载音频文件。

**参数**:
- `audio_path` (str): 音频文件路径

**返回**:
- `(audio_data, sample_rate)`: 音频数据和采样率

**示例**:
```python
y, sr = engine.load_audio("song.mp3")
print(f"音频形状: {y.shape}, 采样率: {sr}")
```

---

### separate_tracks(audio_path: str) -> Dict[str, str]

使用 Demucs 分离音轨。

**参数**:
- `audio_path` (str): 音频文件路径

**返回**:
```python
{
    'guitar': './output/guitar.wav',
    'bass': './output/bass.wav',
    'drums': './output/drums.wav',
    'vocals': './output/vocals.wav',
    'other': './output/other.wav'
}
```

**示例**:
```python
sources = engine.separate_tracks("song.mp3")
for source_name, source_path in sources.items():
    print(f"{source_name}: {source_path}")
```

**注意**:
- 首次运行会下载 Demucs 模型 (~800MB)
- 处理时间：3-5 分钟/首歌

---

### detect_pitch(audio_path: str) -> Dict

使用 basic-pitch 检测音高。

**参数**:
- `audio_path` (str): 音频文件路径

**返回**:
```python
{
    'notes': [
        {
            'start_time': 0.0,
            'end_time': 0.5,
            'pitch': 329.63,
            'velocity': 0.8,
            'note_name': 'E4'
        },
        ...
    ],
    'midi_data': '...',
    'sample_rate': 22050
}
```

**示例**:
```python
pitch_info = engine.detect_pitch("guitar.wav")
for note in pitch_info['notes']:
    print(f"{note['note_name']}: {note['start_time']:.2f}s - {note['end_time']:.2f}s")
```

**参数说明**:
- `start_time`: 音符开始时间（秒）
- `end_time`: 音符结束时间（秒）
- `pitch`: 频率（Hz）
- `velocity`: 力度（0-1）
- `note_name`: 音符名称（如 E4, A#5）

---

### detect_bpm(audio_path: str) -> Dict

检测 BPM（节拍速度）。

**参数**:
- `audio_path` (str): 音频文件路径

**返回**:
```python
{
    'bpm': 120.5,
    'beat_times': [0.0, 0.5, 1.0, ...],
    'confidence': 0.8
}
```

**示例**:
```python
bpm_info = engine.detect_bpm("song.mp3")
print(f"BPM: {bpm_info['bpm']:.1f}")
print(f"节拍数: {len(bpm_info['beat_times'])}")
```

---

### detect_key(audio_path: str) -> Dict

检测歌曲调性。

**参数**:
- `audio_path` (str): 音频文件路径

**返回**:
```python
{
    'key': 'Em',
    'confidence': 0.75
}
```

**示例**:
```python
key_info = engine.detect_key("song.mp3")
print(f"调性: {key_info['key']} (置信度: {key_info['confidence']:.2%})")
```

**可能的调性**:
- C, C#, D, D#, E, F, F#, G, G#, A, A#, B

---

### recognize_chords(notes: List[Dict]) -> List[Dict]

识别和弦（基于音符序列）。

**参数**:
- `notes` (List[Dict]): 音符列表（来自 `detect_pitch()` 的输出）

**返回**:
```python
[
    {
        'start_time': 0.0,
        'end_time': 1.0,
        'chord': 'Em',
        'confidence': 0.85
    },
    ...
]
```

**示例**:
```python
pitch_info = engine.detect_pitch("guitar.wav")
chords = engine.recognize_chords(pitch_info['notes'])
for chord in chords:
    print(f"{chord['chord']}: {chord['start_time']:.2f}s - {chord['end_time']:.2f}s")
```

**注意**:
- 当前版本是基础实现，后续会优化
- 需要足够的音符数据才能准确识别

---

### process_guitar_track(audio_path: str) -> Dict

处理单个吉他轨道的完整流程。

**参数**:
- `audio_path` (str): 吉他轨道文件路径

**返回**:
```python
{
    'input_file': 'guitar.wav',
    'output_dir': './output',
    'analysis': {
        'bpm': {...},
        'key': {...},
        'pitch': {...},
        'chords': [...]
    }
}
```

**示例**:
```python
result = engine.process_guitar_track("guitar.wav")
print(f"BPM: {result['analysis']['bpm']['bpm']}")
print(f"调性: {result['analysis']['key']['key']}")
print(f"音符数: {len(result['analysis']['pitch']['notes'])}")
```

---

### process_full_song(audio_path: str) -> Dict

处理完整歌曲（分离 + 分析）。

**参数**:
- `audio_path` (str): 完整歌曲文件路径

**返回**:
```python
{
    'input_file': 'song.mp3',
    'output_dir': './output',
    'tracks': {
        'guitar': './output/guitar.wav',
        'bass': './output/bass.wav',
        'drums': './output/drums.wav',
        'vocals': './output/vocals.wav',
        'other': './output/other.wav'
    },
    'guitar_analysis': {
        'bpm': {...},
        'key': {...},
        'pitch': {...},
        'chords': [...]
    }
}
```

**示例**:
```python
result = engine.process_full_song("song.mp3")

# 访问分离的音轨
print("分离的音轨:")
for track_name, track_path in result['tracks'].items():
    print(f"  {track_name}: {track_path}")

# 访问分析结果
analysis = result['guitar_analysis']
print(f"\n吉他分析:")
print(f"  BPM: {analysis['bpm']['bpm']:.1f}")
print(f"  调性: {analysis['key']['key']}")
print(f"  音符数: {len(analysis['pitch']['notes'])}")
```

---

## 命令行使用

### 完整处理

```bash
python engine.py input.mp3 --output ./output --mode full
```

**参数**:
- `input.mp3`: 输入音频文件
- `--output`: 输出目录（默认 ./output）
- `--mode`: 处理模式（full 或 guitar_only）

### 仅分析吉他轨

```bash
python engine.py guitar.wav --output ./output --mode guitar_only
```

---

## 输出文件

### 音轨文件

```
output/
├── guitar.wav      # 吉他轨
├── bass.wav        # 贝斯轨
├── drums.wav       # 鼓轨
├── vocals.wav      # 人声轨
└── other.wav       # 其他轨
```

### 分析结果

```
output/analysis_result.json
```

---

## 错误处理

```python
try:
    result = engine.process_full_song("song.mp3")
except FileNotFoundError:
    print("文件不存在")
except Exception as e:
    print(f"处理失败: {e}")
```

---

## 性能指标

| 操作 | 时间 | 内存 |
|------|------|------|
| 加载音频 | <1s | ~100MB |
| 分离音轨 | 3-5 min | ~2GB |
| 检测音高 | 1-2 min | ~500MB |
| 检测 BPM | <1s | ~100MB |
| 检测调性 | <1s | ~100MB |

---

## 常见问题

**Q: 如何加速处理？**
A: 使用 GPU 加速（需要 CUDA）。

**Q: 如何改进识别准确度？**
A: 后续版本会加入手动修正功能。

**Q: 支持批量处理吗？**
A: 当前版本不支持，可以编写脚本循环调用。

---

**最后更新**: 2026-03-27  
**版本**: 0.1.0-alpha
