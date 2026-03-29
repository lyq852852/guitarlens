# GuitarLens 项目结构

## 目录树

```
GuitarLens/
│
├── 📄 README.md                 # 项目说明
├── 📄 setup.py                  # Python 包配置
├── 📄 package.json              # 项目元数据
├── 📄 requirements.txt          # Python 依赖
├── 📄 .gitignore                # Git 忽略规则
│
├── 🐍 engine.py                 # Phase 1: 核心引擎
│   ├── GuitarLensEngine 类
│   ├── load_audio()             # 加载音频
│   ├── separate_tracks()        # 分离音轨（Demucs）
│   ├── detect_pitch()           # 检测音高（basic-pitch）
│   ├── detect_bpm()             # 检测 BPM
│   ├── detect_key()             # 检测调性
│   ├── recognize_chords()       # 识别和弦
│   └── process_full_song()      # 完整处理流程
│
├── 🧪 test_engine.py            # 测试脚本
│
├── 📁 output/                   # 输出目录（自动创建）
│   ├── guitar.wav               # 分离的吉他轨
│   ├── bass.wav                 # 分离的贝斯轨
│   ├── drums.wav                # 分离的鼓轨
│   ├── vocals.wav               # 分离的人声轨
│   ├── other.wav                # 其他轨
│   └── analysis_result.json     # 分析结果
│
├── 📁 models/                   # AI 模型（首次自动下载）
│   ├── demucs_htdemucs_6s/      # Demucs 模型 (~800MB)
│   └── basic_pitch/             # basic-pitch 模型 (~50MB)
│
└── 📁 future/                   # 后续阶段文件（待创建）
    ├── electron/                # Phase 2: Electron 应用
    ├── ui/                      # Phase 3: React UI
    ├── editor/                  # Phase 4: 谱面编辑器
    └── practice/                # Phase 5: 练习模式
```

## 文件说明

### engine.py
**核心音频处理引擎**

主要类：`GuitarLensEngine`

主要方法：
- `load_audio(path)` - 加载音频文件
- `separate_tracks(path)` - 使用 Demucs 分离音轨
- `detect_pitch(path)` - 使用 basic-pitch 检测音高
- `detect_bpm(path)` - 检测节拍速度
- `detect_key(path)` - 检测歌曲调性
- `recognize_chords(notes)` - 识别和弦
- `process_guitar_track(path)` - 处理单个吉他轨
- `process_full_song(path)` - 完整歌曲处理

### test_engine.py
**测试脚本**

测试项目：
1. 依赖检查
2. 音频处理
3. BPM 检测
4. 调性检测
5. 音高检测

运行：`python test_engine.py`

### requirements.txt
**Python 依赖**

核心库：
- `demucs` - 音轨分离
- `basic-pitch` - 音高检测
- `librosa` - 音频分析
- `numpy` - 数值计算
- `scipy` - 科学计算
- `soundfile` - 音频 I/O
- `madmom` - 节拍检测
- `music21` - 乐理处理

## 使用流程

### 1. 安装依赖
```bash
pip install -r requirements.txt
```

### 2. 运行引擎
```bash
# 完整处理
python engine.py input.mp3 --output ./output --mode full

# 仅分析吉他轨
python engine.py guitar.wav --output ./output --mode guitar_only
```

### 3. 查看结果
```bash
# 分离的音轨
ls output/*.wav

# 分析结果
cat output/analysis_result.json
```

## 输出格式

### analysis_result.json
```json
{
  "input_file": "song.mp3",
  "output_dir": "./output",
  "tracks": {
    "guitar": "./output/guitar.wav",
    "bass": "./output/bass.wav",
    "drums": "./output/drums.wav",
    "vocals": "./output/vocals.wav",
    "other": "./output/other.wav"
  },
  "guitar_analysis": {
    "bpm": {
      "bpm": 120.5,
      "beat_times": [0.0, 0.5, 1.0, ...],
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
          "velocity": 0.8,
          "note_name": "E4"
        }
      ]
    }
  }
}
```

## 开发阶段

### ✅ Phase 1: Python 引擎（进行中）
- [x] 项目结构
- [x] 音轨分离（Demucs）
- [x] 音高检测（basic-pitch）
- [x] BPM 检测
- [x] 调性检测
- [ ] 和弦识别（待完善）
- [ ] 测试和优化

### ⏳ Phase 2: Electron 框架
- [ ] 项目初始化
- [ ] 音频播放
- [ ] 波形显示
- [ ] 基础 UI

### ⏳ Phase 3: 谱面渲染
- [ ] alphaTab 集成
- [ ] 和弦识别优化
- [ ] 谱面同步

### ⏳ Phase 4: 编辑功能
- [ ] 手动编辑
- [ ] 导出功能

### ⏳ Phase 5: 发布
- [ ] 练习模式
- [ ] UI 打磨
- [ ] 打包发布

## 技术栈

### 音频处理
- **Demucs**: 音轨分离（Meta 开源）
- **basic-pitch**: 音高检测（Spotify 开源）
- **librosa**: 音频分析
- **soundfile**: 音频 I/O

### 后续阶段
- **Electron**: 桌面应用框架
- **React**: UI 框架
- **alphaTab**: 谱面渲染
- **WaveSurfer.js**: 波形显示

## 常见问题

**Q: 首次运行很慢？**
A: Demucs 模型首次下载需要时间（~800MB）。

**Q: 识别不准确？**
A: Phase 1 是基础版本，后续会加入优化和手动修正。

**Q: 支持哪些格式？**
A: librosa 支持 MP3, WAV, FLAC, OGG 等大多数格式。

## 下一步

1. ✅ 完成 Phase 1 基础引擎
2. 📝 编写详细的 API 文档
3. 🧪 添加更多测试用例
4. 🎯 优化和弦识别算法
5. 🚀 开始 Phase 2 Electron 框架

---

**最后更新**: 2026-03-27  
**开发者**: Mac
