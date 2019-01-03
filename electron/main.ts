import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";

const protocol = "question-debugger";

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false
    }
  });
  if (!mainWindow) {
    return;
  }
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "index.html")}`
  );
  mainWindow.on("closed", () => {
    mainWindow = undefined;
  });
}

app.on("ready", () => {
  app.setAsDefaultProtocolClient(protocol);

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("open-url", (event, rawURL) => {
  event.preventDefault();

  const parsedURL = new URL(rawURL);
  if (parsedURL.protocol !== protocol + ":") {
    return;
  }
});

app.on("activate", () => {
  if (!mainWindow) {
    createWindow();
  }
});
