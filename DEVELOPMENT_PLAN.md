# GuitarLens - 正式开发计划

## 开发目标

将 GuitarLens v0.4.0 从原型升级为**生产级应用**，重点关注：
- 代码质量和性能
- 用户体验优化
- 功能完整性
- 文档和测试覆盖

## 开发阶段

### Phase 6: 核心功能优化（当前）

**目标**: 优化现有功能，提升代码质量

#### 6.1 音频处理引擎优化

**文件**: `python/engine.py`

**改进项**:
- [ ] 添加进度回调支持
- [ ] 实现缓存机制
- [ ] 优化内存使用
- [ ] 添加错误处理
- [ ] 添加日志系统

**代码示例**:
```python
class GuitarLensEngine:
    def __init__(self, cache_dir: str = None):
        self.cache_dir = cache_dir or Path.home() / '.guitarlens' / 'cache'
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.logger = self._setup_logger()
    
    def process_audio(
        self, 
        file_path: str,
        progress_callback: Callable[[float], None] = None
    ) -> Dict[str, Any]:
        """处理音频文件，支持进度回调"""
        try:
            # 检查缓存
            cache_key = self._get_cache_key(file_path)
            if self._has_cache(cache_key):
                self.logger.info(f"从缓存加载: {file_path}")
                return self._load_cache(cache_key)
            
            # 处理音频
            result = self._process(file_path, progress_callback)
            
            # 保存缓存
            self._save_cache(cache_key, result)
            
            return result
        except Exception as e:
            self.logger.error(f"处理失败: {e}")
            raise
```

#### 6.2 React 组件优化

**文件**: `src/components/`

**改进项**:
- [ ] 使用 React.memo 避免不必要重新渲染
- [ ] 使用 useMemo 缓存计算结果
- [ ] 使用 useCallback 缓存函数
- [ ] 添加错误边界
- [ ] 添加加载状态

**代码示例**:
```tsx
import React, { useMemo, useCallback } from 'react';

interface ScoreViewerProps {
  notes: Note[];
  chords: Chord[];
  viewMode: 'tab' | 'staff' | 'both' | 'chords';
  onNoteClick?: (note: Note) => void;
}

export const ScoreViewer = React.memo<ScoreViewerProps>(({
  notes,
  chords,
  viewMode,
  onNoteClick,
}) => {
  // 缓存计算结果
  const processedNotes = useMemo(() => {
    return notes.map(note => ({
      ...note,
      displayName: getNoteName(note.pitch),
    }));
  }, [notes]);

  // 缓存回调函数
  const handleNoteClick = useCallback((note: Note) => {
    onNoteClick?.(note);
  }, [onNoteClick]);

  return (
    <div className="score-viewer">
      {viewMode === 'tab' && <TabView notes={processedNotes} />}
      {viewMode === 'staff' && <StaffView notes={processedNotes} />}
      {viewMode === 'both' && (
        <>
          <TabView notes={processedNotes} />
          <StaffView notes={processedNotes} />
        </>
      )}
      {viewMode === 'chords' && <ChordDiagram chords={chords} />}
    </div>
  );
});

ScoreViewer.displayName = 'ScoreViewer';
```

#### 6.3 编辑器功能完善

**文件**: `src/components/ScoreEditor.tsx`

**改进项**:
- [ ] 实现完整的快捷键系统
- [ ] 添加撤销/重做栈优化
- [ ] 实现自动保存
- [ ] 添加冲突检测
- [ ] 实现版本控制

**代码示例**:
```tsx
interface EditorState {
  notes: Note[];
  chords: Chord[];
  history: EditorState[];
  historyIndex: number;
  isDirty: boolean;
  lastSaved: Date;
}

const useEditor = () => {
  const [state, setState] = useState<EditorState>(initialState);

  const dispatch = useCallback((action: EditorAction) => {
    setState(prevState => {
      const newState = editorReducer(prevState, action);
      
      // 自动保存
      if (shouldAutoSave(newState)) {
        saveProject(newState);
      }
      
      return newState;
    });
  }, []);

  // 快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            dispatch({ type: 'UNDO' });
            break;
          case 'y':
            e.preventDefault();
            dispatch({ type: 'REDO' });
            break;
          case 's':
            e.preventDefault();
            dispatch({ type: 'SAVE' });
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return { state, dispatch };
};
```

#### 6.4 导出功能增强

**文件**: `src/utils/exportUtils.ts`

**改进项**:
- [ ] 优化 PDF 生成性能
- [ ] 添加 MusicXML 验证
- [ ] 实现 GuitarPro 完整支持
- [ ] 添加导出预览
- [ ] 实现批量导出

