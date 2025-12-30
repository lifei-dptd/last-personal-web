@echo off
chcp 65001 >nul
title 个人网站服务器
echo ==========================================
echo          正在启动个人网站服务器
echo ==========================================
echo.
echo 服务器地址：http://localhost:3000
echo 首页地址：http://localhost:3000
echo 登录页面：http://localhost:3000/login.html
echo 留言板：http://localhost:3000/guestbook.html
echo 管理页面：http://localhost:3000/admin.html
echo.
echo 按 Ctrl+C 可以停止服务器
echo ==========================================
echo.
node server.js
pause
