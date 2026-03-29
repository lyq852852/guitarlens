import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import AudioUpload from './components/AudioUpload';
import Waveform from './components/Waveform';
import Player from './components/Player';
import ResultPanel from './components/ResultPanel';
import ScoreViewer from './components/ScoreViewer';

interface ProcessingResult {
  success: boolean;
  result: {
    guitar_analysis: {
      bpm: { bpm: number; confidence: number };
      key: { key: string; confidence: number };
      pitch: { notes: any[] };
    };
    tracks: {
      guitar: string;
      bass: string;
      drums: string;
      vocals: string;
      other: string;
    };
  };
  outputDir: string;
}

function App() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState('');
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 监听处理进度
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onProcessingProgress((data: string) => {
        setProcessingProgress((prev) => prev + '\n' + data);
      });
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeProcessingProgressListener();
      }
    };
  }, []);

  // 监听音频时间更新
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // 处理文件上传
  const handleFileSelect = (file: File) => {
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setResult(null);
    setError('');
    setProcessingProgress('');
  };

  // 处理音频
  const handleProcess = async () => {
    if (!audioFile) {
      setError('Please select an audio file');
      return;
    }

    setIsProcessing(true);
    setError('');
    setProcessingProgress('Starting processing...\n');

    try {
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      const result = await window.electronAPI.processAudio(audioFile.path);
      setResult(result);
      setProcessingProgress((prev) => prev + '\n✅ Processing completed!');
    } catch (err: any) {
      setError(err.message || 'Processing failed');
      setProcessingProgress((prev) => prev + '\n❌ Error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎸 GuitarLens</h1>
        <p>AI-powered guitar tab transcription</p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <AudioUpload onFileSelect={handleFileSelect} />

          {audioUrl && (
            <>
              <Waveform audioUrl={audioUrl} ref={waveformRef} />
              <Player audioUrl={audioUrl} ref={audioRef} />
            </>
          )}

          <button
            className="process-button"
            onClick={handleProcess}
            disabled={!audioFile || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process Audio'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="right-panel">
          {isProcessing && (
            <div className="progress-panel">
              <h3>Processing Progress</h3>
              <pre className="progress-log">{processingProgress}</pre>
            </div>
          )}

          {result && (
            <>
              <ScoreViewer result={result} currentTime={currentTime} isPlaying={isPlaying} />
              <ResultPanel result={result} />
            </>
          )}

          {!isProcessing && !result && (
            <div className="info-panel">
              <h3>How to use</h3>
              <ol>
                <li>Upload an audio file (MP3, WAV, FLAC, etc.)</li>
                <li>View the waveform and play the audio</li>
                <li>Click "Process Audio" to analyze</li>
                <li>View the results (BPM, key, notes)</li>
                <li>See the guitar tab and score</li>
              </ol>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
