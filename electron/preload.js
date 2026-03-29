const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 处理音频
  processAudio: (filePath) => ipcRenderer.invoke('process-audio', filePath),
  
  // 获取文件路径
  getFilePath: () => ipcRenderer.invoke('get-file-path'),
  
  // 监听处理进度
  onProcessingProgress: (callback) => {
    ipcRenderer.on('processing-progress', (event, data) => {
      callback(data);
    });
  },
  
  // 移除监听
  removeProcessingProgressListener: () => {
    ipcRenderer.removeAllListeners('processing-progress');
  },
});
