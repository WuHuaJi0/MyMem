const {app, BrowserWindow} = require("electron");
let MemTool = require("../tools/MemTool").MemTool;

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
    },

    keys(){
        return MemcacheInstance.keys();
    },

    get(key){
        return MemcacheInstance.get(key);
    },

    set(key,value,expiration = 1000){
       return MemcacheInstance.set(key,value,expiration);
    }
}

ElectronMain.init();

exports.main = ElectronMain;
