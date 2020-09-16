/**
 * Created by Quyet Nguyen on 6/23/2016.
 *
 *
 *
 */

if (cc.sys.isNative) { //mobile
    var s_lobbyServer = s_lobbyServer || [
        {
            host: "42.112.25.164",
            //host: "vuabaivip.com",
            port: 9999
        }
    ];
}
else { //websocket
    var s_lobbyServer = s_lobbyServer || [
        //"wss://gbvcity.com/lagen2-lobby/websocket"
        //"ws://vuabaivip.com:8887/websocket"
        "ws://42.112.25.164:8887/websocket" // UAT
        //"ws://42.112.25.154:8887/websocket" //dev2 = khoi

    ];
}

var LobbyClient = (function () {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,
        ctor: function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                var thiz = this;

                this.allListener = {};
                this.serverIndex = 0;
                this.isKicked = false;
                this.loginHandler = null;
                this.isReconnected = false;
                this.isLogined = false;

                this.lobbySocket = new socket.LobbyClient(socket.LobbyClient.TCP);
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);
                };
                this.httpClient = new HttpClient();
                cc.director.getScheduler().scheduleUpdateForTarget(this, 0, false);

                FacebookPlugin.getInstance().onLoginFinished = function (returnCode, userId, accessToken) {
                    if(returnCode == 0){
                        // LoadingDialog.getInstance().show("Đang đăng nhập");
                        // thiz.loginFacebook(accessToken);
                    }
                    else{
                        // LoadingDialog.getInstance().hide();
                        // if(returnCode > 0){
                        //     MessageNode.getInstance().show("Lỗi đăng nhập facebook");
                        // }
                    }
                };

                if(cc.sys.isNative){
                    SystemPlugin.getInstance().onBuyItemFinishAndroid = function (returnCode, signature, json) {
                        thiz.onBuyItemFinishAndroid(returnCode, signature, json);
                    };

                    SystemPlugin.getInstance().onBuyItemFinishIOS = function (returnCode, data) {
                        thiz.onBuyItemFinishIOS(returnCode, data);
                    };
                }

            }
        },

        onBuyItemFinishAndroid : function (returnCode, signature, json) {
            LoadingDialog.getInstance().hide();
            if(returnCode === 0){
                var request = {
                    command : "cashin",
                    data: json,
                    signature: signature,
                    os : 2,
                    type : 3
                };
                this.send(request);
            }
        },

        onBuyItemFinishIOS : function (returnCode, data) {
            LoadingDialog.getInstance().hide();
            if(returnCode === 0){
                var request = {
                    command : "cashin",
                    data: data,
                    os : 1,
                    type : 3
                };
                this.send(request);
            }
        },

        update: function (dt) {
            if (this.isReconnected) {
                if (this.reconnectTimeout > 0.0) {
                    this.reconnectTimeout -= dt;
                }
                else {
                    //  this.onRequestTimeout();
                    this.isReconnected = false;
                }
            }
        },

        send: function (message) {
            if (this.lobbySocket) {
                cc.log(message);
                this.lobbySocket.send(JSON.stringify(message));
            }
        },

        close: function () {
            this.isReconnected = false;
            if (this.lobbySocket) {
                this.lobbySocket.close();
            }
        },

        connect: function () {
            if (this.lobbySocket) {
                this.isLogined = false;
                PlayerMe.avatar = "";

                if(this.serverIndex >= s_lobbyServer.length){
                    this.serverIndex = 0;
                }

                this.isKicked = false;
                if (cc.sys.isNative) {
                    this.lobbySocket.connect(s_lobbyServer[this.serverIndex].host, s_lobbyServer[this.serverIndex].port);
                }
                else {
                    this.lobbySocket.connect(s_lobbyServer[this.serverIndex]);
                }

                this.serverIndex++;
            }
        },

        onEvent: function (messageName, data) {
            if (messageName == "socketStatus") {
                this.postEvent("LobbyStatus", data);
            }
            else if (messageName == "message") {
                var messageData = JSON.parse(data);
                // if (messageData.command == "error") {
                //     LobbyClient.ErrorHandle(messageData.errorCode);
                // }

                this.postEvent(messageData.command, messageData);
            }
        },

        _onLobbyStatusHandler : function (cmd, event) {
            this.isLogined = false;
            if (event === "Connected") {
                // this.isReconnected = false;
                // if (this.loginHandler) {
                //     this.loginHandler();
                // }
            }
            else if (event === "ConnectFailure") {
                // if (this.isReconnected) {
                //     this.connect();
                // }
                // else {
                //     LoadingDialog.getInstance().hide();
                //     SceneNavigator.toHome("Mất kết nối máy chủ");
                // }
            }
            else if (event === "LostConnection") {
                // if (!this.isKicked) {
                //     this.reconnect();
                // }
            }
        },

        prePostEvent: function (command, event) {

        },

        onLoginEvent: function (event) {

        },

        postEvent: function (command, event) {
           // this.prePostEvent(command, event);
            var arr = this.allListener[command];
            if (arr) {
                this.isBlocked = true;
                for (var i = 0; i < arr.length;) {
                    var target = arr[i];
                    if (target) {
                        target.listener.apply(target.target, [command, event]);
                    }
                    else {
                        arr.splice(i, 1);
                        continue;
                    }
                    i++;
                }
                this.isBlocked = false;
            }
        },

        addListener: function (command, _listener, _target) {
            var arr = this.allListener[command];
            if (!arr) {
                arr = [];
                this.allListener[command] = arr;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].target === _target) {
                    return;
                }
            }
            arr.push({
                listener: _listener,
                target: _target
            });
        },

        removeListener: function (target) {
            for (var key in this.allListener) {
                if (!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for (var i = 0; i < arr.length;) {
                    if (arr[i] && arr[i].target == target) {
                        if (this.isBlocked) {
                            arr[i] = null;
                        }
                        else {
                            arr.splice(i, 1);
                            continue;
                        }
                    }
                    i++;
                }
            }
        },
        /*****/
        checkIMEI: function () {
            if (!PlayerMe.IMEI) {
                PlayerMe.IMEI = SystemPlugin.getInstance().getDeviceUUIDWithKey(PlayerMe.DeviceIDKey);
                if (!PlayerMe.IMEI) {
                    MessageNode.getInstance().show("Bạn phải đăng nhập tài khoản Google");
                    LoadingDialog.getInstance().hide();
                    return false;
                }
            }
            return true;
        }
    });

    Clazz.getInstance = function () {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };

    return Clazz;
})();