const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { ipcMain } = require('electron');
const { exec } = require('child_process');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true, // Isolate context
      enableRemoteModule: false, // Disable remote module for security
      nodeIntegration: false, // Disable node integration (important for security)
    },
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools(); 

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on('run-apple-script', () => {
  const appleScript = `
    tell application "System Settings" to quit
    tell application "System Settings"
      activate
      delay 1
      tell application "System Events"
        tell process "System Settings"
          click menu item "Accessibility" of menu "View" of menu bar 1
          delay 0.5
          click button 3 of group 1 of scroll area 1 of group 1 of group 2 of splitter group 1 of group 1 of window "Accessibility" of application process "System Settings" of application "System Events"
          delay 0.5
          click checkbox "Colour filters" of group 5 of scroll area 1 of group 1 of group 2 of splitter group 1 of group 1 of window "Display" of application process "System Settings" of application "System Events"
        end tell
      end tell
    end tell
    tell application "System Settings" to quit
  `;

  exec(`osascript -e '${appleScript.replace(/'/g, "'\\''")}'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
