/**
 * 编辑器 Hook
 */

import { useReducer, useCallback } from 'react';
import { EditorState, editorReducer, initializeEditorState, editorActions } from '../utils/editorState';
import { HistoryState, initializeHistory, executeAction, undo, redo, canUndo, canRedo } from '../utils/undoRedo';

export function useEditor(initialResult?: any) {
  const initialState = initializeEditorState(initialResult);
  const [editorState, dispatch] = useReducer(editorReducer, initialState);
  const [history, setHistory] = useReducer(
    (state: HistoryState<EditorState>, action: any) => {
      switch (action.type) {
        case 'EXECUTE':
          return executeAction(state, action.payload);
        case 'UNDO':
          return undo(state);
        case 'REDO':
          return redo(state);
        default:
          return state;
      }
    },
    initialState,
    (state) => initializeHistory(state)
  );

  // 添加音符
  const addNote = useCallback(
    (payload: any) => {
      const action = editorActions.addNote(payload);
      dispatch(action);
      setHistory({ type: 'EXECUTE', payload: { ...editorState, ...action.payload } });
    },
    [editorState]
  );

  // 更新音符
  const updateNote = useCallback(
    (id: string, changes: any) => {
      const action = editorActions.updateNote(id, changes);
      dispatch(action);
      setHistory({ type: 'EXECUTE', payload: { ...editorState, ...action.payload } });
    },
    [editorState]
  );

  // 删除音符
  const deleteNote = useCallback(
    (id: string) => {
      const action = editorActions.deleteNote(id);
      dispatch(action);
      setHistory({ type: 'EXECUTE', payload: { ...editorState, ...action.payload } });
    },
    [editorState]
  );

  // 撤销
  const handleUndo = useCallback(() => {
    setHistory({ type: 'UNDO' });
    dispatch(editorActions.reset(history.present));
  }, [history]);

  // 重做
  const handleRedo = useCallback(() => {
    setHistory({ type: 'REDO' });
    dispatch(editorActions.reset(history.present));
  }, [history]);

  return {
    state: history.present,
    addNote,
    updateNote,
    deleteNote,
    undo: handleUndo,
    redo: handleRedo,
    canUndo: canUndo(history),
    canRedo: canRedo(history),
  };
}

export default useEditor;
