const { app, ipcMain } = require('electron');
const { exec } = require('child_process');
const { menubar } = require('menubar');
const path = require('node:path');

// Configure the menubar app
const mb = menubar({
  index: MAIN_WINDOW_WEBPACK_ENTRY, // Your app's entry point
  icon: "/Users/tusharvyas/Documents/GitHub/desktopReact/assets/iconDefault.png", // Path to your app icon
  preloadWindow: true, // Preload window for faster performance
  browserWindow: {
    width: 200,
    height: 200,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // Path to your preload script
      contextIsolation: true, // Isolate the context for security
      enableRemoteModule: false, // Disable the remote module
      nodeIntegration: false, // Disable node integration
    },
    autoHideMenuBar: true, // Hide the menu bar for a cleaner look
  },
});

// Log when the menubar app is ready
mb.on('ready', () => {
  console.log('Menubar app is ready');
});

// Handle AppleScript execution
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
      console.error(`Execution error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Script error: ${stderr}`);
      return;
    }
    console.log(`AppleScript output: ${stdout}`);
  });
});

// Handle application lifecycle events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mb.window === null) {
    mb.showWindow();
  }
});
