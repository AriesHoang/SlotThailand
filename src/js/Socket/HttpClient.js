/**
 * Created by Quyet Nguyen on 7/4/2017.
 */

var HttpClient = cc.Class.extend({
    ctor : function () {
        this.requestTimeout = 5000;
    },
    
    _createParamsString : function (params) {
        var str = "";
        var firstParam = true;
        for (var key in params) {
            if(firstParam){
                firstParam = false;
            }
            else{
                str += "&";
            }
            if(!params.hasOwnProperty(key)) continue;
            str += key + "=" + params[key].toString();
        }
        return str;
    },

    sendGetRequest : function (url, params) {
        if(params){
            var cmd = params["command"];
        }

        if(!cmd) {
            cc.log("http request params no command");
            cmd = url;
        }

        var fullUrl = url;
        if(params){
            if(!fullUrl.endsWith("?")){
                fullUrl += "?";
            }
            fullUrl += this._createParamsString(params);
            fullUrl = encodeURI(fullUrl);
        }

        this._sendHttpRequest("GET", cmd, fullUrl, null);
    },

    sendPostRequest : function (url, params) {
        if(params){
            var cmd = params["command"];
        }

        if(!cmd) {
            cc.log("http request params no command");
            cmd = url;
        }

        if(params){
            var paramsStr = this._createParamsString(params);
        }

        this._sendHttpRequest("POST", cmd, url, paramsStr);
    },

    _sendHttpRequest : function (protocol, cmd, url, param) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = this.requestTimeout;
        var thiz = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status <= 207) {
                    var obj = JSON.parse(xhr.responseText);
                    thiz.onEvent(cmd, obj);
                }
                else{
                    var reponse = {
                        status : xhr.status
                    };
                    thiz.onEvent(cmd, reponse);
                }
            }
        };

        xhr.open(protocol, url, true);
        xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        if(param){
            xhr.send(param);
        }
        else{
            xhr.send();
        }
    },

    onEvent : function (command, data) {
        cc.log("command: " + command);
        cc.log(data);
    }
});