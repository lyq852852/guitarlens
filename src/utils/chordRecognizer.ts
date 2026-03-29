/**
 * 和弦识别工具
 * 基于音符识别和弦类型
 */

interface ChordInfo {
  name: string;
  root: string;
  type: string;
  intervals: number[];
}

// 标准和弦类型
const CHORD_TYPES: { [key: string]: number[] } = {
  // 三和弦
  major: [0, 4, 7],           // 大三和弦
  minor: [0, 3, 7],           // 小三和弦
  augmented: [0, 4, 8],       // 增三和弦
  diminished: [0, 3, 6],      // 减三和弦

  // 七和弦
  major7: [0, 4, 7, 11],      // 大七和弦
  minor7: [0, 3, 7, 10],      // 小七和弦
  dominant7: [0, 4, 7, 10],   // 属七和弦
  halfDiminished7: [0, 3, 6, 10], // 半减七和弦
  diminished7: [0, 3, 6, 9],  // 减七和弦

  // 九和弦
  major9: [0, 4, 7, 11, 14],
  minor9: [0, 3, 7, 10, 14],
  dominant9: [0, 4, 7, 10, 14],

  // 挂留和弦
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],

  // 加音和弦
  add9: [0, 4, 7, 14],
  add11: [0, 4, 7, 17],
};

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * 将 MIDI 音符转换为相对于根音的半音数
 */
function midiToInterval(midi: number, rootMidi: number): number {
  let interval = (midi - rootMidi) % 12;
  if (interval < 0) interval += 12;
  return interval;
}

/**
 * 识别和弦
 */
export function recognizeChord(midiNotes: number[]): ChordInfo | null {
  if (midiNotes.length < 2) return null;

  // 排序并去重
  const uniqueNotes = Array.from(new Set(midiNotes.map((m) => m % 12))).sort((a, b) => a - b);

  if (uniqueNotes.length < 2) return null;

  // 尝试每个音作为根音
  for (const rootMidi of uniqueNotes) {
    const intervals = uniqueNotes.map((m) => midiToInterval(m, rootMidi));

    // 尝试匹配和弦类型
    for (const [chordType, chordIntervals] of Object.entries(CHORD_TYPES)) {
      if (intervalsMatch(intervals, chordIntervals)) {
        const rootNote = NOTE_NAMES[rootMidi];
        return {
          name: `${rootNote}${getChordSuffix(chordType)}`,
          root: rootNote,
          type: chordType,
          intervals,
        };
      }
    }
  }

  return null;
}

/**
 * 检查音程是否匹配
 */
function intervalsMatch(actual: number[], expected: number[]): boolean {
  if (actual.length !== expected.length) return false;
  return actual.every((interval, i) => interval === expected[i]);
}

/**
 * 获取和弦后缀
 */
function getChordSuffix(chordType: string): string {
  const suffixes: { [key: string]: string } = {
    major: '',
    minor: 'm',
    augmented: 'aug',
    diminished: 'dim',
    major7: 'maj7',
    minor7: 'm7',
    dominant7: '7',
    halfDiminished7: 'm7b5',
    diminished7: 'dim7',
    major9: 'maj9',
    minor9: 'm9',
    dominant9: '9',
    sus2: 'sus2',
    sus4: 'sus4',
    add9: 'add9',
    add11: 'add11',
  };
  return suffixes[chordType] || '';
}

/**
 * 获取和弦的所有可能指位
 */
export function getChordVoicings(
  chordName: string,
  maxFret: number = 12
): Array<{ string: number; fret: number }[]> {
  // 简化版本：返回基本指位
  // 实际应该有完整的和弦库

  const voicings: { [key: string]: Array<{ string: number; fret: number }[]> } = {
    C: [
      [
        { string: 1, fret: 0 },
        { string: 2, fret: 1 },
        { string: 3, fret: 0 },
        { string: 4, fret: 2 },
        { string: 5, fret: 3 },
        { string: 6, fret: 0 },
      ],
    ],
    G: [
      [
        { string: 1, fret: 3 },
        { string: 2, fret: 0 },
        { string: 3, fret: 0 },
        { string: 4, fret: 0 },
        { string: 5, fret: 2 },
        { string: 6, fret: 3 },
      ],
    ],
    D: [
      [
        { string: 1, fret: 2 },
        { string: 2, fret: 3 },
        { string: 3, fret: 2 },
        { string: 4, fret: 0 },
        { string: 5, fret: 0 },
        { string: 6, fret: 0 },
      ],
    ],
    A: [
      [
        { string: 1, fret: 0 },
        { string: 2, fret: 0 },
        { string: 3, fret: 2 },
        { string: 4, fret: 2 },
        { string: 5, fret: 2 },
        { string: 6, fret: 0 },
      ],
    ],
    E: [
      [
        { string: 1, fret: 0 },
        { string: 2, fret: 2 },
        { string: 3, fret: 2 },
        { string: 4, fret: 1 },
        { string: 5, fret: 0 },
        { string: 6, fret: 0 },
      ],
    ],
    Am: [
      [
        { string: 1, fret: 0 },
        { string: 2, fret: 1 },
        { string: 3, fret: 2 },
        { string: 4, fret: 2 },
        { string: 5, fret: 1 },
        { string: 6, fret: 0 },
      ],
    ],
    Em: [
      [
        { string: 1, fret: 0 },
        { string: 2, fret: 2 },
        { string: 3, fret: 2 },
        { string: 4, fret: 0 },
        { string: 5, fret: 0 },
        { string: 6, fret: 0 },
      ],
    ],
  };

  return voicings[chordName] || [];
}

/**
 * 获取和弦的标准指位图
 */
export function getChordDiagram(chordName: string): {
  frets: number[];
  fingers: number[];
  barres: number[];
} {
  const diagrams: {
    [key: string]: { frets: number[]; fingers: number[]; barres: number[] };
  } = {
    C: { frets: [0, 1, 0, 2, 3, 0], fingers: [0, 1, 0, 2, 3, 0], barres: [] },
    G: { frets: [3, 0, 0, 0, 2, 3], fingers: [3, 0, 0, 0, 2, 3], barres: [] },
    D: { frets: [2, 3, 2, 0, 0, 0], fingers: [2, 3, 2, 0, 0, 0], barres: [] },
    A: { frets: [0, 0, 2, 2, 2, 0], fingers: [0, 0, 2, 2, 2, 0], barres: [] },
    E: { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 2, 1, 0, 0], barres: [] },
    Am: { frets: [0, 1, 2, 2, 1, 0], fingers: [0, 1, 2, 2, 1, 0], barres: [] },
    Em: { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 2, 0, 0, 0], barres: [] },
    Dm: { frets: [1, 3, 2, 0, 0, 0], fingers: [1, 3, 2, 0, 0, 0], barres: [] },
    F: { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 3, 2, 1, 1], barres: [1] },
    Bm: { frets: [2, 4, 4, 4, 3, 2], fingers: [2, 4, 4, 4, 3, 2], barres: [2] },
  };

  return diagrams[chordName] || { frets: [0, 0, 0, 0, 0, 0], fingers: [0, 0, 0, 0, 0, 0], barres: [] };
}

export default {
  recognizeChord,
  getChordVoicings,
  getChordDiagram,
};
