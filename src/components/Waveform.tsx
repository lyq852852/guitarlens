import React, { useEffect, useRef, forwardRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import '../styles/components.css';

interface WaveformProps {
  audioUrl: string;
}

const Waveform = forwardRef<any, WaveformProps>(({ audioUrl }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建 WaveSurfer 实例
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4f46e5',
      progressColor: '#818cf8',
      cursorColor: '#ffffff',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 100,
      normalize: true,
      responsive: true,
    });

    wavesurfer.load(audioUrl);

    wavesurferRef.current = wavesurfer;

    // 暴露给父组件
    if (ref) {
      (ref as any).current = wavesurfer;
    }

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl, ref]);

  return (
    <div className="waveform-container">
      <h3>Waveform</h3>
      <div ref={containerRef} className="waveform" />
    </div>
  );
});

Waveform.displayName = 'Waveform';

export default Waveform;
