const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const dotnetProjectPath = path.join(__dirname, 'TestElectron.csproj');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ 
  });

  const dotnet = spawn('dotnet', ['run', '--project', dotnetProjectPath, '--urls', 'http://localhost:5215']);
  // Замените "path/to/your/aspnet/project.csproj" на путь к вашему проекту ASP.NET
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

  mainWindow.loadURL('http://localhost:5215');
  mainWindow.maximize(); // Открывает окно на весь экран
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