@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"
cd client
call npm install @tailwindcss/vite
call npm install @tailwindcss/postcss
pause
