/**
 * 编辑器状态管理
 * 管理谱面编辑的状态
 */

export interface EditableNote {
  id: string;
  string: number;
  fret: number;
  duration: number;
  startTime: number;
  endTime: number;
  velocity: number;
}

export interface EditableChord {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  notes: number[];
}

export interface EditorState {
  notes: EditableNote[];
  chords: EditableChord[];
  bpm: number;
  key: string;
  title: string;
  artist: string;
  selectedNoteId: string | null;
  selectedChordId: string | null;
  isDirty: boolean;
}

export interface EditorAction {
  type: string;
  payload?: any;
}

/**
 * 编辑器状态初始化
 */
export function initializeEditorState(result?: any): EditorState {
  if (!result) {
    return {
      notes: [],
      chords: [],
      bpm: 120,
      key: 'C',
      title: 'Untitled',
      artist: 'Unknown',
      selectedNoteId: null,
      selectedChordId: null,
      isDirty: false,
    };
  }

  const { guitar_analysis } = result;
  const notes: EditableNote[] = (guitar_analysis.pitch.notes || []).map((note: any, idx: number) => ({
    id: `note-${idx}`,
    string: 1, // 默认第一弦，用户可编辑
    fret: 0,   // 默认品位 0，用户可编辑
    duration: 4,
    startTime: note.start_time,
    endTime: note.end_time,
    velocity: note.velocity,
  }));

  return {
    notes,
    chords: [],
    bpm: Math.round(guitar_analysis.bpm.bpm),
    key: guitar_analysis.key.key,
    title: 'Guitar Transcription',
    artist: 'GuitarLens',
    selectedNoteId: null,
    selectedChordId: null,
    isDirty: false,
  };
}

/**
 * 编辑器状态 Reducer
 */
export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    // 音符操作
    case 'ADD_NOTE': {
      const newNote: EditableNote = {
        id: `note-${Date.now()}`,
        string: action.payload.string || 1,
        fret: action.payload.fret || 0,
        duration: action.payload.duration || 4,
        startTime: action.payload.startTime || 0,
        endTime: action.payload.endTime || 0.5,
        velocity: action.payload.velocity || 0.8,
      };
      return {
        ...state,
        notes: [...state.notes, newNote],
        isDirty: true,
      };
    }

    case 'UPDATE_NOTE': {
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? { ...note, ...action.payload.changes } : note
        ),
        isDirty: true,
      };
    }

    case 'DELETE_NOTE': {
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload.id),
        selectedNoteId: state.selectedNoteId === action.payload.id ? null : state.selectedNoteId,
        isDirty: true,
      };
    }

    case 'SELECT_NOTE': {
      return {
        ...state,
        selectedNoteId: action.payload.id,
      };
    }

    // 和弦操作
    case 'ADD_CHORD': {
      const newChord: EditableChord = {
        id: `chord-${Date.now()}`,
        name: action.payload.name || 'C',
        startTime: action.payload.startTime || 0,
        endTime: action.payload.endTime || 1,
        notes: action.payload.notes || [],
      };
      return {
        ...state,
        chords: [...state.chords, newChord],
        isDirty: true,
      };
    }

    case 'UPDATE_CHORD': {
      return {
        ...state,
        chords: state.chords.map((chord) =>
          chord.id === action.payload.id ? { ...chord, ...action.payload.changes } : chord
        ),
        isDirty: true,
      };
    }

    case 'DELETE_CHORD': {
      return {
        ...state,
        chords: state.chords.filter((chord) => chord.id !== action.payload.id),
        selectedChordId: state.selectedChordId === action.payload.id ? null : state.selectedChordId,
        isDirty: true,
      };
    }

    case 'SELECT_CHORD': {
      return {
        ...state,
        selectedChordId: action.payload.id,
      };
    }

    // 元数据操作
    case 'UPDATE_METADATA': {
      return {
        ...state,
        ...action.payload,
        isDirty: true,
      };
    }

    case 'SET_CLEAN': {
      return {
        ...state,
        isDirty: false,
      };
    }

    case 'RESET': {
      return action.payload;
    }

    default:
      return state;
  }
}

/**
 * 编辑器操作辅助函数
 */
export const editorActions = {
  addNote: (payload: any) => ({ type: 'ADD_NOTE', payload }),
  updateNote: (id: string, changes: any) => ({ type: 'UPDATE_NOTE', payload: { id, changes } }),
  deleteNote: (id: string) => ({ type: 'DELETE_NOTE', payload: { id } }),
  selectNote: (id: string) => ({ type: 'SELECT_NOTE', payload: { id } }),

  addChord: (payload: any) => ({ type: 'ADD_CHORD', payload }),
  updateChord: (id: string, changes: any) => ({ type: 'UPDATE_CHORD', payload: { id, changes } }),
  deleteChord: (id: string) => ({ type: 'DELETE_CHORD', payload: { id } }),
  selectChord: (id: string) => ({ type: 'SELECT_CHORD', payload: { id } }),

  updateMetadata: (payload: any) => ({ type: 'UPDATE_METADATA', payload }),
  setClean: () => ({ type: 'SET_CLEAN' }),
  reset: (state: EditorState) => ({ type: 'RESET', payload: state }),
};

export default {
  initializeEditorState,
  editorReducer,
  editorActions,
};
