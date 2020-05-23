const {app, BrowserWindow} = require("electron");
let MemTool = require("./MemTool").MemTool;

let ElectronMain = {

    newWindow: null,
    memcache: null,

    init() {
        app.on('ready', () => {
            this.newWindow = new BrowserWindow({
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                    preload: __dirname + "/preload.js",
                },
            });
            this.newWindow.loadURL("http://localhost:8080");
            this.newWindow.on('ready-to-show', () => {
                this.newWindow.show();
            })
        })
    },

    connect(host, port) {
        this.memcache = new MemTool(host, port);
        return this.memcache.keys();
        // let data = await memcache.keys()
        // this.newWindow.webContents.send("keys", data);
        // return data;
    }
}

ElectronMain.init();

exports.main = ElectronMain;

