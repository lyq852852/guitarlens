#!/usr/bin/env python3
"""
GuitarLens 测试脚本
用于测试引擎功能
"""

import os
import sys
from pathlib import Path
from engine import GuitarLensEngine


def test_engine():
    """测试引擎"""
    
    print("="*60)
    print("GuitarLens 引擎测试")
    print("="*60)
    
    # 创建引擎
    engine = GuitarLensEngine(output_dir="./test_output")
    
    # 检查依赖
    print("\n[TEST 1] 检查依赖...")
    try:
        import demucs
        print("✓ Demucs 已安装")
    except ImportError:
        print("✗ Demucs 未安装")
    
    try:
        import basic_pitch
        print("✓ basic-pitch 已安装")
    except ImportError:
        print("✗ basic-pitch 未安装")
    
    try:
        import librosa
        print("✓ librosa 已安装")
    except ImportError:
        print("✗ librosa 未安装")
    
    # 测试音频处理
    print("\n[TEST 2] 测试音频处理...")
    
    # 创建测试音频（1秒的 440Hz 正弦波）
    import numpy as np
    import soundfile as sf
    
    sr = 22050
    duration = 1.0
    freq = 440.0
    t = np.linspace(0, duration, int(sr * duration))
    y = 0.3 * np.sin(2 * np.pi * freq * t)
    
    test_audio = "./test_output/test_sine.wav"
    os.makedirs("./test_output", exist_ok=True)
    sf.write(test_audio, y, sr)
    print(f"✓ 创建测试音频: {test_audio}")
    
    # 测试 BPM 检测
    print("\n[TEST 3] 测试 BPM 检测...")
    try:
        bpm_info = engine.detect_bpm(test_audio)
        print(f"✓ BPM: {bpm_info.get('bpm', 'N/A')}")
    except Exception as e:
        print(f"✗ BPM 检测失败: {e}")
    
    # 测试调性检测
    print("\n[TEST 4] 测试调性检测...")
    try:
        key_info = engine.detect_key(test_audio)
        print(f"✓ 调性: {key_info.get('key', 'N/A')}")
    except Exception as e:
        print(f"✗ 调性检测失败: {e}")
    
    # 测试音高检测
    print("\n[TEST 5] 测试音高检测...")
    try:
        pitch_info = engine.detect_pitch(test_audio)
        if pitch_info.get('notes'):
            print(f"✓ 检测到 {len(pitch_info['notes'])} 个音符")
        else:
            print("✗ 未检测到音符")
    except Exception as e:
        print(f"✗ 音高检测失败: {e}")
    
    print("\n" + "="*60)
    print("测试完成！")
    print("="*60)


if __name__ == '__main__':
    test_engine()
