let Cache = {
    get(key){
        let result = window.localStorage.getItem(key);
        if (result){
            return JSON.parse(result)
        }
        return "";
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