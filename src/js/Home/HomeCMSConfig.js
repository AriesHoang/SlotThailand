var HomeCMSConfig = (function () {
    var instance = null;
    var Clazz = cc.Class.extend({
        ctor: function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            }else {
                this.result = {};
                this.requestTimeout = 5000;
                this.host = "http://cmsportal.loc.club:8899";
            }
        },

        getConfig: function (key, cb, failCb) {
            if(this.result[key]){
                cb(this.result[key]);
                return;
            }

            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = this.requestTimeout;
            var thiz = this;
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status <= 207) {
                        var obj = JSON.parse(xhr.responseText);
                        thiz.result[key] = obj;
                        cb && cb(obj);
                    }
                    else{
                        failCb && failCb(xhr.status);
                    }
                }
            };

            xhr.open("GET", this.host + key, true);
            xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
            xhr.send();
        }
    });

    Clazz.getInstance = function () {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };

    Clazz.BAD_WORD = "/api/v1/badwords";
    Clazz.MONEY_ICON_CONFIG_URL  = "/api/v1/MoneyIcon";
    Clazz.LATEST_CONFIG = "/api/v1/LatestConfig/ANDROID";
    Clazz.RESOURCE_URL  = "/api/v1/ResourcesApi";
    Clazz.LIST_PLACE_CONFIG_URL = "/api/v1/ListPlace";

    return Clazz;
})();