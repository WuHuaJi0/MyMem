let Memcache = require("memcached");

class MemTool {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.client = new Memcache(`${host}:${port}`, {
            reconnect: 0,
            timeout: 300,
            retries: 1,
            failures: 2,
            retry: 1000,
        })
    }

    get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    set(key, value, expiration) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, expiration, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    keys() {
        return new Promise((resolve, reject) => {
            let that = this;
            this.client.items(function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    //todo should use foreach to get all slab id;
                    let slabid = parseInt(Object.keys(data[0])[0])
                    that.client.cachedump(`${that.host}:${that.port}`,slabid,0,function (err,data) {
                        resolve(data.map(item => item.key));
                    })
                }
            })
        })
    }
}

exports.MemTool = MemTool;

