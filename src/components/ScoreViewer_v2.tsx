/**
 * ScoreViewer v2.0 - 优化版本
 * 使用 React.memo, useMemo, useCallback 优化性能
 */

import React, { useMemo, useCallback, useState, useEffect } from 'react';

interface Note {
  pitch: number;
  midi_note: number;
  start_time: number;
  duration: number;
  string: number;
  fret: number;
  confidence: number;
}

interface Chord {
  name: string;
  start_time: number;
  duration: number;
  notes: number[];
  confidence: number;
}

interface ScoreViewerProps {
  notes: Note[];
  chords: Chord[];
  viewMode: 'tab' | 'staff' | 'both' | 'chords';
  currentTime?: number;
  isPlaying?: boolean;
  onNoteClick?: (note: Note) => void;
  onChordClick?: (chord: Chord) => void;
}

/**
 * 获取音符名称
 */
const getNoteName = (midiNote: number): string => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = notes[midiNote % 12];
  return `${noteName}${octave}`;
};

/**
 * 获取和弦颜色
 */
const getChordColor = (chordName: string): string => {
  const colors: Record<string, string> = {
    'C': '#FF6B6B',
    'G': '#4ECDC4',
    'D': '#45B7D1',
    'A': '#96CEB4',
    'E': '#FFEAA7',
    'Am': '#DDA15E',
    'Em': '#BC6C25',
    'Dm': '#8E7DBE',
  };
  return colors[chordName] || '#999999';
};

/**
 * Tab 视图组件
 */
const TabView = React.memo<{
  notes: Note[];
  currentTime?: number;
  onNoteClick?: (note: Note) => void;
}>(({ notes, currentTime = 0, onNoteClick }) => {
  // 按时间排序音符
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => a.start_time - b.start_time);
  }, [notes]);

  // 按弦分组
  const notesByString = useMemo(() => {
    const grouped: Record<number, Note[]> = {};
    for (let i = 1; i <= 6; i++) {
      grouped[i] = [];
    }
    sortedNotes.forEach(note => {
      grouped[note.string].push(note);
    });
    return grouped;
  }, [sortedNotes]);

  const handleNoteClick = useCallback((note: Note) => {
    onNoteClick?.(note);
  }, [onNoteClick]);

  return (
    <div className="tab-view">
      <div className="tab-container">
        {[1, 2, 3, 4, 5, 6].map(string => (
          <div key={string} className="tab-line">
            <span className="string-label">String {string}</span>
            <div className="tab-notes">
              {notesByString[string].map((note, idx) => (
                <div
                  key={idx}
                  className={`tab-note ${
                    currentTime >= note.start_time &&
                    currentTime < note.start_time + note.duration
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleNoteClick(note)}
                  style={{
                    left: `${(note.start_time / (sortedNotes[sortedNotes.length - 1]?.start_time || 1)) * 100}%`,
                  }}
                >
                  {note.fret}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TabView.displayName = 'TabView';

/**
 * Staff 视图组件
 */
const StaffView = React.memo<{
  notes: Note[];
  currentTime?: number;
  onNoteClick?: (note: Note) => void;
}>(({ notes, currentTime = 0, onNoteClick }) => {
  const handleNoteClick = useCallback((note: Note) => {
    onNoteClick?.(note);
  }, [onNoteClick]);

  return (
    <div className="staff-view">
      <div className="staff-container">
        {/* 五线谱 */}
        <svg width="100%" height="200" className="staff-svg">
          {/* 绘制五条线 */}
          {[0, 1, 2, 3, 4].map(line => (
            <line
              key={line}
              x1="0"
              y1={40 + line * 20}
              x2="100%"
              y2={40 + line * 20}
              stroke="#333"
              strokeWidth="1"
            />
          ))}

          {/* 绘制音符 */}
          {notes.map((note, idx) => {
            const x = (note.start_time / (notes[notes.length - 1]?.start_time || 1)) * 100;
            const y = 40 + (note.midi_note % 12) * 5;

            return (
              <g
                key={idx}
                onClick={() => handleNoteClick(note)}
                className={`staff-note ${
                  currentTime >= note.start_time &&
                  currentTime < note.start_time + note.duration
                    ? 'active'
                    : ''
                }`}
              >
                <circle cx={`${x}%`} cy={y} r="4" fill="#333" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
});

StaffView.displayName = 'StaffView';

/**
 * 和弦图组件
 */
const ChordDiagram = React.memo<{
  chords: Chord[];
  currentTime?: number;
  onChordClick?: (chord: Chord) => void;
}>(({ chords, currentTime = 0, onChordClick }) => {
  const handleChordClick = useCallback((chord: Chord) => {
    onChordClick?.(chord);
  }, [onChordClick]);

  return (
    <div className="chord-diagram">
      <div className="chord-grid">
        {chords.map((chord, idx) => (
          <div
            key={idx}
            className={`chord-card ${
              currentTime >= chord.start_time &&
              currentTime < chord.start_time + chord.duration
                ? 'active'
                : ''
            }`}
            onClick={() => handleChordClick(chord)}
            style={{
              borderColor: getChordColor(chord.name),
            }}
          >
            <div className="chord-name">{chord.name}</div>
            <div className="chord-confidence">
              {(chord.confidence * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ChordDiagram.displayName = 'ChordDiagram';

/**
 * 主 ScoreViewer 组件
 */
export const ScoreViewer = React.memo<ScoreViewerProps>(({
  notes,
  chords,
  viewMode,
  currentTime = 0,
  isPlaying = false,
  onNoteClick,
  onChordClick,
}) => {
  // 缓存处理后的音符
  const processedNotes = useMemo(() => {
    return notes.map(note => ({
      ...note,
      displayName: getNoteName(note.midi_note),
    }));
  }, [notes]);

  // 缓存回调函数
  const handleNoteClick = useCallback((note: Note) => {
    onNoteClick?.(note);
  }, [onNoteClick]);

  const handleChordClick = useCallback((chord: Chord) => {
    onChordClick?.(chord);
  }, [onChordClick]);

  return (
    <div className="score-viewer">
      <div className="score-header">
        <h2>Score Viewer</h2>
        <div className="score-info">
          <span>Notes: {notes.length}</span>
          <span>Chords: {chords.length}</span>
          <span>Mode: {viewMode}</span>
        </div>
      </div>

      <div className="score-content">
        {viewMode === 'tab' && (
          <TabView
            notes={processedNotes}
            currentTime={currentTime}
            onNoteClick={handleNoteClick}
          />
        )}

        {viewMode === 'staff' && (
          <StaffView
            notes={processedNotes}
            currentTime={currentTime}
            onNoteClick={handleNoteClick}
          />
        )}

        {viewMode === 'both' && (
          <>
            <TabView
              notes={processedNotes}
              currentTime={currentTime}
              onNoteClick={handleNoteClick}
            />
            <StaffView
              notes={processedNotes}
              currentTime={currentTime}
              onNoteClick={handleNoteClick}
            />
          </>
        )}

        {viewMode === 'chords' && (
          <ChordDiagram
            chords={chords}
            currentTime={currentTime}
            onChordClick={handleChordClick}
          />
        )}
      </div>
    </div>
  );
});

ScoreViewer.displayName = 'ScoreViewer';

export default ScoreViewer;
