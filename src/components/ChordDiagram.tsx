import React from 'react';
import { getChordDiagram } from '../utils/chordRecognizer';
import '../styles/score.css';

interface ChordDiagramProps {
  score: any;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ score }) => {
  // 示例和弦
  const chords = ['C', 'G', 'D', 'A', 'E', 'Am', 'Em', 'Dm'];

  return (
    <div className="chord-diagram-view">
      <div className="chord-grid">
        {chords.map((chordName) => (
          <ChordBox key={chordName} chordName={chordName} />
        ))}
      </div>
    </div>
  );
};

interface ChordBoxProps {
  chordName: string;
}

const ChordBox: React.FC<ChordBoxProps> = ({ chordName }) => {
  const diagram = getChordDiagram(chordName);

  return (
    <div className="chord-box">
      <h4>{chordName}</h4>
      <div className="chord-diagram">
        {/* 绘制和弦图 */}
        <svg width="80" height="100" viewBox="0 0 80 100">
          {/* 弦 */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`string-${i}`}
              x1={10 + i * 12}
              y1="10"
              x2={10 + i * 12}
              y2="90"
              stroke="#333"
              strokeWidth="1"
            />
          ))}

          {/* 品位 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={`fret-${i}`}
              x1="10"
              y1={10 + i * 20}
              x2="70"
              y2={10 + i * 20}
              stroke="#333"
              strokeWidth="1"
            />
          ))}

          {/* 手指位置 */}
          {diagram.frets.map((fret, stringIdx) => {
            if (fret === 0) {
              // 开放弦
              return (
                <circle
                  key={`open-${stringIdx}`}
                  cx={10 + stringIdx * 12}
                  cy="5"
                  r="3"
                  fill="none"
                  stroke="#333"
                  strokeWidth="1"
                />
              );
            } else {
              // 品位
              return (
                <circle
                  key={`fret-${stringIdx}`}
                  cx={10 + stringIdx * 12}
                  cy={10 + (fret - 1) * 20}
                  r="4"
                  fill="#667eea"
                />
              );
            }
          })}
        </svg>
      </div>
    </div>
  );
};

export default ChordDiagram;
