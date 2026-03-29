/**
 * 响应式设计 Hook
 * 用于检测屏幕尺寸和设备类型
 */

import { useState, useEffect } from 'react';

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface ScreenInfo {
  width: number;
  height: number;
  size: ScreenSize;
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

const getScreenSize = (width: number): ScreenSize => {
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS.xxl) return 'xl';
  return 'xxl';
};

const getDeviceType = (width: number): DeviceType => {
  if (width < BREAKPOINTS.md) return 'mobile';
  if (width < BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
};

export const useResponsive = (): ScreenInfo => {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    const size = getScreenSize(width);
    const deviceType = getDeviceType(width);

    return {
      width,
      height,
      size,
      deviceType,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const size = getScreenSize(width);
      const deviceType = getDeviceType(width);

      setScreenInfo({
        width,
        height,
        size,
        deviceType,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenInfo;
};

/**
 * 媒体查询 Hook
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};
