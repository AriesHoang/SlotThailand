var SlotAladdin = SlotAladdin || {};

(function () {
    SlotAladdin.SlotClient = (function () {
        var instance = null;
        var CONNECTING = 0;
        var OPEN = 1;
        var CLOSING = 2;
        var CLOSED = 3;

        var host = "139.180.152.90";
        var port = 9999;
        var Clazz = cc.Class.extend({
            _sfsSocket: null,
            _allListener: {},
            _kicked: false,
            _timeoutThreshold: 3000,
            ctor: function () {
                if (instance)
                    throw "Can not create new instance of a singleton class";
                else {
                    this.connectionStatus = CONNECTING;
                    this._sfsSocket = new socket.SmartfoxClient();
                    var thiz = this;

                    this._allListener = {};
                    this._sfsSocket.onEvent = function (eventName) {
                        thiz.onEvent(eventName);
                    };
                    this._sfsSocket.onMessage = function (messageType, data) {
                        thiz.onMessage(messageType, data);
                    };

                    // setInterval(function () {
                    //     thiz.sendXPing();
                    // }, 500);

                    this.addListener(socket.SmartfoxClient.Handshake, this._onHandShakeListener, this);
                    this.addExtensionListener("rj", this._onJoinRoomListener, this);
                    this.addExtensionListener("zj", this._onJoinZoneListener, this);
                    this.addExtensionListener("2", this._onLineConfig, this);
                    this.addExtensionListener("0", this._onRejectListener, this);
                    this.addExtensionListener("xpong", this._onXPongListener, this);
                    this.addExtensionListener("41", this._onGetUserCoin, this);

                    this._currentScene = null;

                    if (cc.sys.isNative)
                        port = 9933;
                }
            },

            connect: function () {
                if (this._sfsSocket) {
                    if (cc.sys.isNative)
                        this._sfsSocket.connect(host, port);
                    else
                        this._sfsSocket.connect("ws://" + host + ":" + port + "/websocket");
                }
            },

            onEvent: function (eventName) {
                if (eventName === "Connected") {
                    //send handshake
                    this.sendHandShake();
                    this._kicked = false;
                    this._connectTimeout && clearTimeout(this._connectTimeout);
                    this._connectTimeout = null;
                } else if (eventName === "LostConnection") {
                    this.checkAndReconnect();
                } else if (eventName === "ConnectFailure") {
                    this.checkAndReconnect();
                }
                this.postEvent(socket.SmartfoxClient.SocketStatus, eventName);
            },

            sendXPing: function () {
                //this.sendExtensionRequest(-1,"xping",{});
            },

            checkAndReconnect: function () {
                var scene = cc.director.getRunningScene();
                var thiz = this;
                this._currentScene = scene;
                do {
                    if (this._kicked)
                        break;

                    if (this._connectTimeout)
                        return;

                    this.connect();
                    this._connectTimeout = setTimeout(function () {
                        thiz._connectTimeout && clearTimeout(thiz._connectTimeout);
                        thiz._connectTimeout = null;

                        if (scene) {
                            var l = new SlotAladdin.LoadingLayer("NOTIFICATION", "Unable to connect to the server.\nThe system will reconnect in a moment.");
                            l.setCallback(function () {
                                thiz.checkAndReconnect();
                            });
                            l.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
                            if (scene.loadingLayer) {
                                scene.loadingLayer.hide();
                                scene.loadingLayer = null;
                            }
                            scene.addChild(l, 999);
                            scene.loadingLayer = l;
                        }
                    }, 5000);
                } while (0);
            },

            onMessage: function (msgType, data) {
                var content = JSON.parse(data);

                //ext
                if (msgType === socket.SmartfoxClient.CallExtension) {
                    var cmd = "ext_" + content["c"];
                    this.postEvent(cmd, content);
                    return;
                }

                this.postEvent(msgType, content);
            },

            send: function (messageType, message) {
                if (this._sfsSocket) {
                    if (message) {
                        this._sfsSocket.send(messageType, JSON.stringify(message));
                    }
                    else {
                        this._sfsSocket.send(messageType, "");
                    }
                }
            },

            sendLogin: function (username, password) {
                var token = PlayerMe.token;
                var content = {
                    zn: "slot-chienthan-zone",
                    un: "",
                    pw: "",
                    p: {
                        "1": token
                    }
                };
                this.send(socket.SmartfoxClient.Login, content);
            },

            getToken: function () {
                if (cc.GlobalSlotAladdin.AccessToken)
                    return cc.GlobalSlotAladdin.AccessToken;

                var accessToken = cc.Global.GetSetting("accessToken");
                if (accessToken)
                    return accessToken;

                if (!cc.sys.isNative) {
                    if (!(window && window.location))
                        return null;

                    var search = window.location.search;
                    if (!search)
                        return null;

                    if (search.indexOf("?token"))
                        return null;

                    return search.substr(7);
                }
                return null;
            },

            sendHandShake: function () {
                var content = {
                    cl: "Mobile",
                    api: "1.6.3",
                    bin: true,
                    // rt : "reconnectionToken"
                };
                if (!cc.sys.isNative) {
                    content.cl = "web"
                }
                this.send(socket.SmartfoxClient.Handshake, content);
            },

            addListener: function (messageType, _listener, _target) {
                var arr = this._allListener[messageType];
                if (!arr) {
                    arr = [];
                    this._allListener[messageType] = arr;
                }
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].target === _target)
                        return;
                }

                arr.push({
                    listener: _listener,
                    target: _target
                });
            },

            addExtensionListener: function (command, _listener, _target) {
                var msgType = "ext_" + command;
                this.addListener(msgType, _listener, _target);
            },

            removeListener: function (_target) {
                for (var key in this._allListener) {
                    if (!this._allListener.hasOwnProperty(key)) continue;
                    var arr = this._allListener[key];
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] && arr[i].target === _target) {
                            arr.splice(i, 1);
                        }
                    }
                }
            },

            postEvent: function (messageType, params) {
                // cc.log("messageType : " + messageType);
                // cc.log(params);

                var arr = this._allListener[messageType];
                if (arr) {
                    for (var i = 0; i < arr.length; i++) {
                        var target = arr[i];
                        if (target) {
                            target.listener.call(target.target, messageType, params);
                        }
                        else {
                            arr.splice(i, 1);
                        }
                    }
                }
            },
            _onHandShakeListener: function (msgType, data) {
                if (data["tk"] && data["tk"].length > 0)
                    this.sendLogin("", "");
            },

            _onJoinRoomListener: function (msgType, data) {
                SlotAladdin.SFS.roomId = data["p"]["1"];
                var scene = cc.director.getRunningScene();
                if (scene === this._currentScene) {
                    scene.onReconnect && scene.onReconnect();
                    return;
                }

                scene = new SlotAladdin.SlotScene();
                cc.director.runScene(new cc.TransitionFade(0, scene));
            },

            _onJoinZoneListener: function (msgType, data) {
                SlotAladdin.SFS.sid = data["p"]["sid"];
            },

            _onRejectListener: function () {
                this._kicked = true;
            },

            _onLineConfig: function (msgType, data) {
                var result = data["p"]["1"];
                var lines = [];
                for (var i = 0; i < result.length; i++) {
                    var line = {};
                    var curr = result[i];
                    line.id = curr["0"];
                    line.ignored = curr["1"];
                    var pointResult = curr["2"];
                    var points = [];
                    for (var j = 0; j < pointResult.length; j++) {
                        var point = {};
                        point.yIndex = pointResult[j][0];
                        point.xIndex = pointResult[j][1];
                        points.push(point);
                    }
                    line.points = points;
                    lines.push(line);
                }
                SlotAladdin.Lines = lines;
            },

            _onGetUserCoin: function (cmd, data) {
                PlayerMe.gold = data["p"]["1"];
            },

            _onXPongListener: function () {
                if (this._pongTimeout)
                    clearTimeout(this._pongTimeout);

                var thiz = this;
                this._pongTimeout = setTimeout(function () {
                    if (!thiz._sfsSocket)
                        return;
                    thiz._sfsSocket.close();
                    thiz.checkAndReconnect();
                }, this._timeoutThreshold);
            },

            closeSocket: function () {
                console.log("--------------------");
                console.log("Begin Closed Socket");
                this._sfsSocket.close();
                if (this._pongTimeout) {
                    clearTimeout(this._pongTimeout);
                    this._pongTimeout = null;
                }
                if (this._connectTimeout) {
                    clearTimeout(this._connectTimeout);
                    this._connectTimeout = null;
                }
                this._sfsSocket = null;
                this._allListener = {};
                console.log("END Closed Socket");
                console.log(this);
                // cc.log(this);

                instance = null;

            },

            sendExtensionRequest: function (roomId, command, params) {
                if (params === null) {
                    params = {};
                }
                var content = {
                    r: roomId,
                    c: command,
                    p: params
                };
                this.send(socket.SmartfoxClient.CallExtension, content);
            },

            sendExtensionRequestCurrentRoom: function (command, params) {
                if (SlotAladdin.SFS.roomId < 0)
                    return;
                this.sendExtensionRequest(SlotAladdin.SFS.roomId, command, params);
            }
        });

        Clazz.getInstance = function () {
            if (!instance)
                instance = new Clazz();

            return instance;
        };

        return Clazz;
    })();
})();
