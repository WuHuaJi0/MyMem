let Cache = {
    get(key){
        let memcache = window.localStorage.getItem("key");
        if (memcache){
            return JSON.parse(key)
        }
    },

    set(key,value){
        if (typeof value == 'object'){
            value = JSON.stringify(value);
        }
        window.localStorage.setItem(key,value);
    },

    del(key){
        window.localStorage.removeItem(key);
    }
}

exports.Cache = Cache;