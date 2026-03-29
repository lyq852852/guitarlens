import React from 'react';
import '../styles/components.css';

interface ResultPanelProps {
  result: {
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
  };
}

const ResultPanel: React.FC<ResultPanelProps> = ({ result }) => {
  const { guitar_analysis, tracks } = result.result;
  const { bpm, key, pitch } = guitar_analysis;

  return (
    <div className="result-panel">
      <h3>Analysis Results</h3>

      <div className="result-section">
        <h4>🎵 BPM</h4>
        <div className="result-item">
          <span className="label">Tempo:</span>
          <span className="value">{bpm.bpm.toFixed(1)} BPM</span>
          <span className="confidence">
            ({(bpm.confidence * 100).toFixed(0)}% confidence)
          </span>
        </div>
      </div>

      <div className="result-section">
        <h4>🎼 Key</h4>
        <div className="result-item">
          <span className="label">Detected Key:</span>
          <span className="value">{key.key}</span>
          <span className="confidence">
            ({(key.confidence * 100).toFixed(0)}% confidence)
          </span>
        </div>
      </div>

      <div className="result-section">
        <h4>🎸 Notes Detected</h4>
        <div className="notes-list">
          <div className="notes-header">
            <span>Note</span>
            <span>Time</span>
            <span>Duration</span>
            <span>Pitch</span>
          </div>
          {pitch.notes.slice(0, 10).map((note, idx) => (
            <div key={idx} className="note-item">
              <span className="note-name">{note.note_name}</span>
              <span className="note-time">
                {note.start_time.toFixed(2)}s
              </span>
              <span className="note-duration">
                {(note.end_time - note.start_time).toFixed(2)}s
              </span>
              <span className="note-pitch">
                {note.pitch.toFixed(1)} Hz
              </span>
            </div>
          ))}
          {pitch.notes.length > 10 && (
            <div className="notes-more">
              ... and {pitch.notes.length - 10} more notes
            </div>
          )}
        </div>
      </div>

      <div className="result-section">
        <h4>📁 Separated Tracks</h4>
        <div className="tracks-list">
          {Object.entries(tracks).map(([name, path]) => (
            <div key={name} className="track-item">
              <span className="track-name">{name}</span>
              <span className="track-path">{path}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
