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
    },

    appendToArray(key,value){
       let origin = window.localStorage.getItem(key);
       if (!origin){
           this.set(key,JSON.stringify([value]));
       }else{
           origin = JSON.parse(origin);
           if (! origin instanceof Array){
              return false;
           }
           origin.push(value);
           this.set(key,JSON.stringify(origin));
       }
    }
}

exports.Cache = Cache;