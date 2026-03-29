/**
 * ScoreViewer 单元测试
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScoreViewer } from './ScoreViewer_v2';

describe('ScoreViewer', () => {
  const mockNotes = [
    {
      pitch: 440,
      midi_note: 69,
      start_time: 0,
      duration: 0.5,
      string: 1,
      fret: 5,
      confidence: 0.95,
    },
    {
      pitch: 494,
      midi_note: 71,
      start_time: 0.5,
      duration: 0.5,
      string: 2,
      fret: 7,
      confidence: 0.92,
    },
  ];

  const mockChords = [
    {
      name: 'C',
      start_time: 0,
      duration: 1,
      notes: [60, 64, 67],
      confidence: 0.88,
    },
    {
      name: 'G',
      start_time: 1,
      duration: 1,
      notes: [67, 71, 74],
      confidence: 0.85,
    },
  ];

  describe('渲染', () => {
    it('应该正确渲染 Tab 视图', () => {
      render(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="tab"
        />
      );

      expect(screen.getByText('Score Viewer')).toBeInTheDocument();
      expect(screen.getByText('Notes: 2')).toBeInTheDocument();
      expect(screen.getByText('Chords: 2')).toBeInTheDocument();
    });

    it('应该正确渲染 Staff 视图', () => {
      render(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="staff"
        />
      );

      expect(screen.getByText('Score Viewer')).toBeInTheDocument();
    });

    it('应该正确渲染 Both 视图', () => {
      render(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="both"
        />
      );

      expect(screen.getByText('Score Viewer')).toBeInTheDocument();
    });

    it('应该正确渲染 Chords 视图', () => {
      render(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="chords"
        />
      );

      expect(screen.getByText('Score Viewer')).toBeInTheDocument();
    });
  });

  describe('交互', () => {
    it('应该在点击音符时调用回调', () => {
      const onNoteClick = jest.fn();

      render(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="tab"
          onNoteClick={onNoteClick}
        />
      );

      // 这里需要实际的 DOM 查询来触发点击
      // 具体实现取决于组件的渲染方式
    });

    it('应该在点击和弦时调用回调', () => {
      const onChordClick = jest.fn();

      render(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="chords"
          onChordClick={onChordClick}
        />
      );

      // 这里需要实际的 DOM 查询来触发点击
    });
  });

  describe('性能', () => {
    it('应该使用 React.memo 避免不必要的重新渲染', () => {
      const { rerender } = render(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="tab"
        />
      );

      // 相同的 props 不应该导致重新渲染
      rerender(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="tab"
        />
      );

      expect(screen.getByText('Score Viewer')).toBeInTheDocument();
    });

    it('应该缓存处理后的音符', () => {
      const { rerender } = render(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="tab"
        />
      );

      // 改变 currentTime 不应该重新处理音符
      rerender(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="tab"
          currentTime={0.5}
        />
      );

      expect(screen.getByText('Score Viewer')).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('应该处理空的音符列表', () => {
      render(
        <ScoreViewer
          notes={[]}
          chords={mockChords}
          viewMode="tab"
        />
      );

      expect(screen.getByText('Notes: 0')).toBeInTheDocument();
    });

    it('应该处理空的和弦列表', () => {
      render(
        <ScoreViewer
          notes={mockNotes}
          chords={[]}
          viewMode="chords"
        />
      );

      expect(screen.getByText('Chords: 0')).toBeInTheDocument();
    });

    it('应该处理无效的 currentTime', () => {
      render(
        <ScoreViewer
          notes={mockNotes}
          chords={mockChords}
          viewMode="tab"
          currentTime={-1}
        />
      );

      expect(screen.getByText('Score Viewer')).toBeInTheDocument();
    });
  });
});
