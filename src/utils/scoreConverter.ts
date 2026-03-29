/**
 * 谱面转换工具
 * 将 Python 识别结果转换为 alphaTab 格式
 */

import { notesToTabs, calculateDuration } from './noteToTab';

interface ProcessingResult {
  guitar_analysis: {
    bpm: { bpm: number };
    key: { key: string };
    pitch: { notes: any[] };
  };
}

interface AlphaTabScore {
  title: string;
  artist: string;
  tempo: number;
  key: string;
  tracks: AlphaTabTrack[];
}

interface AlphaTabTrack {
  channel: {
    channel: number;
    effectChannel: number;
  };
  measures: AlphaTabMeasure[];
}

interface AlphaTabMeasure {
  beats: AlphaTabBeat[];
}

interface AlphaTabBeat {
  duration: {
    value: number;
  };
  notes: AlphaTabNote[];
}

interface AlphaTabNote {
  value: number; // 品位
  string: number; // 弦
}

/**
 * 将处理结果转换为 alphaTab 格式
 */
export function convertToAlphaTab(result: ProcessingResult): AlphaTabScore {
  const { bpm, key, pitch } = result.guitar_analysis;
  const notes = pitch.notes || [];

  // 转换为 Tab
  const tabs = notesToTabs(notes, bpm.bpm);

  // 分组为小节
  const measures = groupIntoMeasures(tabs, bpm.bpm);

  // 创建 alphaTab 对象
  const score: AlphaTabScore = {
    title: 'Guitar Transcription',
    artist: 'GuitarLens',
    tempo: Math.round(bpm.bpm),
    key: key.key,
    tracks: [
      {
        channel: {
          channel: 0,
          effectChannel: 0,
        },
        measures: measures.map((measure) => ({
          beats: measure.map((tab) => ({
            duration: {
              value: tab.duration,
            },
            notes: [
              {
                value: tab.fret,
                string: tab.string,
              },
            ],
          })),
        })),
      },
    ],
  };

  return score;
}

/**
 * 将 Tab 分组为小节
 * 假设 4/4 拍子
 */
function groupIntoMeasures(tabs: any[], bpm: number): any[][] {
  const measures: any[][] = [];
  let currentMeasure: any[] = [];
  let beatCount = 0;
  const beatsPerMeasure = 4; // 4/4 拍子

  for (const tab of tabs) {
    // 计算这个音符占用的拍数
    const beats = 4 / tab.duration; // 4 = 四分音符

    if (beatCount + beats > beatsPerMeasure) {
      // 开始新小节
      if (currentMeasure.length > 0) {
        measures.push(currentMeasure);
      }
      currentMeasure = [tab];
      beatCount = beats;
    } else {
      currentMeasure.push(tab);
      beatCount += beats;
    }
  }

  // 添加最后一个小节
  if (currentMeasure.length > 0) {
    measures.push(currentMeasure);
  }

  return measures;
}

/**
 * 生成 GuitarPro 格式的 XML
 */
export function generateGuitarProXml(result: ProcessingResult): string {
  const { bpm, key, pitch } = result.guitar_analysis;
  const notes = pitch.notes || [];

  // 简化版本：生成基本的 XML 结构
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<GPFILE>\n';
  xml += '  <TITLE>Guitar Transcription</TITLE>\n';
  xml += `  <TEMPO>${Math.round(bpm.bpm)}</TEMPO>\n`;
  xml += `  <KEY>${key.key}</KEY>\n`;
  xml += '  <NOTES>\n';

  for (const note of notes) {
    xml += `    <NOTE>\n`;
    xml += `      <TIME>${note.start_time}</TIME>\n`;
    xml += `      <PITCH>${note.pitch}</PITCH>\n`;
    xml += `      <NAME>${note.note_name}</NAME>\n`;
    xml += `    </NOTE>\n`;
  }

  xml += '  </NOTES>\n';
  xml += '</GPFILE>\n';

  return xml;
}

/**
 * 生成 MusicXML 格式
 */
export function generateMusicXml(result: ProcessingResult): string {
  const { bpm, key, pitch } = result.guitar_analysis;
  const notes = pitch.notes || [];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n';
  xml += '<score-partwise version="3.1">\n';
  xml += '  <work>\n';
  xml += '    <work-title>Guitar Transcription</work-title>\n';
  xml += '  </work>\n';
  xml += '  <part-list>\n';
  xml += '    <score-part id="P1">\n';
  xml += '      <part-name>Guitar</part-name>\n';
  xml += '      <score-instrument id="P1-I1">\n';
  xml += '        <instrument-name>Guitar</instrument-name>\n';
  xml += '      </score-instrument>\n';
  xml += '    </score-part>\n';
  xml += '  </part-list>\n';
  xml += '  <part id="P1">\n';

  // 添加音符
  for (const note of notes) {
    xml += '    <measure>\n';
    xml += '      <note>\n';
    xml += `        <pitch>\n`;
    xml += `          <step>${note.note_name.charAt(0)}</step>\n`;
    xml += `          <octave>${note.note_name.slice(-1)}</octave>\n`;
    xml += `        </pitch>\n`;
    xml += `        <duration>4</duration>\n`;
    xml += `        <type>quarter</type>\n`;
    xml += '      </note>\n';
    xml += '    </measure>\n';
  }

  xml += '  </part>\n';
  xml += '</score-partwise>\n';

  return xml;
}

export default {
  convertToAlphaTab,
  generateGuitarProXml,
  generateMusicXml,
};
