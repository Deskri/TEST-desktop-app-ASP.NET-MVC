# TestElectron

Данный репрезиторий, это проба реализации завернуть ASP.NET MVC в настольное приложение. Реализация была осуществлена благодаря Node.js и Electron.

Порядок реализации:
1. Установите Node.js на ваш компьютер, если он еще не установлен. Вы можете скачать его с официального сайта Node.js (https://nodejs.org).
2. Создайте новый проект Electron. Вы можете использовать команду `npm init` в командной строке в папке вашего проекта, чтобы создать новый файл `package.json`. Затем установите Electron, выполнив команду `npm install electron --save`.
3. Создайте файл `main.js` в корневой папке вашего проекта Electron и добавьте следующий код:
    javascript
    const { app, BrowserWindow } = require('electron');

    let mainWindow;

    function createWindow() {
      mainWindow = new BrowserWindow({ width: 800, height: 600 });
      mainWindow.loadURL('http://localhost:port'); // Замените "port" на порт вашего ASP.NET MVC приложения
      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    }
    
    app.on('ready', createWindow);
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
    app.on('activate', () => {
      if (mainWindow === null) {
        createWindow();
      }
    });
4. В файле `package.json` вашего проекта Electron добавьте следующий скрипт `"start": "electron ."` в секцию `"scripts"`. Это позволит вам запускать ваше Electron приложение с помощью команды `npm start`.
5. В вашем ASP.NET MVC проекте добавьте ссылку на `main.js` в ваш файл представления (например, `Index.cshtml`). Например:
   html
    <script src="~/path/to/main.js"></script>
6. Запустите ваше ASP.NET MVC приложение на выбранном вами порту.
7. Откройте командную строку в папке вашего проекта Electron и выполните команду `npm start`. Ваше Electron приложение должно открыться и загрузить ваше ASP.NET MVC приложение.
8. После мы меняем main.js, чтобы вместе с Electron запускался dotnet
     const { app, BrowserWindow } = require('electron');
    const { spawn } = require('child_process');
     const path = require('path');
    const dotnetProjectPath = path.join(__dirname, 'TestElectron.csproj');
    
    let mainWindow;
    
    function createWindow() {
      mainWindow = new BrowserWindow({ width: 800, height: 600 });
    
      const dotnet = spawn('dotnet', ['run', '--project', 'dotnetProjectPath', '--urls', 'http://localhost:port']);
      // Замените "port" на порт вашего ASP.NET приложения
    
      dotnet.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
    
      dotnet.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
    
      dotnet.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });
    
      mainWindow.on('closed', () => {
        mainWindow = null;
        dotnet.kill();
      });
    
      mainWindow.loadURL('http://localhost:port');
    }
    
    app.on('ready', createWindow);
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
    app.on('activate', () => {
      if (mainWindow === null) {
        createWindow();
      }
    });

И в итоге мы можем это собрать:
1. Установите инструмент пакетирования, выполнив команду npm в командной строке:
   npm install electron-packager --save-dev
2. В файле package.json добавьте скрипт для упаковки вашего приложения:
   "scripts": {
    "pack": "electron-packager . --platform=win32 --arch=x64 --out=dist"
   }
   Здесь мы указываем, что приложение должно быть упаковано для платформы Windows (win32) и архитектуры x64. Результаты упаковки будут сохранены в папку "dist".
3. Выполните команду npm pack в командной строке:
   npm run pack
   Это запустит скрипт pack, который упакует ваше приложение в исполняемый файл с расширением .exe.
4. После завершения упаковки вы найдете ваш исполняемый файл в папке "dist". Вы можете распространять этот файл и запускать ваше приложение на любой машине с операционной системой Windows без установки Node.js или Electron.