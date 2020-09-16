/**
 * Created by Quyet Nguyen on 6/23/2016.
 */

var SmartfoxClient = (function () {
    var instance = null;
    var Clazz = cc.Class.extend({
        sfsSocket: null,

        ctor: function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.allListener = {};
                this.sfsSocket = new socket.SmartfoxClient();
                var thiz = this;
                this.sfsSocket.onEvent = function (eventName) {
                    thiz.onEvent(eventName);
                };
                this.sfsSocket.onMessage = function (messageType, data) {
                    thiz.onMessage(messageType, data);
                };

                this.addListener(socket.SmartfoxClient.Handshake, this._onHankShakeHandler, this);
                this.addListener(socket.SmartfoxClient.Login, this._onLoginHandler, this);
                this.addListener(socket.SmartfoxClient.JoinRoom, this._onJoinRoomHandler, this);
                this.addListener(socket.SmartfoxClient.UserExitRoom, this._onUserExitRoomHandler, this);
                this.addExtensionListener("rj", this._onJoinRoomExtension, this);
            }
        },

        serverInfor: function () {
            return {
                host: "207.148.78.194",
                port: 9933,
                webSocketUrl: "ws://207.148.78.194:9999/"
            };
        },

        isConnected: function () {
            if (this.sfsSocket) {
                return (this.sfsSocket.getStatus() === socket.SmartfoxClient.Connected);
            }
            return false;
        },
        sendHandShake: function () {
            var content = {
                cl: "Mobile",
                api: "1.6.3",
                bin: true,
            };
            if (!cc.sys.isNative) {
                content.cl = "web"
            }
            this.send(socket.SmartfoxClient.Handshake, content);
        },

        sendXPing: function () {
            this.sendExtensionRequest(-1, "xping", {});
        },

        // ------------- SEND LOGIN ------------

        sendLogin: function (username, password) {
            if (username.length < 1 || password.length < 1)
                return;
            HomeWaittingLayer.getInstance().show();

            cc.Global.LoginMethod = cc.Global.LoginAcc;
            cc.Global.setLoginMethod(cc.Global.LoginMethod);
            cc.Global.setSaveUsername(username);
            cc.Global.setSavePassword(password);
            var ClientName = "";
            var ClientVersion = "";
            var DeviceName = "";
            var DeviceOS = "";
            var DeviceOSVersion = "";
            var Platform = "";

            if (cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
                ClientName = "DESKTOP_BROWSER";
                ClientVersion = cc.sys.browserVersion;
                DeviceName = cc.sys.browserType;
                DeviceOS = cc.sys.os;
                DeviceOSVersion = cc.sys.browserVersion;
                Platform = cc.sys.os;
            } else if (cc.sys.platform === cc.sys.MOBILE_BROWSER) {
                ClientName = "MOBILE_BROWSER";
                ClientVersion = cc.sys.browserVersion;
                DeviceName = cc.sys.browserType;
                DeviceOS = cc.sys.os;
                DeviceOSVersion = cc.sys.browserVersion;
                Platform = cc.sys.os;
            } else {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    ClientName = "APP_ANDROID";
                    ClientVersion = SystemPlugin.getInstance().getVersionName();
                    DeviceName = SystemPlugin.getInstance().getDeviceName();
                    DeviceOS = "ANDROID";
                    DeviceOSVersion = SystemPlugin.getInstance().getOSVersion();
                    Platform = cc.sys.os;
                }
                else if (cc.sys.os === cc.sys.OS_IOS) {
                    ClientName = "APP_IOS";
                    ClientVersion = SystemPlugin.getInstance().getVersionName();
                    DeviceName = SystemPlugin.getInstance().getDeviceName();
                    DeviceOS = "IOS";
                    DeviceOSVersion = SystemPlugin.getInstance().getOSVersion();
                    Platform = cc.sys.os;
                }
            }

            var content = {
                zn: "kingclub-zone",
                // zn: "slot-chienthan-zone",
                un: "",
                pw: "",
                p: {
                    "0": cc.Global.LoginAcc,
                    "1": username,
                    "2": password,
                    "3": ClientName,
                    "4": ClientVersion,
                    "5": DeviceName,
                    "6": DeviceOS,
                    "7": DeviceOSVersion,
                    "8": Platform
                }
            };

            // cc.log("---------------- LOGIN ---------------");
            // cc.log(ClientVersion + " " + DeviceName + " " + DeviceOSVersion);
            // cc.log(JSON.stringify(content));

            this.send(socket.SmartfoxClient.Login, content);
        },

        sendRegister: function () {
            cc.Global.setSaveUsername(this.username);
            cc.Global.setSavePassword(this.password);
            var content = {
                zn: "kingclub-zone",
                un: "",
                pw: "",
                p: {
                    "0": cc.Global.LoginReg,
                    "1": this.username,
                    "2": this.password,
                    "3": "0123456789",
                    "4": this.captcha,
                    "5": this.tokenCaptcha
                }
            };

            this.send(socket.SmartfoxClient.Login, content);
        },

        sendLoginFacebook: function (token, username) {
            HomeWaittingLayer.getInstance().show();

            cc.Global.LoginMethod = cc.Global.LoginFb;
            cc.Global.setLoginMethod(cc.Global.LoginMethod);
            cc.Global.setTokenFB(token);

            var ClientName = "";
            var ClientVersion = "";
            var DeviceName = "";
            var DeviceOS = "";
            var DeviceOSVersion = "";
            var Platform = "";

            if (cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
                ClientName = "DESKTOP_BROWSER";
                ClientVersion = cc.sys.browserVersion;
                DeviceName = cc.sys.browserType;
                DeviceOS = cc.sys.os;
                DeviceOSVersion = cc.sys.browserVersion;
                Platform = cc.sys.os;
            } else if (cc.sys.platform === cc.sys.MOBILE_BROWSER) {
                ClientName = "MOBILE_BROWSER";
                ClientVersion = cc.sys.browserVersion;
                DeviceName = cc.sys.browserType;
                DeviceOS = cc.sys.os;
                DeviceOSVersion = cc.sys.browserVersion;
                Platform = cc.sys.os;
            } else {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    ClientName = "APP_ANDROID";
                    ClientVersion = SystemPlugin.getInstance().getVersionName();
                    DeviceName = SystemPlugin.getInstance().getDeviceName();
                    DeviceOS = "ANDROID";
                    DeviceOSVersion = SystemPlugin.getInstance().getOSVersion();
                    Platform = cc.sys.os;
                }
                else if (cc.sys.os === cc.sys.OS_IOS) {
                    ClientName = "APP_IOS";
                    ClientVersion = SystemPlugin.getInstance().getVersionName();
                    DeviceName = SystemPlugin.getInstance().getDeviceName();
                    DeviceOS = "IOS";
                    DeviceOSVersion = SystemPlugin.getInstance().getOSVersion();
                    Platform = cc.sys.os;
                }
            }

            // cc.log("sendLoginFacebook!!!" + token + " - " + username);
            var content = {
                zn: "kingclub-zone",
                un: "",
                pw: "",
                p: {
                    "0": cc.Global.LoginFb,
                    "1": token,
                    "2": username,
                    "3": ClientName,
                    "4": ClientVersion,
                    "5": DeviceName,
                    "6": DeviceOS,
                    "7": DeviceOSVersion,
                    "8": Platform
                }
            };

            this.send(socket.SmartfoxClient.Login, content);
        },

        sendLoginGoogle: function (token, username) {
            HomeWaittingLayer.getInstance().show();

            cc.Global.LoginMethod = cc.Global.LoginGG;
            cc.Global.setLoginMethod(cc.Global.LoginMethod);
            cc.Global.setTokenGG(token);
            // cc.log("sendLoginGoogle!!!" + token + " - " + username);
            var ClientName = "";
            var ClientVersion = "";
            var DeviceName = "";
            var DeviceOS = "";
            var DeviceOSVersion = "";
            var Platform = "";

            if (cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
                ClientName = "DESKTOP_BROWSER";
                ClientVersion = cc.sys.browserVersion;
                DeviceName = cc.sys.browserType;
                DeviceOS = cc.sys.os;
                DeviceOSVersion = cc.sys.browserVersion;
                Platform = cc.sys.os;
            } else if (cc.sys.platform === cc.sys.MOBILE_BROWSER) {
                ClientName = "MOBILE_BROWSER";
                ClientVersion = cc.sys.browserVersion;
                DeviceName = cc.sys.browserType;
                DeviceOS = cc.sys.os;
                DeviceOSVersion = cc.sys.browserVersion;
                Platform = cc.sys.os;
            } else {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    ClientName = "APP_ANDROID";
                    ClientVersion = SystemPlugin.getInstance().getVersionName();
                    DeviceName = SystemPlugin.getInstance().getDeviceName();
                    DeviceOS = "ANDROID";
                    DeviceOSVersion = SystemPlugin.getInstance().getOSVersion();
                    Platform = cc.sys.os;
                }
                else if (cc.sys.os === cc.sys.OS_IOS) {
                    ClientName = "APP_IOS";
                    ClientVersion = SystemPlugin.getInstance().getVersionName();
                    DeviceName = SystemPlugin.getInstance().getDeviceName();
                    DeviceOS = "IOS";
                    DeviceOSVersion = SystemPlugin.getInstance().getOSVersion();
                    Platform = cc.sys.os;
                }
            }

            var content = {
                zn: "kingclub-zone",
                un: "",
                pw: "",
                p: {
                    "0": cc.Global.LoginGG,
                    "1": token,
                    "2": username,
                    "3": ClientName,
                    "4": ClientVersion,
                    "5": DeviceName,
                    "6": DeviceOS,
                    "7": DeviceOSVersion,
                    "8": Platform
                }
            };

            this.send(socket.SmartfoxClient.Login, content);
        },

        sendLoginMobile: function (mobilePhone, code) {
            HomeWaittingLayer.getInstance().show();

            cc.Global.LoginMethod = cc.Global.LoginMobile;
            cc.Global.setLoginMethod(cc.Global.LoginMethod);
            cc.Global.setSaveUsername(mobilePhone);
            cc.Global.setMobilePhone(mobilePhone);
            cc.Global.setOTPPhone(code);
            if (cc.Global.getMobilePhone().length < 9)
                return;

            var ClientName = "";
            var ClientVersion = "";
            var DeviceName = "";
            var DeviceOS = "";
            var DeviceOSVersion = "";
            var Platform = "";

            if (cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
                ClientName = "DESKTOP_BROWSER";
                ClientVersion = cc.sys.browserVersion;
                DeviceName = cc.sys.browserType;
                DeviceOS = cc.sys.os;
                DeviceOSVersion = cc.sys.browserVersion;
                Platform = cc.sys.os;
            } else if (cc.sys.platform === cc.sys.MOBILE_BROWSER) {
                ClientName = "MOBILE_BROWSER";
                ClientVersion = cc.sys.browserVersion;
                DeviceName = cc.sys.browserType;
                DeviceOS = cc.sys.os;
                DeviceOSVersion = cc.sys.browserVersion;
                Platform = cc.sys.os;
            } else {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    ClientName = "APP_ANDROID";
                    ClientVersion = SystemPlugin.getInstance().getVersionName();
                    DeviceName = SystemPlugin.getInstance().getDeviceName();
                    DeviceOS = "ANDROID";
                    DeviceOSVersion = SystemPlugin.getInstance().getOSVersion();
                    Platform = cc.sys.os;
                }
                else if (cc.sys.os === cc.sys.OS_IOS) {
                    ClientName = "APP_IOS";
                    ClientVersion = SystemPlugin.getInstance().getVersionName();
                    DeviceName = SystemPlugin.getInstance().getDeviceName();
                    DeviceOS = "IOS";
                    DeviceOSVersion = SystemPlugin.getInstance().getOSVersion();
                    Platform = cc.sys.os;
                }
            }

            var content = {
                zn: "kingclub-zone",
                un: "",
                pw: "",
                p: {
                    "0": cc.Global.LoginMobile,
                    "1": mobilePhone,
                    "2": code,
                    "3": ClientName,
                    "4": ClientVersion,
                    "5": DeviceName,
                    "6": DeviceOS,
                    "7": DeviceOSVersion,
                    "8": Platform
                }
            };
            this.send(socket.SmartfoxClient.Login, content);
        },

        getTokenFacebook: function (token) {
            // cc.log("getTokenFacebook: " + token);
            var thiz = this;
            if (!token || token === "") {
                var scene = cc.director.getRunningScene();
                scene._onLoginError("", {"ec": cc.Global.EXTERNALLOGIN_TOKEN_INVALID});
            }
            else {
                this.initConnectSmartfox(function () {
                    thiz.sendLoginFacebook(token, "");
                });
            }
        },

        getTokenGoogle: function (token) {
            var thiz = this;
            if (!token || token === "") {
                var scene = cc.director.getRunningScene();
                scene._onLoginError("", {"ec": cc.Global.EXTERNALLOGIN_TOKEN_INVALID});
            }
            else {
                this.initConnectSmartfox(function () {
                    thiz.sendLoginGoogle(token, "");
                });
            }
        },

        generateGuestToken: function () {
            var str = "Guest";
            var randomChar = "1234567890qwertyuiopasdfghjklzxcvbnm";
            var randomCount = Math.floor(Math.random() * 20);
            for (var i = 0; i < randomCount; i++) {
                str += (randomChar[Math.floor(Math.random() * randomChar.length)]);
            }
            return str;
        },

        initConnectSmartfox: function (callback) {
            this.connect(this.serverInfor(), typeof (callback) === "function" ? callback() : undefined);
        },

        loginWithLastSetting: function () {
            var LoginMethod = cc.Global.getLoginMethod();
            switch (LoginMethod) {
                case cc.Global.LoginAcc:
                case cc.Global.LoginReg:
                    if ((cc.Global.getSaveUsername() && cc.Global.getSaveUsername().length > 1) &&
                        cc.Global.getSavePassword() && cc.Global.getSavePassword().length > 1) {
                        PlayerMe.username = cc.Global.getSaveUsername();
                        PlayerMe.password = cc.Global.getSavePassword();
                        console.log(cc.Global.getSaveUsername());
                        SmartfoxClient.getInstance().initConnectSmartfox(function () {
                            // SmartfoxClient.getInstance().sendLogin(PlayerMe.username, PlayerMe.password);
                        });
                        // if (cc.sys.os === cc.sys.OS_ANDROID)
                        //     jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "LoginNormal", "()V");
                        // else if (cc.sys.os === cc.sys.OS_IOS)
                        //     jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Login Bình thường", "Login Bình thường");
                    }
                    break;
                case cc.Global.LoginFb:
                    if (cc.Global.getTokenFB() && cc.Global.getTokenFB().length > 1) {
                        // SmartfoxClient.getInstance().initConnectSmartfox(function () {
                        //     SmartfoxClient.getInstance().sendLoginFacebook(cc.Global.getTokenFB(), cc.Global.getSaveUsername());
                        // });
                        if (cc.sys.os === cc.sys.OS_ANDROID) {
                            jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "loginByFacebook", "(Ljava/lang/String;)V", "haha");
                            // jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "LoginByFacebook", "()V");
                        } else if (cc.sys.os === cc.sys.OS_IOS) {
                            jsb.reflection.callStaticMethod("AppController", "loginFBClicked", null);
                        }
                        else if (!cc.sys.isMobile) {
                            FB.getLoginStatus(function (response) {
                                if (response.status === 'connected') {
                                    var accessToken = response.authResponse.accessToken;
                                    SmartfoxClient.getInstance().initConnectSmartfox(function () {
                                        SmartfoxClient.getInstance().sendLoginFacebook(accessToken, cc.Global.getSaveUsername() ? cc.Global.getSaveUsername().length > 1 ? cc.Global.getSaveUsername() : "" : "");
                                    });
                                }
                                else {
                                    FB.login(function (response) {
                                        if (response.authResponse.accessToken) {
                                            var accessToken = response.authResponse.accessToken;
                                            SmartfoxClient.getInstance().initConnectSmartfox(function () {
                                                SmartfoxClient.getInstance().sendLoginFacebook(accessToken, cc.Global.getSaveUsername() ? cc.Global.getSaveUsername().length > 1 ? cc.Global.getSaveUsername() : "" : "");
                                            });
                                        }
                                    }, {
                                        scope: 'public_profile,email'
                                    });
                                }
                            });
                        }
                    }
                    break;
                case cc.Global.LoginGG:
                    if (cc.Global.getTokenGG() && cc.Global.getTokenGG().length > 1) {
                        // SmartfoxClient.getInstance().initConnectSmartfox(function () {
                        //     SmartfoxClient.getInstance().sendLoginGoogle(cc.Global.getTokenGG(), cc.Global.getSaveUsername());
                        // });
                        if (cc.sys.os === cc.sys.OS_ANDROID) {
                            jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "loginByGoogle", "(Ljava/lang/String;)V", "haha");
                            // jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "LoginByGoogle", "()V");
                        } else if (cc.sys.os === cc.sys.OS_IOS) {
                            jsb.reflection.callStaticMethod("AppController", "loginGGClick", null);

                        }
                        else if (!cc.sys.isMobile) {
                            var GoogleAuth = gapi.auth2.getAuthInstance();
                            if (GoogleAuth) {
                                if (GoogleAuth.isSignedIn.get()) {
                                    var accessToken = GoogleAuth.currentUser.get().Zi.id_token;
                                    SmartfoxClient.getInstance().initConnectSmartfox(function () {
                                        SmartfoxClient.getInstance().sendLoginGoogle(accessToken, cc.Global.getSaveUsername() ? cc.Global.getSaveUsername().length > 1 ? cc.Global.getSaveUsername() : "" : "");
                                    });
                                }
                                else {
                                    SmartfoxClient.getInstance().initConnectSmartfox(function () {
                                        GoogleAuth.signIn({prompt: 'select_account'});
                                    });
                                }
                            }
                        }
                    }
                    break;
                case cc.Global.LoginMobile:
                    if (cc.Global.getMobilePhone() && cc.Global.getMobilePhone().length > 1) {
                        SmartfoxClient.getInstance().initConnectSmartfox(function () {
                            SmartfoxClient.getInstance().sendLoginMobile(cc.Global.getMobilePhone(), "");
                        });
                        // if (cc.sys.os === cc.sys.OS_ANDROID)
                        //     jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "LoginByPhone", "()V");
                    }
                    break;
            }
        },

        // ------------- END LOGIN ------------

        sendLogout: function () {
            this.send(socket.SmartfoxClient.Logout, null);
        },
        //====================================================================
        //===========================  IAP  ==================================
        //====================================================================
        //===ANDROID
        getReceiptAndroid: function (productID, strData, strSign) {
            cc.log("productID: " + productID);
            strData = strData.replaceAll("'", "\"");
            strData = strData.replaceAll("@", "\\");
            cc.log("strPurchaseTk: " + strData);

            cc.log("strSign: " + strSign);
            if (strData.length > 50) {
                this.sendIAPRequest("google", productID, strData, strSign);
            }
        },
        //===IOS
        callbackIAPFail: function () {
            cc.log("In App Fail.....");
        },
        getReceiptIOS: function (productID, strReceipt) {
            // cc.log("productID: " + productID);
            // cc.log("getReceiptIOS: " + strReceipt);
            if (strReceipt.length > 50) {
                this.sendIAPRequest("apple", productID, strReceipt, "");
            }
        },
        sendIAPRequest: function (platform, productID, strData, strSign) {
            /*@RequestParam("1")
             private String store; //type = 1: android; type = 2: ios

             @RequestParam("2")
             private String clientId;

             @RequestParam("3")
             private String productId;

             @RequestParam("4")
             private String IAPData;

             @RequestParam("5")
             private String IAPSignature;
             cái param 4, nếu là iOS thì gửi receipt data nhé*/

            var params = {
                "1": platform,
                "2": "" + PlayerMe.SFS.userId,
                "3": productID,
                "4": strData,
                "5": strSign
            };
            this.sendExtensionRequestCurrentRoom("2101", params);
            // this.send(socket.SmartfoxClient.SendInApp, content);
        },
        sendJoinRoom: function (room) {
            var content = {};
            if (room.isString()) {
                if (room !== "") {
                    content.n = room; //roomName
                }
            }
            else if (room.isNumber()) {
                if (room > -1) {
                    content.i = room; //roomId
                }
            }

            content.p = ""; //roomPass
            content.rl = 0; //roomIdToLeave
            content.sp = false; //asSpectator
            this.send(socket.SmartfoxClient.JoinRoom, content);
        },

        sendLeaveRoom: function (roomId) {
            var content = {
                r: roomId
            };
            this.send(socket.SmartfoxClient.LeaveRoom, content);
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
            // cc.log("sendExtensionRequestCurrentRoom: " + PlayerMe.SFS.roomId + " - " + command + " - " + JSON.stringify(params));
            this.sendExtensionRequest(PlayerMe.SFS.roomId, command, params);
        },

        send: function (messageType, message) {
            // cc.log("messageType:" + messageType + " - message: " + JSON.stringify(message));
            if (this.sfsSocket) {
                if (message) {
                    this.sfsSocket.send(messageType, JSON.stringify(message));
                }
                else {
                    this.sfsSocket.send(messageType, "");
                }
            }
        },

        close: function () {
            if (this.sfsSocket) {
                this.sfsSocket.close();
            }

            if (this.xPingInterval) {
                clearInterval(this.xPingInterval);
                this.xPingInterval = null;
            }
        },

        connect: function (serverInfo, afterLoginCallback) {
            this.lastRoomInfo = null;
            this._loginHandler = afterLoginCallback;

            if (this.sfsSocket) {
                if (this.sfsSocket.getStatus() === socket.SmartfoxClient.Connected) {
                    cc.log("serverInfo.webSocketUrl 1: " + serverInfo.webSocketUrl);
                    if (this.currentServer === serverInfo) {
                        if (this._loginHandler) {
                            this._loginHandler();
                            this._loginHandler = null;
                        }
                        return;
                    }
                    else {
                        this.close();

                        if (cc.sys.isNative) {
                            this.sfsSocket.connect(serverInfo.host, serverInfo.port);
                        }
                        else {
                            this.sfsSocket.connect(serverInfo.webSocketUrl);
                        }
                    }
                } else {
                    this.close();
                    cc.log("serverInfo.webSocketUrl 2: " + serverInfo.webSocketUrl);
                    this.username = serverInfo.username || "";
                    this.password = serverInfo.password || "";
                    this.tokenCaptcha = serverInfo.tokenCaptcha || "";
                    this.captcha = serverInfo.captcha || "";

                    if (cc.sys.isNative) {
                        this.sfsSocket.connect(serverInfo.host, serverInfo.port);
                    }
                    else {
                        this.sfsSocket.connect(serverInfo.webSocketUrl);
                    }
                }

                this.currentServer = serverInfo;
            }
        },

        onEvent: function (eventName) {
            if (eventName === "Connected") {
                //send handshake
                this.sendHandShake();
                this._connectTimeout && clearTimeout(this._connectTimeout);
                this._connectTimeout = null;
            }
            else if (eventName === "ConnectFailure") {
                this.checkAndReconnect();
            }
            else if (eventName === "LostConnection") {
                this.checkAndReconnect();
            }
            this.postEvent(socket.SmartfoxClient.SocketStatus, eventName);
        },

        checkAndReconnect: function () {
            var scene = cc.director.getRunningScene();
            if (scene.ctor !== HomeScene.prototype.ctor) {
                this.connect(this.serverInfor());
                return;
            }
            var thiz = this;
            this._currentScene = scene;
            do {
                if (this._kicked)
                    break;

                if (this._connectTimeout)
                    return;

                this.connect(this.serverInfor(), function () {
                    if (thiz._connectTimeout) {
                        clearTimeout(thiz._connectTimeout);
                        thiz._connectTimeout = null;
                    }
                });
                this._connectTimeout = setTimeout(function () {
                    thiz._connectTimeout && clearTimeout(thiz._connectTimeout);
                    thiz._connectTimeout = null;

                    if (scene) {
                        var l = new HomeLoadingLayer("DISCONNECTED", "Please check your network connection");
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

        onMessage: function (messageType, data) {
            var content = JSON.parse(data);

            //ext
            if (messageType === socket.SmartfoxClient.CallExtension) {
                var cmd = "ext_" + content.c;
                this.postEvent(cmd, content);
            }

            this.postEvent(messageType, content);
        },
        addListener: function (messageType, _listener, _target) {
            var arr = this.allListener[messageType];
            if (!arr) {
                arr = [];
                this.allListener[messageType] = arr;
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

        addExtensionListener: function (command, _listener, _target) {
            var msgType = "ext_" + command;
            this.addListener(msgType, _listener, _target);
        },

        removeListener: function (target) {
            for (var key in this.allListener) {
                if (!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for (var i = 0; i < arr.length;) {
                    if (arr[i] && arr[i].target === target) {
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
        postEvent: function (messageType, params) {
            if (params["c"] !== "100" && params["c"] !== "233" && params["c"] !== "xpong") {
                // cc.log("postEvent: messageType : " + messageType);
                // cc.log("params: " + JSON.stringify(params));
            }
            var arr = this.allListener[messageType];
            if (arr) {
                this.isBlocked = true;
                for (var i = 0; i < arr.length;) {
                    var target = arr[i];
                    if (target) {
                        target.listener.apply(target.target, [messageType, params]);
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

        _onHankShakeHandler: function (messageType, contents) {
            // cc.log(contents);
            if (contents.tk && contents.tk.length > 0) {
                var LoginMethod = cc.Global.getLoginMethod();
                switch (LoginMethod) {
                    case cc.Global.LoginAcc:
                        cc.Global.LoginByOpenID = false;
                        if ((cc.Global.getSaveUsername() && cc.Global.getSaveUsername().length > 1) &&
                            cc.Global.getSavePassword() && cc.Global.getSavePassword().length > 1) {
                            PlayerMe.username = cc.Global.getSaveUsername();
                            PlayerMe.password = cc.Global.getSavePassword();
                            SmartfoxClient.getInstance().sendLogin(PlayerMe.username, PlayerMe.password);
                        }
                        break;
                    case cc.Global.LoginReg:
                        cc.Global.LoginByOpenID = false;
                        cc.Global.LoginMethod = cc.Global.LoginAcc;
                        cc.Global.setLoginMethod(cc.Global.LoginMethod);
                        SmartfoxClient.getInstance().sendRegister();
                        break;
                    case cc.Global.LoginFb:
                        cc.Global.LoginByOpenID = true;
                        if (cc.Global.getTokenFB() && cc.Global.getTokenFB().length > 1) {
                            SmartfoxClient.getInstance().sendLoginFacebook(cc.Global.getTokenFB(), cc.Global.getSaveUsername());
                        }
                        break;
                    case cc.Global.LoginGG:
                        cc.Global.LoginByOpenID = true;
                        if (cc.Global.getTokenGG() && cc.Global.getTokenGG().length > 1) {
                            SmartfoxClient.getInstance().sendLoginGoogle(cc.Global.getTokenGG(), cc.Global.getSaveUsername());
                        }
                        break;
                    case cc.Global.LoginMobile:
                        cc.Global.LoginByOpenID = false;
                        if (cc.Global.getMobilePhone() && cc.Global.getMobilePhone().length > 1) {
                            SmartfoxClient.getInstance().sendLoginMobile(cc.Global.getMobilePhone(), cc.Global.getOTPPhone());
                        }
                        break;
                }
            }
        },

        _onLoginHandler: function (messageType, contents) {
            HomeWaittingLayer.getInstance().hide();

            var scene = cc.director.getRunningScene();
            if (contents.ec) { //login error
                scene._onLoginError(messageType, contents);
            }
            else {
                if (scene.ctor !== HomeScene.prototype.ctor && cc.Global.isLogin) {
                    return;
                }
                // send login success
                scene.onLoginSuccess();

                // send xping
                if (!this.xPingInterval) {
                    var thiz = this;
                    this.xPingInterval = setInterval(function () {
                        thiz.sendXPing();
                    }, 10000);
                }

                PlayerMe.SFS.userId = contents.id;
                if (this._loginHandler) {
                    this._loginHandler();
                    this._loginHandler = null;
                }
                else {
                    // var params = contents["p"];
                }
            }
        },

        _onJoinRoomHandler: function (messageType, contents) {
            if (contents.ec) {

            }
            else {
                PlayerMe.SFS.roomId = contents.r[0];
            }
        },

        _onJoinRoomExtension: function (cmd, data) {
            PlayerMe.SFS.roomId = data["p"]["1"];
        },

        _onUserExitRoomHandler: function (messageType, contents) {
            var userId = contents.u;
            if (PlayerMe.SFS.userId === userId) {
                PlayerMe.SFS.roomId = -1;
            }
        },

        sendResetPass: function (params) {
            // cc.log(params);
            this.sendExtensionRequestCurrentRoom("2108", params);
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