**代码示例**:
```typescript
export async function exportToPDF(
  score: Score,
  options: ExportOptions = {}
): Promise<Blob> {
  const {
    quality = 'high',
    includeMetadata = true,
    pageSize = 'A4',
  } = options;

  try {
    // 生成 PDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: pageSize,
    });

    // 添加元数据
    if (includeMetadata) {
      doc.setProperties({
        title: score.title,
        author: score.artist,
        subject: 'Guitar Tab',
      });
    }

    // 渲染谱面
    const canvas = await renderScoreToCanvas(score);
    const imgData = canvas.toDataURL('image/png', quality === 'high' ? 1 : 0.8);
    doc.addImage(imgData, 'PNG', 10, 10, 190, 277);

    return doc.output('blob');
  } catch (error) {
    console.error('PDF 导出失败:', error);
    throw new Error('Failed to export PDF');
  }
}
```

### Phase 7: 用户体验优化

**目标**: 提升应用的易用性和响应性

#### 7.1 UI/UX 改进

- [ ] 优化加载状态显示
- [ ] 添加进度条
- [ ] 改进错误提示
- [ ] 优化响应式设计
- [ ] 添加深色/浅色主题切换

#### 7.2 性能优化

- [ ] 代码分割和懒加载
- [ ] 图片优化
- [ ] 缓存策略优化
- [ ] 虚拟滚动
- [ ] 防抖和节流

#### 7.3 可访问性

- [ ] 添加 ARIA 标签
- [ ] 键盘导航支持
- [ ] 屏幕阅读器支持
- [ ] 高对比度模式
- [ ] 字体大小调整

### Phase 8: 测试和质量保证

**目标**: 确保代码质量和功能正确性

#### 8.1 单元测试

```typescript
// src/utils/__tests__/noteToTab.test.ts
describe('noteToTab', () => {
  it('应该正确转换频率到品位', () => {
    const result = noteToTab(440); // A4
    expect(result).toEqual({
      string: 1,
      fret: 5,
    });
  });

  it('应该处理多个音符', () => {
    const result = noteToTab([440, 494, 523]); // A4, B4, C5
    expect(result).toHaveLength(3);
  });
});
```

#### 8.2 集成测试

```typescript
// src/__tests__/integration.test.ts
describe('音频处理流程', () => {
  it('应该完整处理音频文件', async () => {
    const result = await processAudio('test.mp3');
    expect(result).toHaveProperty('notes');
    expect(result).toHaveProperty('chords');
    expect(result).toHaveProperty('bpm');
  });
});
```

#### 8.3 E2E 测试

```typescript
// e2e/app.spec.ts
describe('应用流程', () => {
  it('应该完整的用户流程', async () => {
    // 上传文件
    await page.click('[data-testid="upload-button"]');
    await page.uploadFile('[data-testid="file-input"]', 'test.mp3');

    // 处理音频
    await page.click('[data-testid="process-button"]');
    await page.waitForSelector('[data-testid="score-viewer"]');

    // 编辑谱面
    await page.click('[data-testid="edit-button"]');
    await page.click('[data-testid="note-0"]');

    // 导出文件
    await page.click('[data-testid="export-button"]');
    await page.selectOption('[data-testid="export-format"]', 'pdf');
    await page.click('[data-testid="export-confirm"]');
  });
});
```

### Phase 9: 文档和发布

**目标**: 完善文档，准备发布

#### 9.1 文档完善

- [ ] API 文档
- [ ] 用户指南
- [ ] 开发者指南
- [ ] 故障排除指南
- [ ] 视频教程

#### 9.2 发布准备

- [ ] 版本号更新
- [ ] CHANGELOG 更新
- [ ] 代码签名
- [ ] 安全审计
- [ ] 性能基准测试

#### 9.3 应用市场上架

- [ ] Mac App Store
- [ ] Windows Store
- [ ] GitHub Release
- [ ] 官方网站

## 开发时间表

| Phase | 任务 | 预计时间 | 状态 |
|-------|------|---------|------|
| 6 | 核心功能优化 | 2 天 | 进行中 |
| 7 | 用户体验优化 | 1 天 | 待开始 |
| 8 | 测试和质量保证 | 1 天 | 待开始 |
| 9 | 文档和发布 | 1 天 | 待开始 |

## 代码质量目标

- **测试覆盖率**: > 80%
- **代码复杂度**: < 10
- **类型覆盖率**: 100%
- **文档覆盖率**: 100%
- **性能**: 首屏加载 < 2s

## 关键指标

| 指标 | 目标 | 当前 |
|------|------|------|
| 代码行数 | 8000+ | 5000+ |
| 测试用例 | 100+ | 31 |
| 文档页数 | 30+ | 25+ |
| 功能完成度 | 100% | 100% |
| 代码质量 | A+ | A |

## 下一步行动

1. ✅ 创建开发计划
2. ⏳ 优化音频处理引擎
3. ⏳ 优化 React 组件
4. ⏳ 完善编辑器功能
5. ⏳ 增强导出功能
6. ⏳ 添加单元测试
7. ⏳ 添加集成测试
8. ⏳ 优化用户体验
9. ⏳ 完善文档
10. ⏳ 发布 v0.5.0

---

**开发开始时间**: 2026-03-28 00:05 GMT+8  
**预计完成时间**: 2026-03-31 00:00 GMT+8  
**开发者**: Mac  
**项目**: GuitarLens v0.4.0 → v0.5.0
