# GuitarLens Phase 3 - 谱面渲染

## 📋 Phase 3 规划

### 目标
集成 alphaTab，实现 GuitarPro 级别的谱面渲染，支持六线谱、五线谱、和弦图等多种格式。

### 核心功能
1. ✅ alphaTab 集成
2. ✅ 六线谱渲染（Tab）
3. ✅ 五线谱渲染（Staff）
4. ✅ 和弦图显示
5. ✅ 谱面同步（播放时高亮）
6. ✅ 多视图切换
7. ✅ 导出功能（PDF/MusicXML/GP）

### 技术方案

#### alphaTab 集成
- 使用 alphaTab 7.0+
- 支持 GuitarPro 格式
- 原生 React 集成
- 实时渲染

#### 谱面生成流程
```
Python 识别结果 (JSON)
    ↓
转换为 alphaTab 格式
    ↓
生成 GuitarPro 对象
    ↓
alphaTab 渲染
    ↓
显示六线谱 + 五线谱 + 和弦图
```

#### 数据转换
```python
# Python 输出格式
{
  "notes": [
    {
      "start_time": 0.0,
      "end_time": 0.5,
      "pitch": 329.63,
      "note_name": "E4",
      "velocity": 0.8
    }
  ],
  "bpm": 120,
  "key": "Em"
}

# 转换为 alphaTab 格式
{
  "tracks": [{
    "channel": { "channel": 0, "effectChannel": 0 },
    "measures": [{
      "beats": [{
        "duration": { "value": 4 },
        "notes": [{
          "value": 0,  // 品位
          "string": 6  // 弦
        }]
      }]
    }]
  }]
}
```

### 项目结构

```
src/
├── components/
│   ├── ScoreViewer.tsx          # 谱面查看器（新）
│   ├── TabView.tsx              # 六线谱视图（新）
│   ├── StaffView.tsx            # 五线谱视图（新）
│   ├── ChordDiagram.tsx         # 和弦图（新）
│   └── ...（现有组件）
│
├── utils/
│   ├── scoreConverter.ts        # 转换工具（新）
│   ├── noteToTab.ts             # 音符转 Tab（新）
│   └── chordRecognizer.ts       # 和弦识别（新）
│
└── styles/
    └── score.css                # 谱面样式（新）
```

### 开发步骤

#### Step 1: alphaTab 集成
- [ ] 安装 alphaTab
- [ ] 创建 ScoreViewer 组件
- [ ] 配置 alphaTab 选项

#### Step 2: 数据转换
- [ ] 实现 Python 结果转换
- [ ] 音符转 Tab 转换
- [ ] 时值处理

#### Step 3: 多视图
- [ ] 六线谱视图
- [ ] 五线谱视图
- [ ] 和弦图显示
- [ ] 视图切换

#### Step 4: 同步播放
- [ ] 播放时高亮
- [ ] 进度同步
- [ ] 自动滚动

#### Step 5: 导出功能
- [ ] PDF 导出
- [ ] MusicXML 导出
- [ ] GuitarPro 导出

#### Step 6: 优化
- [ ] 性能优化
- [ ] UI 打磨
- [ ] 错误处理

### 预期时间
- Step 1-2: 2-3 小时
- Step 3-4: 2-3 小时
- Step 5-6: 1-2 小时
- **总计**: 5-8 小时

### 成功标准
- ✅ alphaTab 正常渲染
- ✅ 能显示六线谱
- ✅ 能显示五线谱
- ✅ 能显示和弦图
- ✅ 能切换视图
- ✅ 能同步播放
- ✅ 能导出文件

---

**开始时间**: 2026-03-27 23:01 GMT+8
**预计完成**: 2026-03-28 07:00 GMT+8
