# GuitarLens

> AI 驱动的吉他扒带软件 — 自动识别音符、和弦，生成可编辑谱面

[![Version](https://img.shields.io/badge/version-0.5.0-blue)](https://github.com/guitarlens/guitarlens/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-lightgrey)](https://github.com/guitarlens/guitarlens/releases)

---

## 功能特性

- 🎸 **吉他轨分离** — 基于 Demucs，从混音中精准提取吉他轨
- 🎵 **音符识别** — 基于 basic-pitch，识别每个音符的音高、时值、弦位
- 🎼 **和弦识别** — 支持 15+ 种和弦类型（大/小三和弦、七和弦、挂留、加音等）
- 📊 **多视图谱面** — 六线谱、五线谱、和弦图，支持实时播放同步
- ✏️ **可编辑谱面** — 修改音符/和弦，无限撤销/重做
- 📤 **多格式导出** — PDF、MusicXML、GuitarPro (.gpx)
- 🌙 **深色/浅色主题** — 跟随系统自动切换
- 💾 **项目管理** — 保存、加载、搜索项目

---

## 快速开始

### 安装

**macOS**
```bash
# 下载 DMG，拖入 Applications
open GuitarLens-0.5.0.dmg
```

**Windows**
```bash
# 运行安装程序
GuitarLens-0.5.0-Setup.exe
```

### 使用

1. 启动 GuitarLens
2. 拖拽音频文件（MP3/WAV/FLAC）到应用窗口
3. 点击 **Process Audio**
4. 查看生成的谱面，按需编辑
5. 导出为 PDF / MusicXML / GuitarPro

---

## 开发

### 环境要求

- Node.js 16+
- Python 3.8+
- npm 8+

### 本地运行

```bash
git clone https://github.com/guitarlens/guitarlens.git
cd guitarlens

# 安装依赖
npm install
pip install -r requirements.txt

# 启动开发模式
npm start
```

### 构建发布包

```bash
npm run dist-mac    # macOS DMG + ZIP
npm run dist-win    # Windows EXE + Portable
npm run dist-all    # 全平台
```

---

## 技术栈

| 层 | 技术 |
|----|------|
| 桌面框架 | Electron 27 |
| 前端 | React 18 + TypeScript |
| 样式 | Tailwind CSS |
| 音频分离 | Demucs (htdemucs_6s) |
| 音符识别 | basic-pitch (Spotify) |
| 音频分析 | librosa + madmom |
| 谱面渲染 | alphaTab + VexFlow |
| 打包 | electron-builder |

---

## 文档

- [用户指南](docs/USER_GUIDE.md)
- [API 参考](docs/API_REFERENCE.md)
- [开发指南](DEVELOPMENT.md)
- [更新日志](CHANGELOG.md)

---

## 系统要求

| | 最低 | 推荐 |
|--|------|------|
| macOS | 10.13 | 12+ |
| Windows | 10 | 11 |
| RAM | 4 GB | 8 GB |
| 磁盘 | 2 GB | 5 GB |

---

## License

MIT © 2026 GuitarLens
