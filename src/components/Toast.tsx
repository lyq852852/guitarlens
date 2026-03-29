/**
 * 通知/提示组件
 * 显示成功、错误、警告、信息提示
 */

import React, { useEffect, useState } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={() => onClose(id)}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
}) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

/**
 * Toast 管理 Hook
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    message: string,
    type: ToastType = 'info',
    duration?: number
  ) => {
    const id = Date.now().toString();
    const toast: ToastMessage = { id, type, message, duration };
    setToasts(prev => [...prev, toast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const success = (message: string, duration?: number) =>
    addToast(message, 'success', duration);
  const error = (message: string, duration?: number) =>
    addToast(message, 'error', duration);
  const warning = (message: string, duration?: number) =>
    addToast(message, 'warning', duration);
  const info = (message: string, duration?: number) =>
    addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};
