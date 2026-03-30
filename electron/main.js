const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let pythonProcess;

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../app/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 启动 Python 引擎
function startPythonEngine() {
  const pythonScript = path.join(__dirname, '../python/engine.py');
  
  // 检查 Python 是否可用
  pythonProcess = spawn('python3', [pythonScript, '--server'], {
    cwd: path.join(__dirname, '../python'),
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`[Python] ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[Python Error] ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });
}

// App 事件
app.on('ready', () => {
  createWindow();
  startPythonEngine();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (pythonProcess) {
    pythonProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 创建菜单
function createMenu() {
  const template = [
    {
      label: 'GuitarLens',
      submenu: [
        {
          label: 'About GuitarLens',
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Shift+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          role: 'toggleDevTools',
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC 处理器
ipcMain.handle('process-audio', async (event, filePath) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../python/engine.py');
    const outputDir = path.join(app.getPath('userData'), 'output');

    // 创建输出目录
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const process = spawn('python3', [
      pythonScript,
      filePath,
      '--output',
      outputDir,
      '--mode',
      'full',
    ]);

    let output = '';
    let error = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
      // 发送进度更新
      event.sender.send('processing-progress', data.toString());
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        // 读取结果文件
        const resultFile = path.join(outputDir, 'analysis_result.json');
        try {
          const result = JSON.parse(fs.readFileSync(resultFile, 'utf-8'));
          resolve({
            success: true,
            result,
            outputDir,
          });
        } catch (err) {
          reject(new Error('Failed to parse result: ' + err.message));
        }
      } else {
        reject(new Error(`Python process failed: ${error}`));
      }
    });
  });
});

ipcMain.handle('get-file-path', async (event) => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'flac', 'ogg', 'm4a'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  return result.filePaths[0];
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
