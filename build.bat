@echo off
REM GuitarLens 打包脚本（Windows 版本）
REM 用于生成 Windows 安装文件

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                            ║
echo ║                  🎸 GuitarLens 打包脚本 🎸                                 ║
echo ║                                                                            ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

REM 检查依赖
echo 📋 检查依赖...

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm 未安装
    exit /b 1
)

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ python 未安装
    exit /b 1
)

echo ✅ 依赖检查完成
echo.

REM 安装 npm 依赖
echo 📦 安装 npm 依赖...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm 安装失败
    exit /b 1
)
echo.

REM 构建 React 应用
echo 🔨 构建 React 应用...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ React 构建失败
    exit /b 1
)
echo.

REM 生成 Windows 版本
echo 🪟 生成 Windows 版本...
call npm run electron-builder -- --win
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Windows 版本生成失败
    exit /b 1
)

echo.
echo ✅ Windows 版本生成完成
echo    文件位置: dist\GuitarLens-*.exe
echo.

echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                            ║
echo ║                  ✅ 打包完成！ ✅                                          ║
echo ║                                                                            ║
echo ║  安装文件位置: dist\                                                       ║
echo ║                                                                            ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

endlocal
