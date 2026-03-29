# GuitarLens Phase 4 - 编辑功能

## 📋 Phase 4 规划

### 目标
实现完整的谱面编辑功能，支持手动修改、导出多种格式、项目管理。

### 核心功能
1. ✅ 手动编辑器（编辑音符、和弦）
2. ✅ 导出功能（PDF/MusicXML/GuitarPro）
3. ✅ 项目管理（保存/加载/删除）
4. ✅ 撤销/重做
5. ✅ 快捷键支持
6. ✅ 预览功能

### 项目结构

```
src/
├── components/
│   ├── Editor/
│   │   ├── ScoreEditor.tsx      # 编辑器主组件
│   │   ├── NoteEditor.tsx       # 音符编辑
│   │   ├── ChordEditor.tsx      # 和弦编辑
│   │   └── EditorToolbar.tsx    # 工具栏
│   │
│   ├── Export/
│   │   ├── ExportDialog.tsx     # 导出对话框
│   │   └── ExportPreview.tsx    # 导出预览
│   │
│   └── Project/
│       ├── ProjectManager.tsx   # 项目管理
│       └── ProjectList.tsx      # 项目列表
│
├── utils/
│   ├── editorState.ts           # 编辑器状态管理
│   ├── exportUtils.ts           # 导出工具
│   ├── projectManager.ts        # 项目管理
│   └── undoRedo.ts              # 撤销/重做
│
└── hooks/
    ├── useEditor.ts             # 编辑器 Hook
    ├── useUndo.ts               # 撤销/重做 Hook
    └── useProject.ts            # 项目管理 Hook
```

### 开发步骤

#### Step 1: 编辑器框架
- [ ] 创建 ScoreEditor 组件
- [ ] 实现编辑器状态管理
- [ ] 创建编辑器工具栏

#### Step 2: 编辑功能
- [ ] 音符编辑（添加/删除/修改）
- [ ] 和弦编辑
- [ ] 时值调整
- [ ] 品位调整

#### Step 3: 撤销/重做
- [ ] 实现撤销/重做栈
- [ ] 快捷键支持（Ctrl+Z/Ctrl+Y）
- [ ] 状态恢复

#### Step 4: 导出功能
- [ ] PDF 导出
- [ ] MusicXML 导出
- [ ] GuitarPro 导出
- [ ] 导出预览

#### Step 5: 项目管理
- [ ] 保存项目
- [ ] 加载项目
- [ ] 删除项目
- [ ] 项目列表

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
- ✅ 能编辑音符
- ✅ 能编辑和弦
- ✅ 能撤销/重做
- ✅ 能导出 PDF
- ✅ 能导出 MusicXML
- ✅ 能导出 GuitarPro
- ✅ 能保存/加载项目
- ✅ 能删除项目

---

**开始时间**: 2026-03-27 23:09 GMT+8
**预计完成**: 2026-03-28 07:00 GMT+8
