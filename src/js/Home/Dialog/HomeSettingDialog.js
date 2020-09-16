var HomeSettingDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();
        var bg = new cc.Sprite();
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

        this._initLabels();
        this._initGUIs();
    },
    _initLabels: function () {
        var title = MultiLanguage.createLabelTTFFont("SETTING_TITLE", cc.res.font.Myriad_Pro_Regular, 64);
        title.enableStroke(cc.color("#00d8ff"), 2);
        title.setPosition(0, 197);
        this.addChild(title);
    },
    _initGUIs: function () {
        var ls = cc.sys.localStorage;

        //Vibrate
        var stateVibrate = ls.getItem('KEY_VIBRATE') || 0;

        var btnVibrate = this._initItemButton("#home_dialog_setting_icon_vibrate.png", "VIBRATE", stateVibrate);
        btnVibrate.setPosition(-397, 106);
        this.stateVibrate = stateVibrate;
        //Sound
        var stateSound = ls.getItem('sound') || 0;

        var btnSound = this._initItemButton("#home_dialog_setting_icon_sound.png", "SOUND", stateSound);
        btnSound.setPosition(btnVibrate.x, btnVibrate.y - 80);
        this.stateSound = stateSound;

        //Notify
        var stateNotify = ls.getItem('KEY_NOTIFY') || 0;

        var btnNotify = this._initItemButton("#home_dialog_setting_icon_notifi.png", "NOTIFICATION", stateNotify);
        btnNotify.setPosition(btnSound.x, btnSound.y - 80);

        this.stateNotify = stateNotify;

        //Logout
        var btnLogout = new ccui.Button("home_dialog_setting_button_orange.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnLogout.setPosition(btnNotify.x, btnNotify.y - 80);
        this.addChild(btnLogout);

        var iconLogout = new cc.Sprite("#home_dialog_setting_icon_logout.png");
        iconLogout.setPosition(btnLogout.width / 2 - 105, btnNotify.height / 2);
        btnLogout.addChild(iconLogout);

        var labelLogout = MultiLanguage.createLabelTTFFont("LOGOUT", cc.res.font.Myriad_Pro_Regular, 25);
        labelLogout.setPosition(btnLogout.width / 2, btnLogout.height / 2 - 5);
        btnLogout.addChild(labelLogout);

        var labelState = MultiLanguage.createLabelTTFFont("CONNECTING", cc.res.font.Myriad_Pro_Bold, 25);
        labelState.setPosition(btnLogout.width + 100, btnLogout.height / 2 - 5);
        btnLogout.addChild(labelState);

        //Slider
        var percentSound = ls.getItem('VALUE_SOUND') || 0;
        cc.log("percentSound " + percentSound);

        var sldSound = new cc.ControlSlider("#home_dialog_setting_slider_bg.png", "#home_dialog_setting_slider_force.png", "");
        sldSound.setMaximumValue(100);
        sldSound.setMinimumValue(0);
        sldSound.setValue(percentSound);
        sldSound.setPosition(150, 30);
        sldSound.setEnabled(stateSound === 0);
        this.addChild(sldSound);

        var labelPercent = new cc.LabelTTF(percentSound + "%", cc.res.font.Myriad_Pro_Bold, 25);
        labelPercent.setPosition(sldSound.width + 45, sldSound.height / 2 - 10);
        sldSound.addChild(labelPercent);

        // sldSound.setOnChangeValueCallback(function (value) {
        //     percentSound = Math.floor(value);
        //     labelPercent.setString(percentSound + "%");
        //     ls.setItem('VALUE_SOUND', percentSound);
        // });


        //EVENT BUTTON
        btnVibrate.addClickEventListener(function () {
            // SoundPlayer.playSound("click-button", false);
            if (thiz.stateVibrate == 0)
                thiz.stateVibrate = 1;
            else thiz.stateVibrate = 0;

            ls.setItem('KEY_VIBRATE', thiz.stateVibrate);
            btnVibrate.loadTextureNormal((thiz.stateVibrate == 0) ? "home_dialog_setting_button_purple.png" : "home_dialog_setting_button_cyan.png", ccui.Widget.PLIST_TEXTURE)
            btnVibrate.label.setString((thiz.stateVibrate == 0) ? MultiLanguage.getTextByKey("ON") : MultiLanguage.getTextByKey("OFF"));
        });

        btnSound.addClickEventListener(function () {
            // SoundPlayer.playSound("click-button", false);
            if (thiz.stateSound === 0) {
                thiz.stateSound = 1;
                cc.Global.SetSetting("sound", 1);
                SoundPlayer.stopAllSound();
            }
            else {
                thiz.stateSound = 0;
                cc.Global.SetSetting("sound", 0);
                SoundPlayer.stopAllSound();
                SoundPlayer.playSound("app-music-final", true);
            }

            btnSound.loadTextureNormal((thiz.stateSound === 0) ? "home_dialog_setting_button_purple.png" : "home_dialog_setting_button_cyan.png", ccui.Widget.PLIST_TEXTURE)
            btnSound.label.setString((thiz.stateSound === 0) ? MultiLanguage.getTextByKey("ON") : MultiLanguage.getTextByKey("OFF"));
            sldSound.setEnabled(thiz.stateSound === 0);

            cc.Global.SetSetting("sound", thiz.stateSound);
        });

        btnNotify.addClickEventListener(function () {
            // SoundPlayer.playSound("click-button", false);
            if (thiz.stateNotify === 0)
                thiz.stateNotify = 1;
            else thiz.stateNotify = 0;
            ls.setItem('KEY_NOTIFY', thiz.stateNotify);
            btnNotify.loadTextureNormal((thiz.stateNotify === 0) ? "home_dialog_setting_button_purple.png" : "home_dialog_setting_button_cyan.png", ccui.Widget.PLIST_TEXTURE)
            btnNotify.label.setString((thiz.stateNotify === 0) ? MultiLanguage.getTextByKey("ON") : MultiLanguage.getTextByKey("OFF"));
        });

        var thiz = this;
        btnLogout.addClickEventListener(function () {
            // SoundPlayer.playSound("click-button", false);
            thiz.hide();
            if (cc.sys.isNative) {
                // KingIDSDK.getInstance().logout(true, thiz._logOutSuccessCallBack, thiz);
            }
        });

        //Languages
        var languages = ls.getItem('LANGUAGES') || "vi";

        var labelLang = MultiLanguage.createLabelTTFFont("LANGUAGE", cc.res.font.Myriad_Pro_Regular, 25);
        labelLang.setOpacity(194);
        labelLang.setPosition(110, -150);
        this.addChild(labelLang);

        var iconVi = new ccui.Button("home_dialog_flag_vi.png", "", "", ccui.Widget.PLIST_TEXTURE);
        iconVi.setPosition(240, -125);
        iconVi.setScale((languages === "vi") ? 1 : .6);
        this.addChild(iconVi);


        var iconEn = new ccui.Button("home_dialog_flag_en.png", "", "", ccui.Widget.PLIST_TEXTURE);
        iconEn.setPosition(370, -125);
        iconEn.setScale((languages === "vi") ? .6 : 1);
        this.addChild(iconEn);

        iconVi.addClickEventListener(function () {
            // SoundPlayer.playSound("click-button", false);
            ls.setItem('LANGUAGES', 'vi');
            iconVi.setScale(1);
            iconEn.setScale(.6);
            MultiLanguage._currentLanguage = "vi";
            GlobalEvent.getInstance().postEvent("changeLanguage");
        });

        iconEn.addClickEventListener(function () {
            // SoundPlayer.playSound("click-button", false);
            ls.setItem('LANGUAGES', 'en');
            iconVi.setScale(.6);
            iconEn.setScale(1);
            MultiLanguage._currentLanguage = "en";
            GlobalEvent.getInstance().postEvent("changeLanguage");
        });
    },
    _initItemButton: function (sprIcon, text, state) {
        var button = new ccui.Button((state === 0) ? "home_dialog_setting_button_purple.png" : "home_dialog_setting_button_cyan.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.addChild(button);

        var icon = new cc.Sprite(sprIcon);
        icon.setPosition(button.width / 2 - 100, button.height / 2);
        button.addChild(icon);

        var labelVibrate = MultiLanguage.createLabelTTFFont(text, cc.res.font.Myriad_Pro_Regular, 25);
        labelVibrate.setPosition(button.width / 2, button.height / 2 - 5);
        button.addChild(labelVibrate);

        var labelOnOff = MultiLanguage.createLabelTTFFont((state === 0) ? "ON" : "OFF", cc.res.font.Myriad_Pro_Bold, 25);
        labelOnOff.setPosition(button.width + 45, button.height / 2 - 5);
        button.addChild(labelOnOff);

        button.label = labelOnOff;

        return button;
    },
    _logOutSuccessCallBack: function () {
        cc.Global.isLogin = false;
        cc.sys.localStorage.setItem("accessToken", null);
        var home = cc.director.getRunningScene();
        if (home.doLogout){
            home.doLogout();
        }
        // KingIDSDK.getInstance().manualLogin();
    }
});