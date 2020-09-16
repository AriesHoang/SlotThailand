var HomeNotificationNode = cc.Node.extend({
    ctor: function () {
        this._super();
        var bg = new cc.Sprite("#home_notif_bg.png");
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        bg.setPosition(this.width / 2, this.height / 2);
        bg.setScale(1.2);
        this.addChild(bg);

        this.setVisible(false);

        this.label = new cc.LabelTTF("", cc.res.font.Myriad_Pro_Regular, 14);
        this.label.setPosition(this.width / 2, this.height / 2 - 3);
        this.addChild(this.label);

    },

    setNumber: function (number) {
        if (number <= 0) {
            this.setVisible(false);
        }
        else {
            // this.setVisible(true);
            this.setVisible(false);
            if (number > 99) {
                this.label.setString("99+");
            }
            else {
                this.label.setString(number.toString());
            }
        }
    }
});

var HomeTopBar = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setContentSize(cc.size(1280, 720));
        this.setAnchorPoint(cc.p(0.0, 1.0));
        this.setPosition(cc.p(0.0, cc.winSize.height));
        this.setScale(cc.winSize.screenScale);

        this._initInfoLayer();
        this._initLoginLayer();

        this.currentdate = new Date();
    },


    _runShakeAction: function (node) {
        var rotateLeft = new cc.RotateTo(0.3, -20);
        var rotateRight = new cc.RotateTo(0.3, 20);
        var rotateAction = new cc.RepeatForever(new cc.Sequence(rotateLeft, rotateRight));

        node.runAction(rotateAction);
        setTimeout(function () {
            node.stopAllActions();
            node.setRotation(0);
        }, 3000);
    },

    _initLoginLayer: function () {
        var loginLayer = new cc.Node();
        this.addChild(loginLayer);
        var thiz = this;

        // var signinBt = new ccui.Button("home_dialog_btn_login.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var signinBt = new ccui.Button("home_btn_dangnhap.png", "", "", ccui.Widget.PLIST_TEXTURE);
        signinBt.scale = 0.68;
        //signinBt.setZoomScale(0.6);
        signinBt.setPosition(120, 660);
        loginLayer.addChild(signinBt);
        this.signinBt = signinBt;

        // var signupBt = new ccui.Button("home_dialog_btn_register.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var signupBt = new ccui.Button("home_btn_dangky.png", "", "", ccui.Widget.PLIST_TEXTURE);
        signupBt.scale = 0.68;
        //signupBt.setZoomScale(0.0);
        signupBt.setPosition(320, 660);
        loginLayer.addChild(signupBt);
        this.signupBt = signupBt;
        // signupBt.visible = false;

        this.loginLayer = loginLayer;
        loginLayer.visible = false;

        // signinBt.addClickEventListener(function () {
        //     // thiz.signinButtonHandler();
        //     thiz.showLoginView(true);
        // });
        //
        // signupBt.addClickEventListener(function () {
        //     // thiz.signupButtonHandler();
        //     thiz.showLoginView(false);
        // });
    },

    _initInfoLayer: function () {
        // cc.log("cdebug :: initInfoLayer");
        var infoLayer = new cc.Node();
        this.addChild(infoLayer);

        var avt = new UserAvatarMe();
        avt.setPosition(60, 660);
        infoLayer.addChild(avt, 2);
        avt.scale = 0.9;
        this.avatar = avt;

        var userinfoBt = new ccui.Widget();
        userinfoBt.setContentSize(avt.getContentSize());
        userinfoBt.setPosition(avt.getPosition());
        userinfoBt.setTouchEnabled(true);
        infoLayer.addChild(userinfoBt);
        this.userinfoBt = userinfoBt;

        // ﻿gate_bg_coin.png
        // var bgGoldLabel=new cc.Sprite("#bg_naptien.png");
        // bgGoldLabel.scale=0.68;
        // bgGoldLabel.setPosition(430,660);
        // infoLayer.addChild(bgGoldLabel);

        /*
         var bg = new ccui.Scale9Sprite("gate_bg_coin.png");
         bg.setPreferredSize(cc.size(300, 90));
         bg.setPosition(500, 100);
         this.mainLayer.addChild(bg,500);
        * */
        var bgGoldLabel = new ccui.Scale9Sprite("gate_bg_coin.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgGoldLabel.setPreferredSize(cc.size(450, 90));
        bgGoldLabel.scale = 0.6;
        bgGoldLabel.setPosition(430, 660);
        infoLayer.addChild(bgGoldLabel);

        var iconMoney = new cc.Sprite("#gate_money_icon.png");
        iconMoney.scale = 0.55;
        iconMoney.setPosition(325, 660);
        infoLayer.addChild(iconMoney);

        var iconNapTien = new ccui.Button("gate_btn_naptien.png", "", "", ccui.Widget.PLIST_TEXTURE);
        iconNapTien.scale = 0.58;
        iconNapTien.setPosition(530, 660);
        iconNapTien.visible = false;
        infoLayer.addChild(iconNapTien);

        var goldLabel = new cc.LabelTTF("1000000000", cc.res.font.Myriad_Pro_Regular, 23);
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(360, 660);
        infoLayer.addChild(goldLabel);
        infoLayer.retain();
        this.goldLabel = goldLabel;

        var nameLabel = new cc.LabelTTF("Username", cc.res.font.Myriad_Pro_Regular, 20);
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(115, 660);
        nameLabel.setLocalZOrder(1000);
        infoLayer.addChild(nameLabel);
        this.nameLabel = nameLabel;

        var vipGameBg = new cc.Sprite("#gate_btn_vip.png");
        vipGameBg.scale = 0.68;
        vipGameBg.setPosition(680, 660);
        vipGameBg.visible = false;
        infoLayer.addChild(vipGameBg);

        var vipGameBanner = new cc.Sprite();
        vipGameBanner.scale = 0.68;
        vipGameBanner.setPosition(680, 660);
        vipGameBanner.visible = false;
        infoLayer.addChild(vipGameBanner);

        var giftCodeBt = new ccui.Button("gate_btn_gift.png", "", "", ccui.Widget.PLIST_TEXTURE);
        giftCodeBt.scale = 0.6;
        giftCodeBt.setPosition(220, 50);
        this.addChild(giftCodeBt);
        this.giftCodeBt = giftCodeBt;
        this.giftCodeBt.visible = false;

        var vongquayBt = new ccui.Button("gate_btn_luckywheel.png", "", "", ccui.Widget.PLIST_TEXTURE);
        vongquayBt.scale = 0.6;
        vongquayBt.setPosition(80, 50);
        vongquayBt.setOpacity(255);
        this.addChild(vongquayBt, 1);
        vongquayBt.addClickEventListener(function () {
            if (cc.Global.isLogin) {
                var dialog = new HomeLuckyDialog();
                dialog.show();
                // SceneNavigator.startGame(GameType.GAME_VongQuay);
            } else {
                var d = new HomeNotifyPopup();
                d.showNotification(MultiLanguage.getTextByKey("TRY_LOGIN"));
            }
        });


        var inboxBt = new ccui.Button("gate_btn_mail.png", "", "", ccui.Widget.PLIST_TEXTURE);
        inboxBt.scale = 0.68;
        inboxBt.setPosition(990, 660);
        // inboxBt.setPosition(1150, 660);
        this.addChild(inboxBt);
        // inboxBt.setVisible(false);
        this.inboxBt = inboxBt;
        inboxBt.visible = false;

        var notif2 = new HomeNotificationNode();
        notif2.setPosition(50, 4);
        this.inboxBt.getRendererNormal().addChild(notif2);
        this.mailNotification = notif2;

        var menuBt = new ccui.Button("gate_btn_setting.png", "", "", ccui.Widget.PLIST_TEXTURE);
        menuBt.scale = 0.68;
        menuBt.setPosition(1230, 660);
        this.addChild(menuBt);
        this.menuBt = menuBt;

        // var stencil = new cc.Sprite("#banner1.png");
        var stencil = new cc.Sprite("res/Home/event_frame.png");
        // stencil.setScale(0.9);

        var clippingNode = new cc.ClippingNode(stencil);
        clippingNode.setAlphaThreshold(0.5);

        var eventSprite = new cc.Sprite("res/Home/banner1.png");
        // var eventSprite = new cc.Sprite();
        eventSprite.visible=false;
        eventSprite.setScale(0.9);
        clippingNode.addChild(eventSprite);
        clippingNode.visible=false;
        clippingNode.setPosition(170, 340);
        this.addChild(clippingNode);

        this.eventSprite = eventSprite;
        this.clippingNode = clippingNode;

        // var lbEvent = MultiLanguage.createLabelTTFFont("EVENT_TITLE", cc.res.font.Myriad_Pro_Bold, 18);
        // lbEvent.enableStroke(cc.color("#10d4e3"), 1);
        // lbEvent.setPosition(eventSprite.width / 2, eventSprite.height / 2 - 20);
        // eventSprite.addChild(lbEvent);

        var eventBt = new ccui.Button("", "", "", ccui.Widget.PLIST_TEXTURE);
        eventBt.setPosition(2150, 640);
        eventBt.visible = false;
        this.addChild(eventBt, 2);
        this.eventBt = eventBt;


        var supportBt = new ccui.Button("gate_btn_support.png", "", "", ccui.Widget.PLIST_TEXTURE);
        supportBt.setPosition(990, 660);
        supportBt.scale = 0.68;
        this.addChild(supportBt);
        supportBt.visible = false;
        this.supportBt = supportBt;


        var shopBt = new ccui.Button("gate_btn_shop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        shopBt.scale = 0.68;
        shopBt.setPosition(1150, 660);
        shopBt.setTouchEnabled(true);
        this.addChild(shopBt);
        this.shopBt = shopBt;
        // shopBt.visible = false;

        shopBt.addClickEventListener(function () {
            // var dialog = new HomeNotifyPopup();
            // dialog.showNotification("Đang trong giai đoạn phát triển");
            if (cc.Global.isLogin) {
                var dialog = new HomeChargeMoneyDialog();
                dialog.show();
            } else {
                var popup = new HomeNotifyPopup();
                popup.showNotification("Bạn cần đăng nhập để sử dụng!");
            }
        });

        var fbBt = new ccui.Button("gate_btn_facebook.png", "", "", ccui.Widget.PLIST_TEXTURE);
        fbBt.scale = 0.68;
        // fbBt.setPosition(910, 660);
        fbBt.setPosition(1070, 660);
        // fbBt.setPosition(, 50);
        this.addChild(fbBt);
        // fbBt.visible = false;
        //
        infoLayer.visible = true;
        this.infoLayer = infoLayer;
        //
        //
        // var thiz = this;
        //
        fbBt.addClickEventListener(function () {
            // cc.log("LINK FAN PAGE");
            // if (!cc.sys.isNative) window.open("https://www.facebook.com/locclubchapcanhgiausang/");
            // else cc.sys.openURL("https://www.facebook.com/locclubchapcanhgiausang/");
            if (!cc.sys.isNative) window.open("https://www.facebook.com");
            else cc.sys.openURL("https://www.facebook.com");
        });
        //RE_LAYOUT_IPAD

        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {
            this.giftCodeBt.setPosition(280, -50);
            vongquayBt.setPosition(160, -50);
            clippingNode.setPosition(220, 250);
        }


    },
    arrDotEvent: [],
    eventActionChangeImage: function (items) {
        if (!this.eventLayer) {
            var node = new ccui.Widget();
            node.setContentSize(cc.size(300, 350));
            node.setPosition(this.clippingNode.getPosition());
            this.addChild(node);
            node.visible=false;
            this.eventLayer = node;
            this.eventLayer.setTouchEnabled(true);
            this.eventLayer.addTouchEventListener(this.touchEvent, this);
        }

        this.items = items;

        this.showEventWithIndex(0);

        if (this.arrDotEvent && this.arrDotEvent.length > 0) {
            for (var i2 = 0; i2 < this.arrDotEvent.length; i2++) {
                if (this.arrDotEvent) {
                    var dotEvent = this.arrDotEvent[i2];
                    dotEvent.removeFromParent();
                }
            }
        }
        for (var i = 0; i < this.items.length; i++) {
            var _length = this.items.length;
            var imgdot = new cc.Sprite(i === 0 ? "#gate_dot_active.png" : "#gate_dot_deactive.png");
            imgdot.setPosition(cc.p(this.clippingNode.x + (i - _length / 2) * imgdot.width, 95));
            if (cc.winSize.height / cc.winSize.width === 4 / 3
                || cc.winSize.height / cc.winSize.width === 3 / 4) {
                imgdot.y = 10;
            }
            imgdot.setName("iconInNode" + i);
            imgdot.retain();
            this.addChild(imgdot);
            this.arrDotEvent.push(imgdot);
        }

    },

    showEventWithIndex: function (index) {
        this.stopAllActions();
        var delay = new cc.DelayTime(3);
        var thiz = this;
        var count = this.items.length;
        this.currentItemEvent = this.items[0];

        var i = index;
        if (i < 1) {
            i = count;
        }
        var callFunc = new cc.CallFunc(function () {
            i = i % count;
            if (i === 0)
                thiz.currentItemIndex = count;
            else
                thiz.currentItemIndex = i;

            if (thiz.items.length > 0) {
                thiz.eventLayer.setTouchEnabled(true);
                var url = thiz.items[i].bannerUrl;
                thiz.currentItemEvent = thiz.items[i];

                for (var i1 = 0; i1 < count; i1++) {
                    var _name = "iconInNode" + i1;
                    var _dotEvent = thiz.getChildByName(_name);
                    if (_dotEvent) {
                        var _strImg = "res/Home/gate_dot_active.png";
                        if (i1 !== i)
                            _strImg = "res/Home/gate_dot_deactive.png";
                        _dotEvent.setTexture(_strImg);
                        _dotEvent.visible=false;
                    }
                }

                TextureDownloader.load(url, function (tex) {
                    cc.spriteFrameCache.addSpriteFrames(url, tex);
                    if (thiz.eventSprite) {
                        var eventSprite1 = thiz.eventSprite;
                        eventSprite1.removeFromParent();
                    }

                    var eventSprite = new cc.Sprite(tex);
                    eventSprite.setContentSize(328, 468);
                    // eventSprite.setScale(328 / eventSprite.width);
                    eventSprite.visible=false;
                    eventSprite.setScale(0.9);
                    eventSprite.retain();
                    thiz.clippingNode.addChild(eventSprite);
                    thiz.eventSprite = eventSprite;
                });
                i++;
            } else {
                thiz.eventLayer.setTouchEnabled(false);
            }
        });

        // rotate animation
        var action = new cc.RepeatForever(new cc.Sequence(callFunc, delay));
        this.runAction(action);
    },
    _compareEventTime: function (currentTime, eventEndTime, separator) {
        var currentEventTime = cc.Global.DateToString(new Date(currentTime));
        var currentTimeArr = Array();
        var eventEndTimeArr = Array();
        currentTimeArr = currentEventTime.split("/");
        eventEndTimeArr = eventEndTime.split(separator);
        var smallDt = currentTimeArr[0];
        var smallMt = currentTimeArr[1];
        var smallYr = currentTimeArr[2];
        var largeDt = eventEndTimeArr[2];
        var largeMt = eventEndTimeArr[1];
        var largeYr = eventEndTimeArr[0];

        var largeDate = largeDt.toString().replace("T", " ");


        if (smallYr > largeYr)
            return 0;
        else if (smallYr <= largeYr && smallMt > largeMt)
            return 0;
        else if (smallYr <= largeYr && smallMt === largeMt && smallDt > largeDt)
            return 0;
        else
            return 1;
    },
    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                if (sender === this.eventLayer) {
                    // cc.log("Touch Event");
                }
                this.startPos = sender.getPosition();
                this.touchPos = sender.getPosition();
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.touchPos = sender.getTouchMovePosition();
                break;

            case ccui.Widget.TOUCH_ENDED:

                if (sender === this.eventLayer) {
                    if (this.startPos.x > this.touchPos.x) {
                        this.currentItemIndex += 1;

                    } else {
                        this.currentItemIndex -= 1;
                    }
                    this.showEventWithIndex(this.currentItemIndex);
                    // this.openEventInWeb(this.items[this.currentItemIndex].eventUrl);
                    return;
                }

                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }

    },

    openEventInWeb: function (url) {
        if (!cc.sys.isNative)
            window.open(url, '_blank');
        else {
            cc.sys.openURL(url);
            // var dialog = new HomeEventDialog(url);
            // dialog.show();
        }
    },

    refreshView: function () {
        this.goldLabel.setString(cc.Global.NumberFormat1(PlayerMe.gold));
        this.nameLabel.setString(PlayerMe.username);
    },

    onEnter: function () {
        this._super();
        this.refreshView();
    }
});
