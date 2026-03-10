const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

let mainWindow;
let splash;

function createWindow() {
    // Get screen dimensions for a true full-screen splash
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    // 1. Create the Full-Screen Splash Window
    splash = new BrowserWindow({
        width: width,
        height: height,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        icon: path.join(__dirname, 'icon.ico')
    });

    // Support for both development and packaged paths
    const splashPath = app.isPackaged 
        ? path.join(process.resourcesPath, 'splash.html') 
        : path.join(__dirname, 'splash.html');

    splash.loadFile(splashPath);
    splash.center();

    // 2. Create the Main Application Window
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        show: false, // Keep hidden while splash is active
        autoHideMenuBar: true,
        title: "Electrolyser Data Records",
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Remove the default File/Edit/View menu
    mainWindow.setMenu(null); 
    mainWindow.loadFile('index.html');

    // 3. Transition: Close splash and show main window
    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            splash.close();
            mainWindow.maximize(); 
            mainWindow.show();
            mainWindow.focus(); // Force window to pop up in front
        }, 3500); // 3.5 seconds total time for animations
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});