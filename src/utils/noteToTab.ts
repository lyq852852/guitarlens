/**
 * 音符转 Tab 转换工具
 * 将 Python 识别的音符转换为吉他 Tab 指位
 */

interface Note {
  start_time: number;
  end_time: number;
  pitch: number;
  note_name: string;
  velocity: number;
}

interface TabNote {
  string: number; // 1-6（从高到低）
  fret: number;   // 品位 0-24
  duration: number; // 时值
}

// 标准调弦（E A D G B E）
const STANDARD_TUNING = [
  { string: 1, pitch: 329.63 }, // E4
  { string: 2, pitch: 246.94 }, // B3
  { string: 3, pitch: 196.00 }, // G3
  { string: 4, pitch: 146.83 }, // D3
  { string: 5, pitch: 110.00 }, // A2
  { string: 6, pitch: 82.41 },  // E2
];

/**
 * 将频率转换为 MIDI 音符号
 */
export function frequencyToMidi(frequency: number): number {
  return Math.round(12 * Math.log2(frequency / 440) + 69);
}

/**
 * 将 MIDI 音符号转换为频率
 */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * 将音符转换为 Tab 指位
 * 返回最优的弦和品位组合
 */
export function noteToTab(note: Note): TabNote {
  const midi = frequencyToMidi(note.pitch);
  const duration = calculateDuration(note.start_time, note.end_time);

  // 尝试在每根弦上找到最优指位
  let bestTab: TabNote | null = null;
  let minDistance = Infinity;

  for (const tuning of STANDARD_TUNING) {
    const openMidi = frequencyToMidi(tuning.pitch);
    const fret = midi - openMidi;

    // 检查品位是否在有效范围内（0-24）
    if (fret >= 0 && fret <= 24) {
      // 优先选择较低的品位（更容易弹奏）
      if (fret < minDistance) {
        minDistance = fret;
        bestTab = {
          string: tuning.string,
          fret,
          duration,
        };
      }
    }
  }

  // 如果没找到，返回最接近的指位
  if (!bestTab) {
    const midi = frequencyToMidi(note.pitch);
    const openMidi = frequencyToMidi(STANDARD_TUNING[0].pitch);
    const fret = Math.max(0, Math.min(24, midi - openMidi));
    bestTab = {
      string: 1,
      fret,
      duration,
    };
  }

  return bestTab;
}

/**
 * 计算音符时值
 * 返回相对于 BPM 的时值
 */
export function calculateDuration(
  startTime: number,
  endTime: number,
  bpm: number = 120
): number {
  const duration = endTime - startTime;
  const beatDuration = 60 / bpm; // 四分音符的时长（秒）

  // 计算相对于四分音符的倍数
  const beats = duration / beatDuration;

  // 转换为标准时值
  if (beats < 0.25) return 32; // 三十二分音符
  if (beats < 0.5) return 16;  // 十六分音符
  if (beats < 1) return 8;     // 八分音符
  if (beats < 2) return 4;     // 四分音符
  if (beats < 4) return 2;     // 二分音符
  return 1;                     // 全音符
}

/**
 * 将音符列表转换为 Tab 列表
 */
export function notesToTabs(notes: Note[], bpm: number = 120): TabNote[] {
  return notes.map((note) => {
    const tab = noteToTab(note);
    tab.duration = calculateDuration(note.start_time, note.end_time, bpm);
    return tab;
  });
}

/**
 * 获取音符名称
 */
export function getMidiNoteName(midi: number): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const noteName = notes[midi % 12];
  return `${noteName}${octave}`;
}

/**
 * 获取弦的开放音符
 */
export function getOpenStringNote(string: number): string {
  const openNotes = ['E', 'B', 'G', 'D', 'A', 'E'];
  return openNotes[string - 1];
}

/**
 * 获取指定弦和品位的音符
 */
export function getTabNote(string: number, fret: number): string {
  const openNote = getOpenStringNote(string);
  const openMidi = frequencyToMidi(STANDARD_TUNING[string - 1].pitch);
  const noteMidi = openMidi + fret;
  return getMidiNoteName(noteMidi);
}

export default {
  frequencyToMidi,
  midiToFrequency,
  noteToTab,
  calculateDuration,
  notesToTabs,
  getMidiNoteName,
  getOpenStringNote,
  getTabNote,
};
