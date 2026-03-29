#!/usr/bin/env python3
"""
GuitarLens - 吉他扒带软件 Phase 1
Python 音频处理引擎

核心功能：
1. 音轨分离（Demucs）
2. 音高识别（basic-pitch）
3. 和弦识别
4. 节拍检测
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import numpy as np
import librosa
import soundfile as sf
from basic_pitch.inference import predict
from basic_pitch import ICASSP_2022_MODEL_PATH
import warnings

warnings.filterwarnings('ignore')


class GuitarLensEngine:
    """吉他扒带引擎"""
    
    def __init__(self, output_dir: str = "./output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.sr = 22050  # 采样率
        
    def load_audio(self, audio_path: str) -> Tuple[np.ndarray, int]:
        """加载音频文件"""
        print(f"[INFO] 加载音频: {audio_path}")
        y, sr = librosa.load(audio_path, sr=self.sr, mono=False)
        if len(y.shape) > 1:
            y = librosa.to_mono(y)
        print(f"[INFO] 音频加载完成: {y.shape}, 采样率: {sr}")
        return y, sr
    
    def separate_tracks(self, audio_path: str) -> Dict[str, str]:
        """
        使用 Demucs 分离音轨
        返回分离后各轨道的文件路径
        """
        print(f"\n[INFO] 开始分离音轨...")
        
        try:
            import demucs.separate
            from demucs.pretrained import get_model
            
            # 加载 Demucs 模型
            print("[INFO] 加载 Demucs 模型 (htdemucs_6s)...")
            model = get_model('htdemucs_6s')
            
            # 分离
            print("[INFO] 分离中... (这可能需要几分钟)")
            wav = model.separate_file(audio_path)
            
            # 保存分离结果
            sources = {}
            for source_name, source_wav in wav.items():
                output_path = self.output_dir / f"{source_name}.wav"
                sf.write(str(output_path), source_wav.cpu().numpy().T, self.sr)
                sources[source_name] = str(output_path)
                print(f"[INFO] 保存 {source_name}: {output_path}")
            
            return sources
            
        except ImportError:
            print("[ERROR] Demucs 未安装，请运行: pip install demucs")
            return {}
    
    def detect_pitch(self, audio_path: str) -> Dict:
        """
        使用 basic-pitch 检测音高
        返回音符信息
        """
        print(f"\n[INFO] 检测音高: {audio_path}")
        
        try:
            # 加载音频
            y, sr = librosa.load(audio_path, sr=22050, mono=True)
            
            # 预测音高
            print("[INFO] 运行 basic-pitch 模型...")
            model_output, midi_data, note_events = predict(
                audio_path,
                model_or_model_path=ICASSP_2022_MODEL_PATH,
                onset_threshold=0.5,
                frame_threshold=0.3,
                minimum_note_length=0.127,
                minimum_freq=80.0,
                maximum_freq=400.0,  # 吉他范围
                melodia_trick=True,
                energy_threshold=0.0
            )
            
            # 转换为可读格式
            notes = []
            for note in note_events:
                notes.append({
                    'start_time': float(note.start_time),
                    'end_time': float(note.end_time),
                    'pitch': float(note.pitch),
                    'velocity': float(note.velocity),
                    'note_name': self._pitch_to_note_name(note.pitch)
                })
            
            print(f"[INFO] 检测到 {len(notes)} 个音符")
            return {
                'notes': notes,
                'midi_data': str(midi_data),
                'sample_rate': sr
            }
            
        except Exception as e:
            print(f"[ERROR] 音高检测失败: {e}")
            return {}
    
    def detect_bpm(self, audio_path: str) -> Dict:
        """检测 BPM"""
        print(f"\n[INFO] 检测 BPM...")
        
        try:
            y, sr = librosa.load(audio_path, sr=self.sr, mono=True)
            
            # 计算节拍
            onset_env = librosa.onset.onset_strength(y=y, sr=sr)
            bpm = librosa.beat.tempo(onset_envelope=onset_env, sr=sr)[0]
            
            # 获取节拍帧
            _, beats = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr)
            beat_times = librosa.frames_to_time(beats, sr=sr)
            
            print(f"[INFO] BPM: {bpm:.1f}")
            
            return {
                'bpm': float(bpm),
                'beat_times': beat_times.tolist(),
                'confidence': 0.8  # 简化，实际应该计算置信度
            }
            
        except Exception as e:
            print(f"[ERROR] BPM 检测失败: {e}")
            return {}
    
    def detect_key(self, audio_path: str) -> Dict:
        """检测调性"""
        print(f"\n[INFO] 检测调性...")
        
        try:
            y, sr = librosa.load(audio_path, sr=self.sr, mono=True)
            
            # 计算色度特征
            chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
            chroma_mean = chroma.mean(axis=1)
            
            # 12 个音符
            notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
            key_idx = np.argmax(chroma_mean)
            key = notes[key_idx]
            
            print(f"[INFO] 调性: {key}")
            
            return {
                'key': key,
                'confidence': float(chroma_mean[key_idx] / chroma_mean.sum())
            }
            
        except Exception as e:
            print(f"[ERROR] 调性检测失败: {e}")
            return {}
    
    def recognize_chords(self, notes: List[Dict]) -> List[Dict]:
        """
        识别和弦
        基于检测到的音符序列
        """
        print(f"\n[INFO] 识别和弦...")
        
        # 简化版本：基于音符的和弦识别
        # 实际应该用更复杂的算法或模型
        
        chords = []
        # TODO: 实现完整的和弦识别算法
        
        return chords
    
    def process_guitar_track(self, audio_path: str) -> Dict:
        """
        处理吉他轨道的完整流程
        """
        print(f"\n{'='*60}")
        print(f"GuitarLens - 吉他轨道分析")
        print(f"{'='*60}")
        
        result = {
            'input_file': audio_path,
            'output_dir': str(self.output_dir),
            'analysis': {}
        }
        
        # 1. 检测 BPM
        bpm_info = self.detect_bpm(audio_path)
        result['analysis']['bpm'] = bpm_info
        
        # 2. 检测调性
        key_info = self.detect_key(audio_path)
        result['analysis']['key'] = key_info
        
        # 3. 检测音高
        pitch_info = self.detect_pitch(audio_path)
        result['analysis']['pitch'] = pitch_info
        
        # 4. 识别和弦
        if pitch_info.get('notes'):
            chords = self.recognize_chords(pitch_info['notes'])
            result['analysis']['chords'] = chords
        
        return result
    
    def process_full_song(self, audio_path: str) -> Dict:
        """
        处理完整歌曲
        1. 分离音轨
        2. 分析吉他轨
        """
        print(f"\n{'='*60}")
        print(f"GuitarLens - 完整歌曲处理")
        print(f"{'='*60}")
        
        result = {
            'input_file': audio_path,
            'output_dir': str(self.output_dir),
            'tracks': {},
            'guitar_analysis': {}
        }
        
        # 1. 分离音轨
        print("\n[STEP 1] 分离音轨...")
        sources = self.separate_tracks(audio_path)
        result['tracks'] = sources
        
        # 2. 分析吉他轨
        if 'guitar' in sources:
            print("\n[STEP 2] 分析吉他轨...")
            guitar_analysis = self.process_guitar_track(sources['guitar'])
            result['guitar_analysis'] = guitar_analysis['analysis']
        
        return result
    
    @staticmethod
    def _pitch_to_note_name(pitch: float) -> str:
        """将频率转换为音符名称"""
        notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        
        # A4 = 440 Hz, MIDI 69
        a4_midi = 69
        a4_freq = 440.0
        
        # 计算 MIDI 音符号
        midi_note = round(12 * np.log2(pitch / a4_freq) + a4_midi)
        
        if midi_note < 0 or midi_note > 127:
            return "Unknown"
        
        octave = (midi_note // 12) - 1
        note_idx = midi_note % 12
        
        return f"{notes[note_idx]}{octave}"


def main():
    parser = argparse.ArgumentParser(description='GuitarLens - 吉他扒带引擎')
    parser.add_argument('audio_file', help='输入音频文件路径')
    parser.add_argument('--output', '-o', default='./output', help='输出目录')
    parser.add_argument('--mode', '-m', choices=['full', 'guitar_only'], 
                       default='full', help='处理模式')
    
    args = parser.parse_args()
    
    # 检查文件存在
    if not os.path.exists(args.audio_file):
        print(f"[ERROR] 文件不存在: {args.audio_file}")
        sys.exit(1)
    
    # 创建引擎
    engine = GuitarLensEngine(output_dir=args.output)
    
    # 处理
    if args.mode == 'full':
        result = engine.process_full_song(args.audio_file)
    else:
        result = engine.process_guitar_track(args.audio_file)
    
    # 保存结果
    output_json = Path(args.output) / 'analysis_result.json'
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\n[SUCCESS] 分析完成！")
    print(f"[INFO] 结果已保存到: {output_json}")
    print(f"\n{json.dumps(result, indent=2, ensure_ascii=False)}")


if __name__ == '__main__':
    main()
