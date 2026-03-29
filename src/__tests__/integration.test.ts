/**
 * 集成测试 - 音频处理流程
 */

import { GuitarLensEngine } from '../engine_v2';

describe('音频处理集成测试', () => {
  let engine: GuitarLensEngine;

  beforeAll(() => {
    engine = new GuitarLensEngine();
  });

  describe('完整的音频处理流程', () => {
    it('应该成功处理音频文件', async () => {
      const result = await engine.process_audio('test_audio.mp3');

      expect(result).toBeDefined();
      expect(result.bpm).toBeGreaterThan(0);
      expect(result.key).toBeTruthy();
      expect(result.notes).toBeInstanceOf(Array);
      expect(result.chords).toBeInstanceOf(Array);
      expect(result.duration).toBeGreaterThan(0);
    });

    it('应该正确识别音符', async () => {
      const result = await engine.process_audio('test_audio.mp3');

      expect(result.notes.length).toBeGreaterThan(0);
      result.notes.forEach(note => {
        expect(note.pitch).toBeGreaterThan(0);
        expect(note.midi_note).toBeGreaterThanOrEqual(0);
        expect(note.midi_note).toBeLessThanOrEqual(127);
        expect(note.string).toBeGreaterThanOrEqual(1);
        expect(note.string).toBeLessThanOrEqual(6);
        expect(note.fret).toBeGreaterThanOrEqual(0);
        expect(note.fret).toBeLessThanOrEqual(24);
        expect(note.confidence).toBeGreaterThanOrEqual(0);
        expect(note.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('应该正确识别和弦', async () => {
      const result = await engine.process_audio('test_audio.mp3');

      expect(result.chords.length).toBeGreaterThan(0);
      result.chords.forEach(chord => {
        expect(chord.name).toBeTruthy();
        expect(chord.start_time).toBeGreaterThanOrEqual(0);
        expect(chord.duration).toBeGreaterThan(0);
        expect(chord.notes).toBeInstanceOf(Array);
        expect(chord.confidence).toBeGreaterThanOrEqual(0);
        expect(chord.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('应该正确检测 BPM', async () => {
      const result = await engine.process_audio('test_audio.mp3');

      expect(result.bpm).toBeGreaterThan(40);
      expect(result.bpm).toBeLessThan(240);
    });

    it('应该正确检测调性', async () => {
      const result = await engine.process_audio('test_audio.mp3');

      const validKeys = [
        'C', 'G', 'D', 'A', 'E', 'B', 'F#',
        'Db', 'Ab', 'Eb', 'Bb', 'F'
      ];
      expect(validKeys).toContain(result.key);
    });
  });

  describe('缓存功能', () => {
    it('应该缓存处理结果', async () => {
      const result1 = await engine.process_audio('test_audio.mp3', undefined, true);
      const result2 = await engine.process_audio('test_audio.mp3', undefined, true);

      expect(result1).toEqual(result2);
    });

    it('应该支持禁用缓存', async () => {
      const result = await engine.process_audio('test_audio.mp3', undefined, false);

      expect(result).toBeDefined();
      expect(result.notes).toBeInstanceOf(Array);
    });

    it('应该正确管理缓存', () => {
      const stats = engine.get_cache_stats();

      expect(stats.cache_dir).toBeTruthy();
      expect(stats.cache_count).toBeGreaterThanOrEqual(0);
      expect(stats.total_size).toBeGreaterThanOrEqual(0);
      expect(stats.total_size_mb).toBeGreaterThanOrEqual(0);
    });
  });

  describe('进度回调', () => {
    it('应该报告处理进度', async () => {
      const progressValues: number[] = [];

      const callback = (progress: number) => {
        progressValues.push(progress);
      };

      await engine.process_audio('test_audio.mp3', callback);

      expect(progressValues.length).toBeGreaterThan(0);
      expect(progressValues[progressValues.length - 1]).toBe(1.0);
    });

    it('进度值应该单调递增', async () => {
      const progressValues: number[] = [];

      const callback = (progress: number) => {
        progressValues.push(progress);
      };

      await engine.process_audio('test_audio.mp3', callback);

      for (let i = 1; i < progressValues.length; i++) {
        expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
      }
    });
  });

  describe('错误处理', () => {
    it('应该处理不存在的文件', async () => {
      await expect(
        engine.process_audio('nonexistent.mp3')
      ).rejects.toThrow();
    });

    it('应该处理无效的文件格式', async () => {
      await expect(
        engine.process_audio('invalid.txt')
      ).rejects.toThrow();
    });
  });
});
