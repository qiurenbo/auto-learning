const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const logger = require("./logger");
let learningMinutes = 5;
const createWindow = () => {
  // Create the browser window.
  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload/preload.js")
    }
  });

  // and load the index.html of the app.
  window.loadURL("http://zy.jxkp.net/");
  window.maximize();

  if (process.env.NODE_ENV === "DEBUG") window.webContents.openDevTools();

  // Remove menu bar
  // https://stackoverflow.com/questions/39091964/remove-menubar-from-electron-app
  window.setMenu(null);

  const userAgent = window.webContents
    .getUserAgent()
    .replace(/auto-learning/, "")
    .replace(/Electron.+? /, "");
  window.webContents.setUserAgent(userAgent);

  window.once("ready-to-show", () => {
    windows.show();
  });

  window.webContents.on("will-redirect", (event, url) => {
    logger.log("debug", "will-redirect:" + url);
  });

  window.webContents.on("did-redirect-navigation", (event, url) => {
    logger.log("debug", "did-redirect-navigation:" + url);
  });

  ipcMain.on("log", (event, msg) => {
    logger.log("debug", msg);
  });

  ipcMain.on("kill-blur-focus", (event, msg) => {
    window.webContents.executeJavaScript('$(window).off("blur focus");');
  });

  ipcMain.on("save-learning-minutes", (event, minutes) => {
    logger.log("debug", "Save learning minutes " + minutes);
    learningMinutes = minutes;
  });

  ipcMain.on("get-learning-minutes-sync", (event, msg) => {
    event.returnValue = learningMinutes;
  });
};

// The default value of app.allowRendererProcessReuse is deprecated, it is currently "false".
// It will change to be "true" in Electron 9.  For more information please check https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = true;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
