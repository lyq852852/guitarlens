# GuitarLens 开发日志

## 2026-03-27

### Phase 1 启动

**时间**: 22:39 GMT+8  
**任务**: 搭建 Python 音频处理引擎

#### 完成项目

✅ **项目初始化**
- 创建项目目录结构
- 初始化 Git 仓库配置

✅ **核心引擎 (engine.py)**
- 实现 `GuitarLensEngine` 类
- 音轨分离：`separate_tracks()` - 使用 Demucs htdemucs_6s 模型
- 音高检测：`detect_pitch()` - 使用 basic-pitch
- BPM 检测：`detect_bpm()` - 基于 onset strength
- 调性检测：`detect_key()` - 基于 chroma 特征
- 和弦识别：`recognize_chords()` - 框架已建立，待完善
- 完整处理流程：`process_full_song()`

✅ **文档**
- README.md - 项目说明和使用指南
- PROJECT_STRUCTURE.md - 详细的项目结构文档
- setup.py - Python 包配置
- package.json - 项目元数据

✅ **测试**
- test_engine.py - 基础测试脚本
- .gitignore - Git 忽略规则

#### 技术选型

| 组件 | 选择 | 原因 |
|------|------|------|
| 音轨分离 | Demucs htdemucs_6s | 效果最好，Meta 开源 |
| 音高检测 | basic-pitch | Spotify 开源，精度高 |
| BPM 检测 | librosa | 成熟稳定 |
| 调性检测 | librosa chroma | 标准方法 |
| 和弦识别 | 待优化 | 需要更复杂的算法 |

#### 依赖分析

```
核心依赖：
├── demucs (4.0.1) - 音轨分离
├── basic-pitch (0.2.1) - 音高检测
├── librosa (0.10.0) - 音频分析
├── numpy (1.24.3) - 数值计算
├── scipy (1.11.1) - 科学计算
├── soundfile (0.12.1) - 音频 I/O
├── madmom (0.16.1) - 节拍检测
├── pydub (0.25.1) - 音频处理
└── music21 (9.1.0) - 乐理处理

总大小：~1.5 GB（包括模型）
```

#### 下一步

**Phase 1 待完成**:
1. 优化和弦识别算法
2. 添加更多测试用例
3. 性能优化
4. 错误处理完善

**Phase 2 计划**:
1. Electron 框架搭建
2. React UI 基础
3. 音频播放器
4. 波形显示

#### 注意事项

- Demucs 模型首次下载 ~800MB，需要网络
- basic-pitch 需要 GPU 加速（可选）
- 处理时间：3-5 分钟/首歌（取决于长度和硬件）

---

## 下一次会话

**预期任务**:
- [ ] 测试 engine.py 的实际效果
- [ ] 优化和弦识别
- [ ] 开始 Phase 2 Electron 框架
- [ ] 设计 API 接口

**预期时间**: 2026-03-28

---

**开发者**: Mac  
**项目**: GuitarLens  
**版本**: 0.1.0-alpha
