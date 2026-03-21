@echo off
set PATH=C:\Progra~1\nodejs;%PATH%
cd /d "a:\factoryy"
call C:\Users\Administrator\AppData\Roaming\npm\pm2.cmd delete backend 2>nul
call C:\Users\Administrator\AppData\Roaming\npm\pm2.cmd start server.js --name "backend"
call C:\Users\Administrator\AppData\Roaming\npm\pm2.cmd save
