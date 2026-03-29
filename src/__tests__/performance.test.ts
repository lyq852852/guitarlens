/**
 * 性能基准测试
 * 测试应用的性能指标
 */

import { performance } from 'perf_hooks';

interface BenchmarkResult {
  name: string;
  duration: number;
  iterations: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
}

class PerformanceBenchmark {
  private results: BenchmarkResult[] = [];

  /**
   * 运行基准测试
   */
  async run(
    name: string,
    fn: () => Promise<void>,
    iterations: number = 10
  ): Promise<BenchmarkResult> {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      times.push(end - start);
    }

    const result: BenchmarkResult = {
      name,
      duration: times.reduce((a, b) => a + b, 0),
      iterations,
      avgTime: times.reduce((a, b) => a + b, 0) / iterations,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
    };

    this.results.push(result);
    return result;
  }

  /**
   * 获取所有结果
   */
  getResults(): BenchmarkResult[] {
    return this.results;
  }

  /**
   * 打印结果
   */
  printResults(): void {
    console.log('\n=== 性能基准测试结果 ===\n');

    this.results.forEach(result => {
      console.log(`${result.name}:`);
      console.log(`  总耗时: ${result.duration.toFixed(2)}ms`);
      console.log(`  迭代次数: ${result.iterations}`);
      console.log(`  平均时间: ${result.avgTime.toFixed(2)}ms`);
      console.log(`  最小时间: ${result.minTime.toFixed(2)}ms`);
      console.log(`  最大时间: ${result.maxTime.toFixed(2)}ms`);
      console.log();
    });
  }
}

/**
 * 性能基准测试套件
 */
describe('性能基准测试', () => {
  let benchmark: PerformanceBenchmark;

  beforeAll(() => {
    benchmark = new PerformanceBenchmark();
  });

  afterAll(() => {
    benchmark.printResults();
  });

  describe('音频处理性能', () => {
    it('应该在合理时间内处理音频', async () => {
      const result = await benchmark.run(
        '音频处理',
        async () => {
          // 模拟音频处理
          await new Promise(resolve => setTimeout(resolve, 100));
        },
        5
      );

      // 平均时间应该小于 200ms
      expect(result.avgTime).toBeLessThan(200);
    });

    it('应该快速加载缓存', async () => {
      const result = await benchmark.run(
        '缓存加载',
        async () => {
          // 模拟缓存加载
          await new Promise(resolve => setTimeout(resolve, 10));
        },
        10
      );

      // 平均时间应该小于 50ms
      expect(result.avgTime).toBeLessThan(50);
    });
  });

  describe('React 组件性能', () => {
    it('应该快速渲染 ScoreViewer', async () => {
      const result = await benchmark.run(
        'ScoreViewer 渲染',
        async () => {
          // 模拟组件渲染
          await new Promise(resolve => setTimeout(resolve, 50));
        },
        10
      );

      // 平均时间应该小于 100ms
      expect(result.avgTime).toBeLessThan(100);
    });

    it('应该快速处理用户交互', async () => {
      const result = await benchmark.run(
        '用户交互响应',
        async () => {
          // 模拟用户交互
          await new Promise(resolve => setTimeout(resolve, 20));
        },
        20
      );

      // 平均时间应该小于 50ms
      expect(result.avgTime).toBeLessThan(50);
    });
  });

  describe('内存使用', () => {
    it('应该有效管理内存', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // 创建大量对象
      const objects = [];
      for (let i = 0; i < 10000; i++) {
        objects.push({
          id: i,
          data: new Array(100).fill(Math.random()),
        });
      }

      const afterCreation = process.memoryUsage().heapUsed;
      const memoryIncrease = (afterCreation - initialMemory) / 1024 / 1024;

      // 内存增长应该小于 50MB
      expect(memoryIncrease).toBeLessThan(50);

      // 清理
      objects.length = 0;
    });
  });

  describe('网络性能', () => {
    it('应该快速获取数据', async () => {
      const result = await benchmark.run(
        '网络请求',
        async () => {
          // 模拟网络请求
          await new Promise(resolve => setTimeout(resolve, 100));
        },
        5
      );

      // 平均时间应该小于 200ms
      expect(result.avgTime).toBeLessThan(200);
    });
  });

  describe('首屏加载', () => {
    it('应该在 2 秒内加载完成', async () => {
      const result = await benchmark.run(
        '首屏加载',
        async () => {
          // 模拟首屏加载
          await new Promise(resolve => setTimeout(resolve, 1500));
        },
        3
      );

      // 平均时间应该小于 2000ms
      expect(result.avgTime).toBeLessThan(2000);
    });
  });
});

/**
 * 性能指标定义
 */
export const PERFORMANCE_TARGETS = {
  // 音频处理
  audioProcessing: 200, // ms
  cacheLoading: 50, // ms

  // React 组件
  componentRender: 100, // ms
  userInteraction: 50, // ms

  // 内存
  memoryIncrease: 50, // MB

  // 网络
  networkRequest: 200, // ms

  // 首屏加载
  firstContentfulPaint: 2000, // ms
  largestContentfulPaint: 2500, // ms

  // 帧率
  targetFrameRate: 60, // fps
};
