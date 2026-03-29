#!/bin/bash
# GuitarLens v0.5.0 构建脚本
# 在 8GB+ 内存的机器上运行

set -e

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                  GuitarLens v0.5.0 构建脚本                              ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js 16+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js 版本过低，需要 16+"
    exit 1
fi

echo "✅ Node.js $(node -v)"

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 请先安装 Python 3.8+"
    exit 1
fi
echo "✅ Python $(python3 --version)"

# 进入项目目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
echo "📁 项目目录: $(pwd)"

# 安装 Node.js 依赖
echo ""
echo "=== 安装 Node.js 依赖 ==="
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# 安装 Python 依赖
echo ""
echo "=== 安装 Python 依赖 ==="
pip3 install -r requirements.txt 2>/dev/null || pip install -r requirements.txt

# 构建 React
echo ""
echo "=== 构建 React 应用 ==="
npm run build

# 打包 Electron
echo ""
echo "=== 打包 Electron 应用 ==="
if [[ "$OSTYPE" == "darwin"* ]]; then
    npm run dist-mac
    echo ""
    echo "✅ 构建完成！"
    echo "📦 DMG 文件: dist/GuitarLens-0.5.0.dmg"
    echo "📦 ZIP 文件: dist/GuitarLens-0.5.0-mac.zip"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    npm run dist-win
    echo ""
    echo "✅ 构建完成！"
    echo "📦 EXE 文件: dist/GuitarLens-0.5.0-Setup.exe"
    echo "📦 ZIP 文件: dist/GuitarLens-0.5.0-win.zip"
else
    echo "⚠️ 未知平台: $OSTYPE"
    echo "请手动运行: npm run dist-all"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                  🎸 GuitarLens v0.5.0 构建成功！ 🎸                      ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
