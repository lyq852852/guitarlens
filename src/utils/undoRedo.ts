/**
 * 撤销/重做功能
 */

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

/**
 * 初始化历史状态
 */
export function initializeHistory<T>(initialState: T): HistoryState<T> {
  return {
    past: [],
    present: initialState,
    future: [],
  };
}

/**
 * 执行操作（添加到历史）
 */
export function executeAction<T>(history: HistoryState<T>, newState: T): HistoryState<T> {
  return {
    past: [...history.past, history.present],
    present: newState,
    future: [], // 执行新操作时清空重做栈
  };
}

/**
 * 撤销
 */
export function undo<T>(history: HistoryState<T>): HistoryState<T> {
  if (history.past.length === 0) {
    return history; // 无法撤销
  }

  const newPast = history.past.slice(0, -1);
  const newPresent = history.past[history.past.length - 1];
  const newFuture = [history.present, ...history.future];

  return {
    past: newPast,
    present: newPresent,
    future: newFuture,
  };
}

/**
 * 重做
 */
export function redo<T>(history: HistoryState<T>): HistoryState<T> {
  if (history.future.length === 0) {
    return history; // 无法重做
  }

  const newPast = [...history.past, history.present];
  const newPresent = history.future[0];
  const newFuture = history.future.slice(1);

  return {
    past: newPast,
    present: newPresent,
    future: newFuture,
  };
}

/**
 * 检查是否可以撤销
 */
export function canUndo<T>(history: HistoryState<T>): boolean {
  return history.past.length > 0;
}

/**
 * 检查是否可以重做
 */
export function canRedo<T>(history: HistoryState<T>): boolean {
  return history.future.length > 0;
}

/**
 * 清空历史
 */
export function clearHistory<T>(state: T): HistoryState<T> {
  return {
    past: [],
    present: state,
    future: [],
  };
}

export default {
  initializeHistory,
  executeAction,
  undo,
  redo,
  canUndo,
  canRedo,
  clearHistory,
};
