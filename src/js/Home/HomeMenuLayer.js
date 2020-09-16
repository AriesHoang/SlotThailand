var HomeMenuLayer = HomeBoderLayer.extend({
    ctor: function () {
        this._super();

        this.bg.setFlippedX(true);
        this.setAnchorPoint(cc.p(1.0, 0.0));
        this._showPosition = cc.p(cc.winSize.width, 0);
        this._hidePosition = cc.p(cc.winSize.width + this.width, 0);

        var settingIcon = new cc.Sprite("#btn_setting.png");
        settingIcon.scale = 0.8;
        settingIcon.x = 60;
        settingIcon.y = 660;
        this.addChild(settingIcon);

        var title = new cc.LabelTTF(MultiLanguage.getTextByKey("OPTIONS"), cc.res.font.Arial_Bold, 30, cc.p(300, 200), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        title.x = 200;
        title.y = 660;
        this.addChild(title);
        this._initItems();


        var logoutBt = new ccui.Button("home_dialog_btn_logout.png", "", "", ccui.Widget.PLIST_TEXTURE);
        logoutBt.scale = 0.68;
        logoutBt.setPosition(180, 250);
        this.addChild(logoutBt);
        this.logoutBt = logoutBt;

    },
    _initItems: function () {
        // var ls = cc.sys.localStorage;
        // var stateSound = ls.getItem("sound");
        // this.stateSound = stateSound;

        var thiz = this;
        var itemMusic = this._initItemInNode("#icon_circle.png", "Nhạc Nền");
        itemMusic.setAnchorPoint(cc.p(0, 0));
        itemMusic.setPosition(40, 560);
        itemMusic.setTouchEnabled(true);
        itemMusic.visible = false;
        this.addChild(itemMusic);

        itemMusic.addClickEventListener(function () {
            cc.log("Bạn bè");
            thiz.hide();
        });


        var itemHistory = this._initItemInNode("#icon_lichsugiaodich.png", MultiLanguage.getTextByKey("TRANSACTION_HISTORY"));
        itemHistory.setAnchorPoint(cc.p(0, 0));
        itemHistory.setPosition(40, 560);
        itemHistory.setTouchEnabled(true);
        // itemHistory.visible = false;
        this.addChild(itemHistory);

        itemHistory.addClickEventListener(function () {
            if (cc.Global.isLogin) {
                var dialog = new HomeHistoryDialog();
                dialog.show();
                thiz.hide();
            } else {
                var popup = new HomeNotifyPopup();
                popup.showNotification(MultiLanguage.getTextByKey("MUST_LOGIN"));
            }
        });

        var itemSecure = this._initItemInNode("#icon_baomattaikhoan.png", "Bảo mật tài khoản");
        itemSecure.setAnchorPoint(cc.p(0, 0));
        itemSecure.setPosition(itemHistory.x, itemHistory.y - 60);
        itemSecure.setTouchEnabled(true);
        itemSecure.visible = false;
        this.addChild(itemSecure);

        itemSecure.addClickEventListener(function () {
            if (cc.Global.isLogin) {
                cc.log("_showSecurityDialog");
                var dialog = new HomeSecurityDialog();
                dialog.show();
                thiz.hide();
            } else {
                var popup = new HomeNotifyPopup();
                popup.showNotification(MultiLanguage.getTextByKey("MUST_LOGIN"));
            }
        });

        var itemTerm = this._initItemInNode("#icon_dieukhoan.png", MultiLanguage.getTextByKey("TERM_CONDITION"));
        itemTerm.setAnchorPoint(cc.p(0, 0));
        // itemTerm.setPosition(itemSecure.x, itemSecure.y - 60);
        itemTerm.setPosition(itemHistory.x, itemHistory.y - 60);
        // itemTerm.setPosition(40, 560);
        itemTerm.setTouchEnabled(true);
        this.addChild(itemTerm);

        itemTerm.addClickEventListener(function () {
            var dialog = new HomePolicyDialog();
            dialog.show();
            thiz.hide();
        });

        var _imgSound = "#icon_circle_off.png";
        var _textSound = MultiLanguage.getTextByKey("SOUND_ON");
        if (cc.Global.GetSetting("sound", 0) === 1) {
            _imgSound = "#icon_circle.png";
            _textSound = MultiLanguage.getTextByKey("SOUND_OFF");
        }

        var itemSound = this._initItemInNode(_imgSound, _textSound);
        itemSound.setAnchorPoint(cc.p(0, 0));
        itemSound.setPosition(itemHistory.x, itemTerm.y - 60);
        itemSound.setTouchEnabled(true);
        this.addChild(itemSound);

        itemSound.addClickEventListener(function () {
            // cc.log("sound: " + cc.Global.GetSetting("sound", 0));
            // SoundPlayer.playSound("click-button", false);
            if (cc.Global.GetSetting("sound", 0) === 0) {
                thiz.stateSound = 1;
                cc.Global.SetSetting("sound", 1);
                // SoundPlayer.stopAllSound();
                itemSound.getChildByName("iconInNode").setSpriteFrame("icon_circle.png");
                itemSound.getChildByName("labelInNode").setString(MultiLanguage.getTextByKey("SOUND_OFF"));
            }
            else {
                thiz.stateSound = 0;
                cc.Global.SetSetting("sound", 0);
                // SoundPlayer.stopAllSound();
                // SoundPlayer.playSound("app-music-final", true);
                itemSound.getChildByName("iconInNode").setSpriteFrame("icon_circle_off.png");
                itemSound.getChildByName("labelInNode").setString(MultiLanguage.getTextByKey("SOUND_ON"));
            }
            // cc.log("sound1111111: " + cc.Global.GetSetting("sound", 0));
            // itemSound.getChildByName("iconInNode").setSpriteFrame((thiz.stateSound === 0) ? "icon_circle.png" : "icon_circle_off.png");
            // cc.Global.SetSetting("sound", thiz.stateSound);
        });
    },
    _initItemInNode: function (sprite, text) {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(350, 60));
        var opacity = Math.floor(255);

        var icon = new cc.Sprite(sprite);
        icon.setAnchorPoint(cc.p(0, 0));
        icon.setScale(.68);
        icon.setName("iconInNode");
        if (sprite === "#icon_lichsugiaodich.png") icon.x -= 11;
        icon.setOpacity(opacity);
        node.addChild(icon);

        var label = new cc.LabelTTF(text, cc.res.font.Arial_Bold, 22);
        label.setAnchorPoint(cc.p(0, 0));
        label.setColor(cc.color("#ffffff"));
        label.setName("labelInNode");
        label.setPosition(icon.width + 20, 0);
        if (sprite === "#icon_lichsugiaodich.png") label.x -= 20;
        if (sprite === "#icon_dieukhoan.png") label.x -= 8;
        node.addChild(label);

        var itemLine = new cc.Sprite();
        itemLine.setAnchorPoint(cc.p(0, 0));
        itemLine.setPosition(icon.x, icon.y - 20);
        itemLine.setScale(.8);
        itemLine.setOpacity(opacity);
        // node.addChild(itemLine);

        return node;
    },
    _logOutSuccessCallBack: function () {
        var home = cc.director.getRunningScene();
        cc.Global.isLogin = false;
        if (home.doLogout) {
            home.doLogout();
        }
    }
});
