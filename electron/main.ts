import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";

const protocol = "question-debugger";

const windows = new Set<BrowserWindow>();

function createWindow(hash?: string) {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false
    }
  });
  if (!window) {
    return;
  }
  windows.add(window);

  const baseURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "index.html")}`;

  const url = baseURL + (hash || "");
  window.loadURL(url);
  window.on("closed", () => windows.delete(window));
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

  createWindow(parsedURL.hash);
});

app.on("activate", () => {
  if (!windows.size) {
    createWindow();
  }
});
