/**
 * 主题管理 Hook
 * 支持深色/浅色主题切换
 */

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

const LIGHT_THEME: ThemeConfig = {
  primaryColor: '#667eea',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  borderColor: '#e0e0e0',
};

const DARK_THEME: ThemeConfig = {
  primaryColor: '#667eea',
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
  borderColor: '#333333',
};

export const useTheme = (initialTheme: Theme = 'auto') => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [isDark, setIsDark] = useState(false);

  // 检测系统主题偏好
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'auto') {
        setIsDark(e.matches);
      }
    };

    // 初始化
    if (theme === 'auto') {
      setIsDark(mediaQuery.matches);
    } else {
      setIsDark(theme === 'dark');
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 应用主题到 DOM
  useEffect(() => {
    const root = document.documentElement;
    const config = isDark ? DARK_THEME : LIGHT_THEME;

    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    root.classList.toggle('dark-theme', isDark);
    root.classList.toggle('light-theme', !isDark);
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'auto') return 'light';
      if (prev === 'light') return 'dark';
      return 'auto';
    });
  }, []);

  const setDarkMode = useCallback((dark: boolean) => {
    setTheme(dark ? 'dark' : 'light');
  }, []);

  return {
    theme,
    isDark,
    toggleTheme,
    setDarkMode,
    config: isDark ? DARK_THEME : LIGHT_THEME,
  };
};
