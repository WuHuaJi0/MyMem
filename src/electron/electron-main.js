const {app, BrowserWindow} = require("electron");
let MemTool = require("../tools/MemTool").MemTool;
const {Cache} = require("../tools/Cache");

// The global Memcache Instance.
let MemcacheInstance = null;

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
        MemcacheInstance = new MemTool(host, port);
        //todo: store the host, port
        return MemcacheInstance.keys();
    },

    get(key){
        return MemcacheInstance.get(key);
    }
}

ElectronMain.init();

exports.main = ElectronMain;

