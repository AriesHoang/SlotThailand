var HomeScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.setTag(0);
        // init google sdk web
        if (!cc.sys.isMobile) {
            if (!this.GoogleAuth) {
                this.initGoogleAuthClient();
            }
        }
        if (cc.Global.GetSetting("sound", 0) === 0)
            SoundPlayer.playSound("app-music-final", true);

        // HomeCMSConfig.getInstance().getConfig(HomeCMSConfig.LATEST_CONFIG, function (res) {
        //     cc.Global.callCenter = res.callcenter;
        //     cc.Global.chatBot = res.chatboturl;
        //     cc.Global.fanpage = res.fbfanpage;
        //     cc.Global.supportPhone = res.supportphone;
        //     cc.Global.luckyHelp = res.luckygamehelp;
        // });

        // HomeCMSConfig.getInstance().getConfig(HomeCMSConfig.BAD_WORD, function (res) {
        //     cc.Global.arrBadWord = res || cc.Global.arrBadWord;
        // });
        //
        // HomeCMSConfig.getInstance().getConfig(HomeCMSConfig.MONEY_ICON_CONFIG_URL, function (res) {
        //     cc.Global.moneyConfig = res || cc.Global.moneyConfig;
        // });
        //
        // HomeCMSConfig.getInstance().getConfig(HomeCMSConfig.LIST_PLACE_CONFIG_URL, function (res) {
        //     cc.Global.placeList = res || cc.Global.placeList;
        // });

        var bg = new cc.Sprite("res/Home/home_bg.jpg");
        bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.addChild(bg);

        this.gameLayer = new HomeGameLayer();
        //gameLayer.visible=false;
        this.addChild(this.gameLayer);
        //this.gameLayer = gameLayer;

        this.bottomBar = new HomeBottomBar();
        //this.bottomBar.visible=false;
        // this.bottomBar.scale = 1.7;
        this.addChild(this.bottomBar);
        //this.bottomBar = bottomBar;

        this.topBar = new HomeTopBar();
        //  topBar.visible=false;
        //   this.topBar.scale = 1.5;
        this.addChild(this.topBar);
        // this.topBar = topBar;

        this.jackpotLayer = new HomeJackpotLayer();
        this.addChild(this.jackpotLayer);
        //this.jackpotLayer = jackpotLayer;


        this.menuLayer = new HomeMenuLayer();
        this.addChild(this.menuLayer);
        // this.menuLayer = menuLayer;

        this.loginDialog = new HomeLoginDialog();
        this.loginDialog.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.loginDialog.visible = false;
        this.addChild(this.loginDialog);

        this.popupLayer = new HomePopupLayer();
        this.addChild(this.popupLayer);

        this.agencyLayer = new HomeAgencyLayer();
        this.addChild(this.agencyLayer);


        var thiz = this;
        this.gameLayer.jackpotButonHandler = (function () {
            thiz.jackpotButonHandler();
        });

        this.gameLayer.agencyButtonHandler = (function () {
            thiz.agencyButtonHandler();
        });

        this.topBar.menuBt.addClickEventListener(function () {
            thiz.menuButtonHandler();
        });

        this.topBar.eventBt.addClickEventListener(function () {
            if (cc.Global.isLogin)
                thiz.eventButtonHandler();
        });

        this.topBar.supportBt.addClickEventListener(function () {
            if (cc.Global.isLogin)
                thiz.supportButtonHandler();
        });

        this.topBar.giftCodeBt.addClickEventListener(function () {
            if (cc.Global.isLogin)
                thiz.giftCodeButtonHandler();
        });

        this.topBar.inboxBt.addClickEventListener(function () {
            // if (cc.Global.isLogin)
            thiz.inboxButtonHandler();
        });

        this.topBar.signinButtonHandler = function () {
            thiz.signinButtonHandler();
        };

        this.topBar.signupButtonHandler = function () {
            thiz.signupButtonHandler();
        };

        this.topBar.userinfoBt.addClickEventListener(function () {
            thiz.userinfoButtonHandler();
        });

        this.menuLayer.logoutBt.addClickEventListener(function () {
            thiz.doLogout();
            thiz.loginDialog._initAccRemember();
            thiz.loginDialog.visible = true;
            thiz.loginDialog._initGUIs(0);
            thiz.menuLayer.hide();
        });

        this.topBar.signinBt.addClickEventListener(function () {
            thiz.loginDialog.visible = true;
            thiz.loginDialog._initGUIs(0);
        });
        this.topBar.signupBt.addClickEventListener(function () {
            thiz.loginDialog.visible = true;
            thiz.loginDialog._initGUIs(1);
        });

        this._initAnimation();

        if (PlayerMe.SFS.roomId) {
            // logged in smartfox server

            this.topBar.infoLayer.visible = true;
            this.topBar.loginLayer.visible = false;
            HomeFloatButton.getInstance().show(this);
        } else {
            PlayerMe.SFS.roomId = 1;
            // var key = cc.sys.localStorage.getItem("accessToken");
            // if (key && key.length) {
            //     this.onAccessTokenReceived(key);
            // }
        }

        // cc.log("RoomId: " + PlayerMe.SFS.roomId);
        //=============LOGIN DIALOG ZONE

        this.loginDialog.loginBtn.addClickEventListener(function () {
            // cc.log("Login: " + thiz.loginDialog.usernameLogin.getText() + " - " + thiz.loginDialog.passwordLogin.getText());
            if (thiz.loginDialog.checkInputFormLogin()) {
                PlayerMe.username = thiz.loginDialog.usernameLogin.getText();
                PlayerMe.password = thiz.loginDialog.passwordLogin.getText();
                SmartfoxClient.getInstance().initConnectSmartfox(function () {
                    SmartfoxClient.getInstance().sendLogin(PlayerMe.username, PlayerMe.password);
                });
                // if (cc.sys.os === cc.sys.OS_ANDROID)
                //     jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "LoginNormal", "()V");
                // else if (cc.sys.os === cc.sys.OS_IOS)
                //     jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Login Bình thường", "Login Bình thường");
            }
        });

        this.loginDialog.loginPhoneBtn.addClickEventListener(function () {
            if (thiz.loginDialog.checkInputFormLoginWithPhoneNumber()) {
                var _phoneNumber = thiz.loginDialog.phoneNumberTF.getText();
                var _code = thiz.loginDialog.phoneOtpTF.getText();
                SmartfoxClient.getInstance().initConnectSmartfox(function () {
                    SmartfoxClient.getInstance().sendLoginMobile(_phoneNumber, _code);
                });
                // if (cc.sys.os === cc.sys.OS_ANDROID)
                //     jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "LoginByPhone", "()V");
            }
        });

        this.loginDialog.registerBtn.addClickEventListener(function () {
            if (thiz.loginDialog.checkInputFormRegister()) {
                var serverInfo = {
                    host: "207.148.78.194",
                    port: 9933,
                    webSocketUrl: "ws://207.148.78.194:9999/websocket"
                };
                serverInfo.username = thiz.loginDialog.userNameReg.getText();
                serverInfo.password = thiz.loginDialog.passReg.getText();
                serverInfo.rePassword = thiz.loginDialog.rePassReg.getText();
                serverInfo.captcha = thiz.loginDialog.captchaReg.getText();
                serverInfo.tokenCaptcha = cc.Global.captchaData.token;
                cc.Global.LoginMethod = cc.Global.LoginReg;
                cc.Global.setLoginMethod(cc.Global.LoginMethod);
                PlayerMe.username = serverInfo.username;
                PlayerMe.password = serverInfo.password;

                SmartfoxClient.getInstance().close();
                SmartfoxClient.getInstance().connect(serverInfo, function () {
                });
                // if (cc.sys.os === cc.sys.OS_ANDROID)
                //     jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "LoginNormal", "()V");
                // else if (cc.sys.os === cc.sys.OS_IOS)
                //     jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Login Bình thường", "Login Bình thường");
            } else {
                thiz.loginDialog.getCaptcha();
                thiz.loginDialog.captchaReg.setText("");
            }
        });

        this.loginDialog.btnFacebook.addClickEventListener(function () {
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
                        }, {scope: 'public_profile,email'});
                    }
                });
            }
        });

        this.loginDialog.btnFacebookReg.addClickEventListener(function () {
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
        });

        this.loginDialog.btnGoogle.addClickEventListener(function () {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "loginByGoogle", "(Ljava/lang/String;)V", "haha");
                // jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "LoginByGoogle", "()V");
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("AppController", "loginGGClick", null);
            }
            else if (!cc.sys.isMobile) {
                if (thiz.GoogleAuth) {
                    if (thiz.GoogleAuth.isSignedIn.get()) {
                        var accessToken = thiz.GoogleAuth.currentUser.get().Zi.id_token;
                        SmartfoxClient.getInstance().initConnectSmartfox(function () {
                            SmartfoxClient.getInstance().sendLoginGoogle(accessToken, cc.Global.getSaveUsername() ? cc.Global.getSaveUsername().length > 1 ? cc.Global.getSaveUsername() : "" : "");
                        });
                    }
                    else {
                        SmartfoxClient.getInstance().initConnectSmartfox(function () {
                            thiz.GoogleAuth.signIn({prompt: 'select_account'});
                        });
                    }
                }
            }
        });

        this.loginDialog.btnGoogleReg.addClickEventListener(function () {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "loginByGoogle", "(Ljava/lang/String;)V", "haha");
                // jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "LoginByGoogle", "()V");
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("AppController", "loginGGClick", null);
            }
            else if (!cc.sys.isMobile) {
                if (thiz.GoogleAuth) {
                    if (thiz.GoogleAuth.isSignedIn.get()) {
                        var accessToken = thiz.GoogleAuth.currentUser.get().Zi.id_token;
                        SmartfoxClient.getInstance().initConnectSmartfox(function () {
                            SmartfoxClient.getInstance().sendLoginGoogle(accessToken, cc.Global.getSaveUsername() ? cc.Global.getSaveUsername().length > 1 ? cc.Global.getSaveUsername() : "" : "");
                        });
                    }
                    else {
                        SmartfoxClient.getInstance().initConnectSmartfox(function () {
                            thiz.GoogleAuth.signIn({prompt: 'select_account'});
                        });
                    }
                }
            }
        });

        // var thiz = this;
        // SmartfoxClient.getInstance().initConnectSmartfox(function () {
        //     thiz.handleAccount();
        //     thiz.initController();
        // });

        this.handleAccount();
        this.initController();

        // event
        if (cc.Global.eventData) {
            this.initEventItems(cc.Global.eventData, true);
        }
        GlobalEvent.getInstance().addListener("assetChange", this.onUpdateUserCoin, this);
        // GlobalEvent.getInstance().addListener("onChangeUserMoney", this.updateUserCoinBroadCast, this);
    },

    _initAnimation: function () {
        var allAnimationObj = [
            this.topBar.eventBt,
            this.topBar.giftCodeBt,
            this.topBar.inboxBt
        ];

        var delay = new cc.DelayTime(3);
        var index = 0;
        var callfunc = new cc.CallFunc(function () {
            if (allAnimationObj[index].runHomeAnimation) {
                allAnimationObj[index].runHomeAnimation();
            }
            index = (index + 1) % allAnimationObj.length;
        });

        this.runAction(new cc.RepeatForever(new cc.Sequence(delay, callfunc)));
    },

    initController: function () {
        this._controller = new HomeController(this);
    },

    onEnter: function () {
        this._super();
    },

    onExit: function () {
        this._super();
        if (this._controller) {
            this._controller.release();
            this._controller = null;
        }
        // SoundPlayer.stopAllSound();
    },

    updateUserInfo: function (info) {
        // cc.log("updateUserInfo: " + JSON.stringify(info));
        for (var key in info) {
            if (info.hasOwnProperty(key))
                PlayerMe[key] = info[key];
        }

        // cc.log("PlayerMe update: " + JSON.stringify(PlayerMe));
        if (this.topBar.nameLabel) this.topBar.nameLabel.setString(PlayerMe.username);
        cc.Global.setSaveUsername(PlayerMe.username);
        cc.Global.setSavePassword(PlayerMe.password);
        cc.Global.setToken(PlayerMe.token);
        // cc.log("updateUserInfo: " + cc.Global.getSaveUsername() + " - " + cc.Global.getSavePassword());
        this.loginDialog.visible = false;
        if (!cc.Global.isLogin) {
            this.onLoginSuccess();
            if (cc.Global.LoginMethod === cc.Global.LoginAcc) {

            } else if (cc.Global.LoginMethod === cc.Global.LoginReg) {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logCompletedRegistrationEvent", "(Ljava/lang/String;Ljava/lang/String;)V", "Account");
                }
            }

        }
        //Show tai xiu
        // if (cc.Global.isLogin) {
        //     SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_TaiXiu);
        // }
    },

    updateUserCoin: function (value) {
        if (this.topBar.goldLabel) {
            this.topBar.goldLabel.stopAllActions();
            cc.Global.runActionNumber(this.topBar.goldLabel, value, this.oldValue);
            this.oldValue = PlayerMe.gold;
            // this.topBar.goldLabel.setString(cc.Global.NumberFormat1(PlayerMe.gold || 0));
        }
        PlayerMe.gold = value;
    },

    // updateUserCoinBroadCast: function (val1, val2) {
    //     cc.log("updateUserCoinBroadCast");
    //     cc.log(val1);
    //     cc.log(val2);
    //     PlayerMe.gold = val2;
    //     cc.log(PlayerMe.gold);
    //     if (this.topBar.goldLabel) this.topBar.goldLabel.setString(cc.Global.NumberFormat1(val2));
    // },

    updateBroadCastMessage: function (res) {
        this.bottomBar.setMessage(res);
        GameConfig.broadcastMessage = res;
    },

    updateUnreadMailNotification: function (numberOfUnread) {
        this.topBar.mailNotification.setNumber(numberOfUnread);
    },

    onUpdateUserCoin: function (cmd, value) {
        this.updateUserCoin(value);
    },

    jackpotButonHandler: function () {
        this.jackpotLayer.show();
    },

    agencyButtonHandler: function () {
        this.agencyLayer.show();
    },

    menuButtonHandler: function () {
        this.menuLayer.show();
    },

    supportButtonHandler: function () {
        // var dialog = new HomeSupportDialog();
        // dialog.show();
    },

    rankButtonHandler: function () {
        var dialog = new HomeRankingDialog();
        dialog.show();
    },

    eventButtonHandler: function () {
        if (!this.topBar.currentItemEvent)
            return;
        var dialog = new HomeEventDialog(this.topBar.currentItemEvent);
        dialog.show();
    },

    giftCodeButtonHandler: function () {
        var dialog = new HomeProfileDialog();
        dialog._showViewIndex(1);
        dialog.show();
    },

    inboxButtonHandler: function () {
        if (cc.Global.isLogin) {
            var dialog = new HomeInboxDialog();
            dialog.show();
        } else {
            var popup = new HomeNotifyPopup();
            popup.showNotification("Bạn cần đăng nhập để sử dụng!");
        }
    },

    userinfoButtonHandler: function () {
        var dialog = new HomeProfileDialog();
        dialog.show();
    },
    //===========================================
    //=========================LOGIN ZONE PROCESS
    //===========================================
    handleAccount: function () {
        if (cc.Global.getLoginMethod()) {
            if (cc.Global.getLoginMethod() === "" || cc.Global.getLoginMethod() === "0") {
                this.loginDialog.visible = true;
                this.topBar.infoLayer.visible = false;
                this.topBar.loginLayer.visible = true;
            }
            else {
                if (cc.Global.isLogin)
                    return;
                else {
                    SmartfoxClient.getInstance().initConnectSmartfox(function () {
                        SmartfoxClient.getInstance().loginWithLastSetting();
                    });
                }
            }
        }
        else {
            this.loginDialog.visible = true;
            this.topBar.infoLayer.visible = false;
            this.topBar.loginLayer.visible = true;
        }
    },

    onLoginSuccess: function () {
        cc.Global.isLogin = true;
        this.topBar.infoLayer.visible = true;
        this.topBar.loginLayer.visible = false;

        // HomeFloatButton.getInstance().show(this);

        if (cc.Global.isShowLuckyDialog) {
            var dialog = new HomeLuckyDialog();
            // dialog.show();
        }

        // track
        var LoginMethod = cc.Global.getLoginMethod();
        switch (LoginMethod) {
            case cc.Global.LoginAcc:
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "logEventFirebase", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "add_payment_info", "Login Bình thường", "");
                }
                else if (cc.sys.os === cc.sys.OS_IOS)
                    jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Login Bình thường", "Login Bình thường");
                if (!cc.sys.isNative) {
                    gtag('create', 'UA-115654005-1', 'auto');
                    gtag(function (tracker) {
                        tracker.send('event', 'Login thành công', 'Manual', 'Đăng nhập bình thường. ' + 'Tài khoản: ' + PlayerMe.username);
                    });
                }
                break;
            case cc.Global.LoginReg:
                if (cc.sys.os === cc.sys.OS_ANDROID)
                    jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logEventFirebase", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "add_payment_info", "Login Đăng kí", "Login Đăng kí");
                else if (cc.sys.os === cc.sys.OS_IOS)
                    jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Login Đăng kí", "Login Đăng kí");
                if (!cc.sys.isNative) {
                    gtag('create', 'UA-115654005-1', 'auto');
                    gtag(function (tracker) {
                        tracker.send('event', 'Đăng ký thành công', 'By Normal', 'Đăng ký tài khoản mới. ' + 'Tài khoản: ' + PlayerMe.username);
                    });
                }
                break;
            case cc.Global.LoginFb:
                if (cc.sys.os === cc.sys.OS_ANDROID)
                    jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logEventFirebase", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "add_payment_info", "Login By Facebook", "Login By Facebook");
                else if (cc.sys.os === cc.sys.OS_IOS)
                    jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Login By Facebook", "Login By Facebook");
                if (!cc.sys.isNative) {
                    gtag('create', 'UA-115654005-1', 'auto');
                    gtag(function (tracker) {
                        tracker.send('event', 'Login thành công', 'By Facebook', 'Đăng nhập bằng facebook. ' + 'Tài khoản: ' + PlayerMe.username);
                    });
                }
                break;
            case cc.Global.LoginGG:
                if (cc.sys.os === cc.sys.OS_ANDROID)
                    jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logEventFirebase", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "add_payment_info", "Login By Google", "Login By Google");
                else if (cc.sys.os === cc.sys.OS_IOS)
                    jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Login By Google", "Login By Google");
                if (!cc.sys.isNative) {
                    gtag('create', 'UA-115654005-1', 'auto');
                    gtag(function (tracker) {
                        tracker.send('event', 'Login thành công', 'By Google', 'Đăng nhập bằng google. ' + 'Tài khoản: ' + PlayerMe.username);
                    });
                }
                break;
            case cc.Global.LoginMobile:
                if (cc.sys.os === cc.sys.OS_ANDROID)
                    jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logEventFirebase", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "add_payment_info", "Login By Phone", "Login By Phone");
                else if (cc.sys.os === cc.sys.OS_IOS)
                    jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Login By Phone", "Login By Phone");

                if (!cc.sys.isNative) {
                    gtag('create', 'UA-115654005-1', 'auto');
                    gtag(function (tracker) {
                        tracker.send('event', 'Login thành công', 'By phone', 'Đăng nhập bằng số điện thoại. ' + 'Tài khoản: ' + PlayerMe.username);
                    });
                }
                break;
        }
    },

    _onLoginError: function (cmd, data) {
        cc.log("_onLoginError: " + JSON.stringify(data));
        cc.Global.setLoginMethod("0");
        var message;
        switch (data["ec"]) {
            case 2:
                this.doLogout();
                this.loginDialog._initAccRemember();
                this.loginDialog.visible = true;
                this.loginDialog._initGUIs(0);
                message = "Phiên đăng nhập của bạn đã hết hạn. Mời đăng nhập lại";
                this.loginDialog._showErrorWhenRegisterFail(message);
                break;
            case 4:
                cc.log("_onLoginError: Input your name!");
                this.loginDialog.showInputNameDialog();
                break;
            case cc.Global.REGISTER_USERNAME_INVALID:
                message = cc.Global.GetErrorMessage(cc.Global.REGISTER_USERNAME_INVALID);
                this.loginDialog._showErrorWhenRegisterFail(message);
                break;
            case cc.Global.REGISTER_PASSWORD_INVALID:
                message = cc.Global.GetErrorMessage(cc.Global.REGISTER_PASSWORD_INVALID);
                this.loginDialog._showErrorWhenRegisterFail(message);
                break;
            case cc.Global.REGISTER_USERNAME_TAKEN:
                message = cc.Global.GetErrorMessage(cc.Global.REGISTER_USERNAME_TAKEN);
                this.loginDialog._showErrorWhenRegisterFail(message);
                break;
            case cc.Global.REGISTER_ERROR:
                message = cc.Global.GetErrorMessage(cc.Global.REGISTER_ERROR);
                this.loginDialog._showErrorWhenRegisterFail(message);
                break;
            case cc.Global.LOGIN_USER_NO_REGISTER:
                message = cc.Global.GetErrorMessage(cc.Global.LOGIN_USER_NO_REGISTER);
                this.loginDialog._showErrorWhenLoginFail(message);
                this.loginDialog._showErrorWhenRegisterFail(message);
                break;
            case cc.Global.LOGIN_PASSWORD_WRONG:
                if (!this.loginDialog.visible) {
                    this.loginDialog._initAccRemember();
                    this.loginDialog.visible = true;
                    this.loginDialog._initGUIs(0);
                }
                message = cc.Global.GetErrorMessage(cc.Global.LOGIN_PASSWORD_WRONG);
                this.loginDialog._showErrorWhenLoginFail(message);
                break;
            case cc.Global.LOGIN_USER_BANNED:
                if (!this.loginDialog.visible) {
                    this.loginDialog._initAccRemember();
                    this.loginDialog.visible = true;
                    this.loginDialog._initGUIs(0);
                }
                message = cc.Global.GetErrorMessage(cc.Global.LOGIN_USER_BANNED);
                this.loginDialog._showErrorWhenLoginFail(message);
                break;
            case cc.Global.LOGIN_ERROR:
                message = cc.Global.GetErrorMessage(cc.Global.LOGIN_ERROR);
                this.loginDialog._showErrorWhenLoginFail(message);
                break;
            case cc.Global.EXTERNALLOGIN_REQUIRE_USERNAME:
                message = cc.Global.GetErrorMessage(cc.Global.EXTERNALLOGIN_REQUIRE_USERNAME);
                this.loginDialog.showInputNameDialog(message);
                break;
            case cc.Global.EXTERNALLOGIN_USERNAME_TAKEN:
                message = cc.Global.GetErrorMessage(cc.Global.EXTERNALLOGIN_USERNAME_TAKEN);
                this.loginDialog.showInputNameDialog(message);
                break;
            case cc.Global.EXTERNALLOGIN_USERNAME_INVALID:
                message = cc.Global.GetErrorMessage(cc.Global.EXTERNALLOGIN_USERNAME_INVALID);
                this.loginDialog.showInputNameDialog(message);
                break;
            case cc.Global.EXTERNALLOGIN_REQUIRE_EMAIL_PERMISSION:
                message = cc.Global.GetErrorMessage(cc.Global.EXTERNALLOGIN_REQUIRE_EMAIL_PERMISSION);
                this.loginDialog.showInputNameDialog(message);
                break;
            case cc.Global.EXTERNALLOGIN_TOKEN_INVALID:
                message = cc.Global.GetErrorMessage(cc.Global.EXTERNALLOGIN_TOKEN_INVALID);
                // this.loginDialog.showInputNameDialog(message);
                break;
            case cc.Global.EXTERNALLOGIN_UNKOWN_ERROR:
                message = cc.Global.GetErrorMessage(cc.Global.EXTERNALLOGIN_UNKOWN_ERROR);
                // this.loginDialog.showInputNameDialog(message);
                break;
            case cc.Global.EXTERNALLOGIN_PROVIDER_INVALID:
                message = cc.Global.GetErrorMessage(cc.Global.EXTERNALLOGIN_PROVIDER_INVALID);
                break;
            case cc.Global.EXTERNALLOGIN_USER_BANNED:
                message = cc.Global.GetErrorMessage(cc.Global.EXTERNALLOGIN_USER_BANNED);
                break;
            case cc.Global.PHONELOGIN_PHONE_NO_REGISTER:
                message = cc.Global.GetErrorMessage(cc.Global.PHONELOGIN_PHONE_NO_REGISTER);
                break;
            case cc.Global.PHONELOGIN_PHONE_NO_VERIFY:
                message = cc.Global.GetErrorMessage(cc.Global.PHONELOGIN_PHONE_NO_VERIFY);
                break;
            case cc.Global.PHONELOGIN_WRONG_OTP:
                message = cc.Global.GetErrorMessage(cc.Global.PHONELOGIN_WRONG_OTP);
                break;
            case cc.Global.PHONELOGIN_USER_BANNED:
                message = cc.Global.GetErrorMessage(cc.Global.PHONELOGIN_USER_BANNED);
                break;
            case cc.Global.CAPTCHA_NOT_MATCH:
                message = cc.Global.GetErrorMessage(cc.Global.CAPTCHA_NOT_MATCH);
                this.loginDialog._showErrorWhenRegisterFail(message);
                break;
            default:
                message = cc.Global.GetErrorMessage();
                break;
        }

        // hard fix disconnect
        SmartfoxClient.getInstance().close();
    },

    _getVipInfoCallback: function (isSuccess, result) {
        if (isSuccess) {
            PlayerMe.vipLevel = result["data"]["CurrentLevel"];
            PlayerMe.vipPoint = result["data"]["VipPoint"];
            PlayerMe.vipName = result["data"]["DisplayName"];
        }
    },
    initEventItems: function (items, skipShow) {
        this.topBar.eventActionChangeImage(items);
        if (skipShow || cc.Global.eventData)
            return;
        cc.Global.eventData = items;
    },

    doLogout: function () {
        switch (cc.Global.LoginMethod) {
            case cc.Global.LoginReg:
                break;
            case cc.Global.LoginAcc:
                break;
            case cc.Global.LoginMobile:
                break;
            case cc.Global.LoginFb:
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logoutByFacebook", "()V");
                }
                else if (cc.sys.os === cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("AppController", "logoutFBClicked", null);
                }
                else if (!cc.sys.isMobile) {
                    FB.logout();
                }
                break;
            case  cc.Global.LoginGG:
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logoutByGoogle", "()V");
                }
                else if (cc.sys.os === cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("AppController", "logoutGGClick", null);
                }
                else if (!cc.sys.isMobile) {
                    this.GoogleAuth.signOut();
                }
                break;
        }

        cc.Global.isLogin = false;
        cc.Global.clearAllSetting();
        this.topBar.infoLayer.visible = false;
        this.topBar.loginLayer.visible = true;
        SmartfoxClient.getInstance().close();
        HomeFloatButton.getInstance().hide();
        MiniGameNavigator.hideAll();
    },
    onInAppPurchase: function (data) {
        if (data.errorCode === 0) {
            this.updateUserCoin(data.money);
        } else {
            cc.log("Error with message: " + data.errorMessage);
        }
    },

    initGoogleAuthClient: function () {
        // var thiz = this;
        // gapi.client.init({
        //     'clientId': '749500027153-b17gnekc3h1gdpi0cmjq1uo8ci2uvac4.apps.googleusercontent.com',
        //     'clientSecret': 'WYXFdHr6tWvHVjqkE7cJPYOt',
        //     'scope': 'profile email',
        //     'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        // }).then(function () {
        //     thiz.GoogleAuth = gapi.auth2.getAuthInstance();
        //     // Listen for sign-in state changes.
        //     thiz.GoogleAuth.isSignedIn.listen(thiz.GoogleSigninStatus);
        // });
    },

    GoogleSigninStatus: function (isSignedIn) {
        if (isSignedIn) {
            if (!this.GoogleAuth)
                this.GoogleAuth = gapi.auth2.getAuthInstance();
            var accessToken = this.GoogleAuth.currentUser.get().Zi.id_token;
            if (!cc.Global.isLogin)
                SmartfoxClient.getInstance().sendLoginGoogle(accessToken, cc.Global.getSaveUsername() ? cc.Global.getSaveUsername().length > 1 ? cc.Global.getSaveUsername() : "" : "");
        }
    },

    onResetPassRespone: function (data) {
        var dialog = new HomeNotifyPopup();
        dialog.showNotification(data.errorMessage);
    }
});


window._cc_finished_Loading = function () {
    cc.director.runScene(new HomeScene());
};
