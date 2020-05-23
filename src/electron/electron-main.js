const {app, BrowserWindow} = require("electron");
let MemTool = require("../tools/MemTool").MemTool;

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
    },

    get(key){
       //todo: change the hard code value to variable.
       this.memcache = new MemTool("127.0.0.1","11211") ;
       return this.memcache.get(key);
    }
}

ElectronMain.init();

exports.main = ElectronMain;

