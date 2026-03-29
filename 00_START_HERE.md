# 🎸 GuitarLens - 开始这里

欢迎来到 **GuitarLens** - AI 吉他扒带软件！

## 🚀 快速开始（3 步）

### 1️⃣ 安装依赖
```bash
pip install -r requirements.txt
```

### 2️⃣ 准备音频
准备一个吉他歌曲（MP3/WAV/FLAC 等）

### 3️⃣ 运行引擎
```bash
python engine.py your_song.mp3 --output ./output
```

**完成！** 查看 `output/` 目录获取结果。

---

## 📚 文档导航

根据你的需求选择：

### 🎯 我想快速上手
👉 **[QUICKSTART.md](QUICKSTART.md)** - 5 分钟快速开始指南

### 📖 我想了解项目
👉 **[README.md](README.md)** - 项目说明和功能介绍

### 🔧 我想调用 API
👉 **[API.md](API.md)** - 完整的 API 文档和示例

### 🏗️ 我想了解项目结构
👉 **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - 详细的项目结构

### 📋 我想看完成清单
👉 **[CHECKLIST.md](CHECKLIST.md)** - Phase 1 交付清单

### 📝 我想看开发日志
👉 **[DEVLOG.md](DEVLOG.md)** - 开发过程和技术决策

### 📊 我想看项目总结
👉 **[SUMMARY.md](SUMMARY.md)** - Phase 1 完成总结

---

## 💡 核心功能

✅ **音轨分离** - 自动分离吉他/贝斯/鼓/人声  
✅ **音高检测** - 识别所有音符和时值  
✅ **BPM 检测** - 自动检测节拍速度  
✅ **调性检测** - 识别歌曲调性  
✅ **完整流程** - 从音频到分析结果  

---

## 📦 输出内容

处理完成后，你会得到：

```
output/
├── guitar.wav       # ✨ 分离的吉他轨
├── bass.wav         # 贝斯轨
├── drums.wav        # 鼓轨
├── vocals.wav       # 人声轨
├── other.wav        # 其他轨
└── analysis_result.json  # 分析结果
```

---

## 🎯 使用示例

### 命令行

```bash
# 完整处理
python engine.py song.mp3 --output ./output

# 仅分析吉他轨
python engine.py guitar.wav --output ./output --mode guitar_only
```

### Python 代码

```python
from engine import GuitarLensEngine

engine = GuitarLensEngine()
result = engine.process_full_song("song.mp3")

# 访问结果
bpm = result['guitar_analysis']['bpm']['bpm']
key = result['guitar_analysis']['key']['key']
notes = result['guitar_analysis']['pitch']['notes']

print(f"BPM: {bpm}")
print(f"调性: {key}")
print(f"音符数: {len(notes)}")
```

---

## ⏱️ 预期时间

| 操作 | 时间 |
|------|------|
| 首次安装 | 5-10 分钟 |
| 首次运行 | 10-20 分钟（下载模型） |
| 后续运行 | 5-8 分钟 |

---

## 🔗 相关链接

- **项目主页**: [GuitarLens](https://github.com/yourusername/guitarlens)
- **Demucs**: [Facebook Research](https://github.com/facebookresearch/demucs)
- **basic-pitch**: [Spotify](https://github.com/spotify/basic-pitch)
- **librosa**: [Documentation](https://librosa.org/)

---

## ❓ 常见问题

**Q: 首次运行很慢？**
A: 正常现象，首次下载模型需要时间。

**Q: 识别不准确？**
A: Phase 1 是基础版本，后续会优化。

**Q: 支持哪些格式？**
A: MP3, WAV, FLAC, OGG, M4A 等。

**Q: 需要 GPU 吗？**
A: 不需要，但有 GPU 会更快。

---

## 🚀 下一步

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

## 📞 获取帮助

1. **查看文档** - 从上面的导航开始
2. **查看示例** - 查看 API.md 中的代码示例
3. **运行测试** - `python test_engine.py`

---

## 🎉 开始吧！

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 运行引擎
python engine.py your_song.mp3

# 3. 查看结果
ls output/
cat output/analysis_result.json
```

**祝你使用愉快！** 🎸✨

---

**GuitarLens v0.1.0-alpha**  
**开发者**: Mac  
**许可证**: MIT  
**最后更新**: 2026-03-27
