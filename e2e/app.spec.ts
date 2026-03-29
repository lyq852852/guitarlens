/**
 * E2E 测试 - 完整的用户流程
 * 使用 Playwright 进行端到端测试
 */

import { test, expect } from '@playwright/test';

test.describe('GuitarLens E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test.describe('应用启动', () => {
    test('应该正确加载应用', async ({ page }) => {
      const title = await page.title();
      expect(title).toContain('GuitarLens');
    });

    test('应该显示主界面', async ({ page }) => {
      const header = await page.locator('h1').first();
      expect(header).toBeVisible();
    });

    test('应该显示上传按钮', async ({ page }) => {
      const uploadButton = await page.locator('[data-testid="upload-button"]');
      expect(uploadButton).toBeVisible();
    });
  });

  test.describe('文件上传', () => {
    test('应该支持拖拽上传', async ({ page }) => {
      const uploadArea = await page.locator('[data-testid="upload-area"]');
      
      // 模拟拖拽事件
      await uploadArea.dispatchEvent('dragover');
      await uploadArea.dispatchEvent('drop', {
        dataTransfer: {
          files: [new File(['audio'], 'test.mp3', { type: 'audio/mpeg' })],
        },
      });

      // 验证文件已上传
      const fileName = await page.locator('[data-testid="file-name"]');
      expect(fileName).toContainText('test.mp3');
    });

    test('应该支持点击选择文件', async ({ page }) => {
      const uploadButton = await page.locator('[data-testid="upload-button"]');
      await uploadButton.click();

      const fileInput = await page.locator('input[type="file"]');
      expect(fileInput).toBeVisible();
    });

    test('应该显示文件信息', async ({ page }) => {
      // 上传文件
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      // 验证文件信息显示
      const fileInfo = await page.locator('[data-testid="file-info"]');
      expect(fileInfo).toBeVisible();
      expect(fileInfo).toContainText('test_audio.mp3');
    });
  });

  test.describe('音频处理', () => {
    test('应该处理音频文件', async ({ page }) => {
      // 上传文件
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      // 点击处理按钮
      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      // 等待进度条出现
      const progressBar = await page.locator('[data-testid="progress-bar"]');
      await expect(progressBar).toBeVisible();

      // 等待处理完成
      await page.waitForSelector('[data-testid="score-viewer"]', { timeout: 30000 });
      const scoreViewer = await page.locator('[data-testid="score-viewer"]');
      expect(scoreViewer).toBeVisible();
    });

    test('应该显示处理进度', async ({ page }) => {
      // 上传文件
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      // 点击处理按钮
      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      // 验证进度条
      const progressBar = await page.locator('[data-testid="progress-bar"]');
      const progressText = await progressBar.locator('[data-testid="progress-text"]');
      
      const initialProgress = await progressText.textContent();
      expect(initialProgress).toMatch(/\d+%/);
    });

    test('应该显示处理结果', async ({ page }) => {
      // 上传并处理文件
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      // 等待结果显示
      await page.waitForSelector('[data-testid="score-viewer"]', { timeout: 30000 });

      // 验证结果信息
      const bpmInfo = await page.locator('[data-testid="bpm-info"]');
      const keyInfo = await page.locator('[data-testid="key-info"]');
      const notesInfo = await page.locator('[data-testid="notes-info"]');

      expect(bpmInfo).toBeVisible();
      expect(keyInfo).toBeVisible();
      expect(notesInfo).toBeVisible();
    });
  });

  test.describe('谱面查看', () => {
    test('应该显示 Tab 视图', async ({ page }) => {
      // 处理音频
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      await page.waitForSelector('[data-testid="score-viewer"]', { timeout: 30000 });

      // 点击 Tab 视图按钮
      const tabButton = await page.locator('[data-testid="view-tab"]');
      await tabButton.click();

      // 验证 Tab 视图显示
      const tabView = await page.locator('[data-testid="tab-view"]');
      expect(tabView).toBeVisible();
    });

    test('应该显示 Staff 视图', async ({ page }) => {
      // 处理音频
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      await page.waitForSelector('[data-testid="score-viewer"]', { timeout: 30000 });

      // 点击 Staff 视图按钮
      const staffButton = await page.locator('[data-testid="view-staff"]');
      await staffButton.click();

      // 验证 Staff 视图显示
      const staffView = await page.locator('[data-testid="staff-view"]');
      expect(staffView).toBeVisible();
    });

    test('应该支持视图切换', async ({ page }) => {
      // 处理音频
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      await page.waitForSelector('[data-testid="score-viewer"]', { timeout: 30000 });

      // 切换视图
      const tabButton = await page.locator('[data-testid="view-tab"]');
      const staffButton = await page.locator('[data-testid="view-staff"]');
      const chordsButton = await page.locator('[data-testid="view-chords"]');

      await tabButton.click();
      let view = await page.locator('[data-testid="tab-view"]');
      expect(view).toBeVisible();

      await staffButton.click();
      view = await page.locator('[data-testid="staff-view"]');
      expect(view).toBeVisible();

      await chordsButton.click();
      view = await page.locator('[data-testid="chord-diagram"]');
      expect(view).toBeVisible();
    });
  });

  test.describe('编辑功能', () => {
    test('应该支持编辑模式', async ({ page }) => {
      // 处理音频
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      await page.waitForSelector('[data-testid="score-viewer"]', { timeout: 30000 });

      // 点击编辑按钮
      const editButton = await page.locator('[data-testid="edit-button"]');
      await editButton.click();

      // 验证编辑工具栏显示
      const editToolbar = await page.locator('[data-testid="edit-toolbar"]');
      expect(editToolbar).toBeVisible();
    });

    test('应该支持撤销/重做', async ({ page }) => {
      // 处理音频并进入编辑模式
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      await page.waitForSelector('[data-testid="score-viewer"]', { timeout: 30000 });

      const editButton = await page.locator('[data-testid="edit-button"]');
      await editButton.click();

      // 验证撤销/重做按钮
      const undoButton = await page.locator('[data-testid="undo-button"]');
      const redoButton = await page.locator('[data-testid="redo-button"]');

      expect(undoButton).toBeVisible();
      expect(redoButton).toBeVisible();
    });
  });

  test.describe('导出功能', () => {
    test('应该支持 PDF 导出', async ({ page }) => {
      // 处理音频
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      await page.waitForSelector('[data-testid="score-viewer"]', { timeout: 30000 });

      // 点击导出按钮
      const exportButton = await page.locator('[data-testid="export-button"]');
      await exportButton.click();

      // 选择 PDF 格式
      const pdfOption = await page.locator('[data-testid="export-pdf"]');
      await pdfOption.click();

      // 验证下载
      const downloadPromise = page.waitForEvent('download');
      const confirmButton = await page.locator('[data-testid="export-confirm"]');
      await confirmButton.click();

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.pdf');
    });

    test('应该支持 MusicXML 导出', async ({ page }) => {
      // 处理音频
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      await page.waitForSelector('[data-testid="score-viewer"]', { timeout: 30000 });

      // 点击导出按钮
      const exportButton = await page.locator('[data-testid="export-button"]');
      await exportButton.click();

      // 选择 MusicXML 格式
      const musicxmlOption = await page.locator('[data-testid="export-musicxml"]');
      await musicxmlOption.click();

      // 验证下载
      const downloadPromise = page.waitForEvent('download');
      const confirmButton = await page.locator('[data-testid="export-confirm"]');
      await confirmButton.click();

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.xml');
    });
  });

  test.describe('错误处理', () => {
    test('应该处理无效的文件', async ({ page }) => {
      // 尝试上传无效文件
      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('invalid.txt');

      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      // 验证错误提示
      const errorMessage = await page.locator('[data-testid="error-message"]');
      await expect(errorMessage).toBeVisible();
    });

    test('应该显示加载错误', async ({ page }) => {
      // 模拟网络错误
      await page.route('**/api/**', route => route.abort());

      const fileInput = await page.locator('input[type="file"]');
      await fileInput.setInputFiles('test_audio.mp3');

      const processButton = await page.locator('[data-testid="process-button"]');
      await processButton.click();

      // 验证错误提示
      const errorMessage = await page.locator('[data-testid="error-message"]');
      await expect(errorMessage).toBeVisible();
    });
  });

  test.describe('主题切换', () => {
    test('应该支持深色/浅色主题切换', async ({ page }) => {
      // 找到主题切换按钮
      const themeButton = await page.locator('[data-testid="theme-toggle"]');
      expect(themeButton).toBeVisible();

      // 获取初始主题
      const html = await page.locator('html');
      const initialClass = await html.getAttribute('class');

      // 切换主题
      await themeButton.click();

      // 验证主题已切换
      const newClass = await html.getAttribute('class');
      expect(newClass).not.toBe(initialClass);
    });
  });

  test.describe('响应式设计', () => {
    test('应该在移动设备上正确显示', async ({ page }) => {
      // 设置移动设备视口
      await page.setViewportSize({ width: 375, height: 667 });

      // 验证移动布局
      const mobileMenu = await page.locator('[data-testid="mobile-menu"]');
      expect(mobileMenu).toBeVisible();
    });

    test('应该在平板设备上正确显示', async ({ page }) => {
      // 设置平板设备视口
      await page.setViewportSize({ width: 768, height: 1024 });

      // 验证平板布局
      const tabletLayout = await page.locator('[data-testid="tablet-layout"]');
      expect(tabletLayout).toBeVisible();
    });

    test('应该在桌面设备上正确显示', async ({ page }) => {
      // 设置桌面设备视口
      await page.setViewportSize({ width: 1920, height: 1080 });

      // 验证桌面布局
      const desktopLayout = await page.locator('[data-testid="desktop-layout"]');
      expect(desktopLayout).toBeVisible();
    });
  });
});
