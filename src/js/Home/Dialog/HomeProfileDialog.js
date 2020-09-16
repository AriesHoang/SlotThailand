var HomeProfileDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite();
        bg.visible = false;
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);
        this._initController();


        this._initMainView();
        this.placeName = "";

        // this._initAvatar();
        // this._controller.getDataProfile();
        this._controller.sendGetUserProfile();
        // this.setLoading(true);
    },
    _initController: function () {
        this._controller = new HomeProfileController(this);
    },
    _showViewIndex: function (index) {
        if (index === 0) { //InfoView
            this.itemMainInfo.getChildByName("NameNode").setColor(cc.color("#fde612"));
            this.itemMainInfo.getChildByName("NameNode").enableStroke(cc.color("#9c4a08"), 2);
            this.itemMainInfo.getChildByName("iconLight").visible = true;
            this.itemGiftcode.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemGiftcode.getChildByName("NameNode").enableStroke(cc.color(255, 255, 255), 0);
            this.itemGiftcode.getChildByName("iconLight").visible = false;
            this.itemChangePass.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemChangePass.getChildByName("NameNode").enableStroke(cc.color(255, 255, 255), 0);
            this.itemChangePass.getChildByName("iconLight").visible = false;

            this.infoView.visible = true;
            this.giftCodeView.visible = false;
            this.changePassView.visible = false;
        } else if (index === 1) {//GiftCode View
            this.itemMainInfo.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemMainInfo.getChildByName("NameNode").enableStroke(cc.color(255, 255, 255), 0);
            this.itemMainInfo.getChildByName("iconLight").visible = false;
            this.itemGiftcode.getChildByName("NameNode").setColor(cc.color("#fde612"));
            this.itemGiftcode.getChildByName("NameNode").enableStroke(cc.color("#9c4a08"), 2);
            this.itemGiftcode.getChildByName("iconLight").visible = true;
            this.itemChangePass.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemChangePass.getChildByName("NameNode").enableStroke(cc.color(255, 255, 255), 0);
            this.itemChangePass.getChildByName("iconLight").visible = false;

            // this._showGiftCodeDialog();
            this.getCaptchaGiftCode();
            this.infoView.visible = false;
            this.giftCodeView.visible = true;
            this.changePassView.visible = false;
        } else if (index === 2) { //ChangePass View
            this.itemMainInfo.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemMainInfo.getChildByName("NameNode").enableStroke(cc.color(255, 255, 255), 0);
            this.itemMainInfo.getChildByName("iconLight").visible = false;
            this.itemGiftcode.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemGiftcode.getChildByName("NameNode").enableStroke(cc.color(255, 255, 255), 0);
            this.itemGiftcode.getChildByName("iconLight").visible = false;
            this.itemChangePass.getChildByName("NameNode").setColor(cc.color("#fde612"));
            this.itemChangePass.getChildByName("NameNode").enableStroke(cc.color("#9c4a08"), 2);
            this.itemChangePass.getChildByName("iconLight").visible = true;

            this.infoView.visible = false;
            this.giftCodeView.visible = false;
            this.changePassView.visible = true;
        }

    },
    _initMainView: function () {
        this.mainView = new ccui.Widget();
        this.mainView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
        this.addChild(this.mainView);

        this._initInfoView();
        this._initGiftCodeView();
        this._initChangePassView();

        //    Item GIFT CODE
        var itemGiftcode = this._initItemInNode(0, "GIFTCODE");
        // itemGiftcode.setAnchorPoint(cc.p(0, 0));
        itemGiftcode.setPosition(this.mainView.width / 2, this.mainView.height - itemGiftcode.height / 2);
        itemGiftcode.setTouchEnabled(true);
        itemGiftcode.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
        itemGiftcode.getChildByName("iconLight").visible = false;
        this.mainView.addChild(itemGiftcode);
        this.itemGiftcode = itemGiftcode;
        this.itemGiftcode.visible = false;

        //    Item Thong Tin
        var itemMainInfo = this._initItemInNode(0, "THÔNG TIN");
        // itemMainInfo.setAnchorPoint(cc.p(0, 0));
        itemMainInfo.setPosition(itemGiftcode.x - itemMainInfo.width * 0.9, itemGiftcode.y);
        itemMainInfo.setTouchEnabled(true);
        this.mainView.addChild(itemMainInfo);
        this.itemMainInfo = itemMainInfo;

        //    Item GIFT
        var itemChangePass = this._initItemInNode(0, "ĐỔI MẬT KHẨU");
        // itemChangePass.setAnchorPoint(cc.p(0, 0));
        itemChangePass.setPosition(itemGiftcode.x + itemMainInfo.width, itemGiftcode.y);
        itemChangePass.setTouchEnabled(true);
        itemChangePass.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
        itemChangePass.getChildByName("iconLight").visible = false;
        this.mainView.addChild(itemChangePass);
        this.itemChangePass = itemChangePass;
        this.itemChangePass.visible = false;


        var thiz = this;

        itemMainInfo.addClickEventListener(function () {
            thiz._showViewIndex(0);
        });

        itemGiftcode.addClickEventListener(function () {
            thiz._showViewIndex(1);
            thiz.lb_info1.setString("");
        });


        itemChangePass.addClickEventListener(function () {
            thiz.lb_info.setString("");
            if (!cc.Global.LoginByOpenID) {
                thiz._showViewIndex(2);
                thiz.getCaptchaChangePass();
            } else {
                var dialog = new HomeNotifyPopup();
                dialog.showNotification("Không hỗ trợ chức năng này khi đăng nhập bằng FB hoặc GG");
            }
        });


        //    RELAYOUT FOR IPAD
        if (cc.winSize.height / cc.winSize.width === 4 / 3 ||
            cc.winSize.height / cc.winSize.width === 3 / 4) {
            this.infoView.setScale(cc.winSize.screenScale);
            this.giftCodeView.setScale(cc.winSize.screenScale);
            this.changePassView.setScale(cc.winSize.screenScale);
        }

    },
    //================================================================================
    //================================================================================
    //================================CHANGEPASS VIEW=================================
    //================================================================================
    //================================================================================
    _initChangePassView: function () {
        this.changePassView = new ccui.Widget();
        this.changePassView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height * 0.8));
        this.changePassView.y = -cc.winSize.height / 2 + this.changePassView.height / 2 + 30;
        this.addChild(this.changePassView);
        // var colorLayer = new cc.LayerColor(cc.color(0, 100, 0, 100), this.changePassView.width, this.changePassView.height);
        this.changePassView.visible = false;
        // this.changePassView.addChild(colorLayer);


        var _fontSize = 35;
        // var _lb_x = this.changePassView.width/2 - 250;
        // var _lb_y = this.changePassView.height/2 + 200;
        var _spacing = 100;

        //===============CURRENT PASS
        var currPassBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        currPassBg.setPreferredSize(cc.size(600, 90));
        currPassBg.setPosition(this.changePassView.width / 2, this.changePassView.height / 2 + 230);
        this.changePassView.addChild(currPassBg);

        var currpassTF = new MultiLanguage.createNewUITextField("CURRENT_PASS_TYPE_HERE", cc.size(600, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        currpassTF.setTextColor(cc.color(255, 255, 255));
        currpassTF.setPlaceHolderColor(cc.color(145, 143, 144));

        currpassTF.setPosition(currPassBg.x, currPassBg.y);
        currpassTF.setPasswordEnable(true);
        this.changePassView.addChild(currpassTF);
        this.currpassTF = currpassTF;

        //===============NEW PASS
        var newPassBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        newPassBg.setPreferredSize(cc.size(600, 90));
        newPassBg.setPosition(currPassBg.x, currPassBg.y - _spacing);
        this.changePassView.addChild(newPassBg);

        var newpassTF = new MultiLanguage.createNewUITextField("NEW_PASS_TYPE_HERE", cc.size(600, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        newpassTF.setTextColor(cc.color(255, 255, 255));
        newpassTF.setPlaceHolderColor(cc.color(145, 143, 144));
        newpassTF.setPasswordEnable(true);
        newpassTF.setPosition(newPassBg.x, newPassBg.y);
        this.changePassView.addChild(newpassTF);
        this.newpassTF = newpassTF;

        //===============RE NEW PASS
        var reNewPassBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        reNewPassBg.setPreferredSize(cc.size(600, 90));
        reNewPassBg.setPosition(newPassBg.x, newPassBg.y - _spacing);
        this.changePassView.addChild(reNewPassBg);

        var rNewpassTF = new MultiLanguage.createNewUITextField("RE_NEW_PASS_TYPE_HERE", cc.size(600, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        rNewpassTF.setTextColor(cc.color(255, 255, 255));
        rNewpassTF.setPlaceHolderColor(cc.color(145, 143, 144));
        rNewpassTF.setPasswordEnable(true);
        rNewpassTF.setPosition(reNewPassBg.x, reNewPassBg.y);
        this.changePassView.addChild(rNewpassTF);
        this.rNewpassTF = rNewpassTF;

        //===============CAPTCHA
        var captchaBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        captchaBg.setPreferredSize(cc.size(250, 90));
        captchaBg.setPosition(reNewPassBg.x - reNewPassBg.width / 2 + captchaBg.width / 2, reNewPassBg.y - _spacing);
        this.changePassView.addChild(captchaBg);

        var captchaTF = new MultiLanguage.createNewUITextField("CAPTCHA_TYPE_HERE", cc.size(250, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        captchaTF.setTextColor(cc.color(255, 255, 255));
        captchaTF.setPlaceHolderColor(cc.color(145, 143, 144));

        captchaTF.setPosition(captchaBg.x, captchaBg.y);
        this.changePassView.addChild(captchaTF);
        this.captchaPassTF = captchaTF;

        var btnRefreshCaptchaChangePass = new ccui.Button("icon_refesh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnRefreshCaptchaChangePass.scale = 0.68;
        btnRefreshCaptchaChangePass.setName("btnRefeshChangePass");
        btnRefreshCaptchaChangePass.setPosition(captchaTF.x + captchaTF.width + 100, captchaBg.y);
        this.changePassView.addChild(btnRefreshCaptchaChangePass);
        var thizz = this;
        btnRefreshCaptchaChangePass.addClickEventListener(function () {
            thizz.getCaptchaChangePass();
        });

        //=============== INFO
        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 28);
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(this.changePassView.width / 2, captchaBg.y - _spacing + 5);
        this.changePassView.addChild(lb_info);
        this.lb_info = lb_info;
        //=============== BUTTON GIFT CODE

        var changePassBtn = this._initItemInNode(2, "ĐỔI MẬT KHẨU MỚI");
        // changePassBtn.setContentSize(cc.size(400, 100));
        // reNewPassBg.setAnchorPoint(cc.p(0, 0));
        changePassBtn.setPosition(this.changePassView.width / 2, lb_info.y - _spacing + 10);
        changePassBtn.setTouchEnabled(true);
        changePassBtn.getChildByName("NameNode").setColor(cc.color(0, 0, 0));
        changePassBtn.getChildByName("iconLight").visible = false;
        this.changePassView.addChild(changePassBtn);

        changePassBtn.addClickEventListener(function () {
            changePassBtn.setScale(1.05);
            setTimeout(function () {
                changePassBtn.setScale(1);
            });

            var oldPass = currpassTF.getText();
            var newPass = newpassTF.getText();
            var reNewPass = rNewpassTF.getText();
            var captchaText = captchaTF.getText();
            cc.Global.sendVerifyCaptcha(cc.Global.captchaData.token, captchaText, function () {
                if (thizz.checkBeforeSubmitChangePass(oldPass, newPass, reNewPass, captchaText)) {
                    thizz._controller.sendChangePass(oldPass, newPass);
                    PlayerMe.password = newPass;
                } else {
                    thizz.setLoading(false);
                }
            });
        });
    },

    _onGetChangePassResponse: function (result) {
        var code = result["errorCode"];
        var message = "";
        if (code === 0) {
            this.lb_info.setString(MultiLanguage.getTextByKey("Đổi mật khẩu thành công."));
            cc.Global.setSavePassword(PlayerMe.password);
        } else {
            switch (code) {
                case -1401:
                    message = "Tài khoản không tồn tại.";
                    break;
                case -1402:
                    message = "Sai mật khẩu cũ.";
                    break;
                case -1403:
                    message = "Mật khẩu mới không đúng.";
                    break;
                case -1404:
                    message = "Hệ thống đang xảy bị lỗi.";
                    break;
            }
            this.getCaptchaChangePass();
            this.lb_info.setString(MultiLanguage.getTextByKey(message));
        }
        this.clearChangePassText();
        this.setLoading(false);
    },
    checkBeforeSubmitChangePass: function (oldPass, newPass, reNewPass, captcha) {
        var validation = {
            isNotEmpty: function (str) {
                var pattern = /\S+/;
                return pattern.test(str);  // returns a boolean
            },
            isNumber: function (str) {
                var pattern = /^\d+$/;
                return pattern.test(str);  // returns a boolean
            }
        };
        var thiz = this;
        if (!validation.isNotEmpty(oldPass)) {
            thiz.lb_info.setString(MultiLanguage.getTextByKey("Bạn chưa nhập mật khẩu hiện tại!!!"));
            return false;
        } else if (!validation.isNotEmpty(newPass)) {
            thiz.lb_info.setString(MultiLanguage.getTextByKey("Bạn chưa nhập mật khẩu mới!!!"));
            return false;
        } else if (!validation.isNotEmpty(reNewPass)) {
            thiz.lb_info.setString(MultiLanguage.getTextByKey("Bạn chưa nhập lại mật khẩu mới!!!"));
            return false;
        } else if (oldPass === newPass) {
            thiz.lb_info.setString(MultiLanguage.getTextByKey("Mật khẩu mới không được trùng mật khẩu cũ!!!"));
            return false;
        } else if (newPass !== reNewPass) {
            thiz.lb_info.setString(MultiLanguage.getTextByKey("Mật khẩu mới không giống nhau!!!"));
            return false;
        } else if (!validation.isNotEmpty(captcha)) {
            thiz.lb_info.setString(MultiLanguage.getTextByKey("Bạn chưa nhập mã captcha!!!"));
            return false;
        } else if (cc.Global.isVerify === false) {
            thiz.lb_info.setString(MultiLanguage.getTextByKey("Mã captcha không đúng!!!"));
            thiz.captchaPassTF.setText("");
            thiz.getCaptchaGiftCode();
            return false;
        }
        return true;
    },
    clearChangePassText: function () {
        this.currpassTF.setText("");
        this.newpassTF.setText("");
        this.rNewpassTF.setText("");
        this.captchaPassTF.setText("");
    },
    ivtTime2: -1,
    getCaptchaChangePass: function () {
        cc.Global.bGetCaptcha = false;
        cc.Global.getUrlCaptcha();
        clearInterval(this.ivtTime2);
        if (this.changePassView.getChildByName("sprCaptcha"))
            this.changePassView.getChildByName("sprCaptcha").removeFromParent();
        var thiz = this;
        this.ivtTime2 = setInterval(function () {
            if (cc.Global.bGetCaptcha) {
                var url = cc.Global.captchaData.urlCaptcha;
                // cc.textureCache.addImageAsync(url, function (texture) {
                //     if (texture instanceof cc.Texture2D) {
                //         cc.log(texture);
                //         cc.log("Remote texture loaded for user_id: ");
                //         var sprite = new cc.Sprite(texture);
                //         sprite.setName("sprCaptcha");
                //         sprite.x = thiz.captchaPassTF.x + 220;
                //         sprite.y = thiz.captchaPassTF.y;
                //         sprite.scale = 60 / sprite.height;
                //         thiz.changePassView.addChild(sprite);
                //     }
                //     else {
                //         cc.log("Fail to load remote texture");
                //     }
                // }, this);
                TextureDownloader.load(url, function (tex) {
                    cc.spriteFrameCache.addSpriteFrames(url, tex);

                    var sprite = new cc.Sprite(tex);
                    sprite.setName("sprCaptcha");
                    sprite.x = thiz.captchaPassTF.x + 220;
                    sprite.y = thiz.captchaPassTF.y;
                    sprite.scale = 60 / sprite.height;
                    thiz.changePassView.addChild(sprite);
                });

                clearInterval(thiz.ivtTime2);
            }
        }, 100);
    },
    //================================================================================
    //================================================================================
    //================================GIFTCODE VIEW===================================
    //================================================================================
    //================================================================================
    _initGiftCodeView: function () {
        this.giftCodeView = new ccui.Widget();
        this.giftCodeView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height * 0.8));
        this.giftCodeView.y = -cc.winSize.height / 2 + this.giftCodeView.height / 2 + 30;
        this.addChild(this.giftCodeView);
        // var colorLayer = new cc.LayerColor(cc.color(0, 100, 0, 100), this.giftCodeView.width, this.giftCodeView.height);
        this.giftCodeView.visible = false;
        // this.giftCodeView.addChild(colorLayer);


        var _fontSize = 35;
        // var _lb_x = this.giftCodeView.width/2 - 250;
        // var _lb_y = this.giftCodeView.height/2 + 200;
        var _spacing = 100;

        var lb_giftcode = MultiLanguage.createLabelTTFFont("Nhập Giftcode để nhận thưởng", cc.res.font.Myriad_Pro_Regular, _fontSize);
        // lb_giftcode.setAnchorPoint(cc.p(0, 0.5));
        lb_giftcode.setPosition(this.giftCodeView.width / 2, this.giftCodeView.height / 2 + 240);
        this.giftCodeView.addChild(lb_giftcode);


        //===============GIFTCODE
        var textFieldBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        textFieldBg.setPreferredSize(cc.size(600, 90));
        textFieldBg.setPosition(lb_giftcode.x, lb_giftcode.y - _spacing);
        this.giftCodeView.addChild(textFieldBg);

        var giftCodeTF = new MultiLanguage.createNewUITextField("GIFTCODE_TYPE_HERE", cc.size(600, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        giftCodeTF.setTextColor(cc.color(255, 255, 255));
        giftCodeTF.setPlaceHolderColor(cc.color(145, 143, 144));

        giftCodeTF.setPosition(textFieldBg.x, textFieldBg.y);
        this.giftCodeView.addChild(giftCodeTF);
        this.giftCodeTF = giftCodeTF;


        //===============CAPTCHA
        var captchaBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        captchaBg.setPreferredSize(cc.size(250, 90));
        captchaBg.setPosition(textFieldBg.x - textFieldBg.width / 2 + captchaBg.width / 2, textFieldBg.y - _spacing);
        this.giftCodeView.addChild(captchaBg);

        var captchaTF = new MultiLanguage.createNewUITextField("CAPTCHA_TYPE_HERE", cc.size(250, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        captchaTF.setTextColor(cc.color(255, 255, 255));
        captchaTF.setPlaceHolderColor(cc.color(145, 143, 144));

        captchaTF.setPosition(captchaBg.x, captchaBg.y);
        this.giftCodeView.addChild(captchaTF);
        this.captchaGiftcodeTF = captchaTF;

        var btnRefreshCaptchaGC = new ccui.Button("icon_refesh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnRefreshCaptchaGC.scale = 0.68;
        btnRefreshCaptchaGC.setName("btnRefeshNapTien");
        // btnRefreshCaptchaGC.setZoomScale(1.5);
        btnRefreshCaptchaGC.setPosition(captchaTF.x + captchaTF.width + 100, captchaBg.y);
        this.giftCodeView.addChild(btnRefreshCaptchaGC);

        btnRefreshCaptchaGC.addClickEventListener(function () {
            thiz.getCaptchaGiftCode();
        });

        //=============== INFO
        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 28);
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(this.giftCodeView.width / 2, captchaBg.y - _spacing);
        this.giftCodeView.addChild(lb_info);
        this.lb_info1 = lb_info;
        //=============== BUTTON GIFT CODE

        var nhanthuongBtn = this._initItemInNode(2, "NHẬN THƯỞNG");
        // baoMatBtn.setAnchorPoint(cc.p(0, 0));
        nhanthuongBtn.setPosition(this.giftCodeView.width / 2, lb_info.y - _spacing);
        nhanthuongBtn.setTouchEnabled(true);
        nhanthuongBtn.getChildByName("NameNode").setColor(cc.color(0, 0, 0));
        nhanthuongBtn.getChildByName("iconLight").visible = false;
        this.giftCodeView.addChild(nhanthuongBtn);

        var thiz = this;
        nhanthuongBtn.addClickEventListener(function () {
            // thiz.setLoading(true);
            nhanthuongBtn.setScale(1.05);
            setTimeout(function () {
                nhanthuongBtn.setScale(1);
            });
            thiz.nhanThuongBtnHandler();
        });

    },
    nhanThuongBtnHandler: function () {
        var giftCodeText = this.giftCodeTF.getText();
        var captchaText = this.captchaGiftcodeTF.getText();
        var thiz = this;
        cc.Global.sendVerifyCaptcha(cc.Global.captchaData.token, captchaText, function () {
            if (thiz.checkBeforeSubmitGC(giftCodeText, captchaText)) {
                thiz._controller.sendGiftCode(giftCodeText);
            } else {
                thiz.setLoading(false);
            }
        });
    },

    checkBeforeSubmitGC: function (giftCode, captcha) {

        var validation = {
            isNotEmpty: function (str) {
                var pattern = /\S+/;
                return pattern.test(str);  // returns a boolean
            },
            isNumber: function (str) {
                var pattern = /^\d+$/;
                return pattern.test(str);  // returns a boolean
            }
        };
        var thiz = this;
        if (!validation.isNotEmpty(giftCode)) {
            thiz.lb_info1.setString(MultiLanguage.getTextByKey("Bạn chưa nhập mã giftcode!!!"));
            return false;
        } else if (!validation.isNotEmpty(captcha)) {
            thiz.lb_info1.setString(MultiLanguage.getTextByKey("Bạn chưa nhập mã captcha!!!"));
            return false;
        } else if (cc.Global.isVerify === false) {
            thiz.lb_info1.setString(MultiLanguage.getTextByKey("Mã captcha không đúng!!!"));
            thiz.captchaGiftcodeTF.setText(MultiLanguage.getTextByKey(""));
            thiz.getCaptchaGiftCode();
            return false;
        }
        return true;
    },
    _getGiftCodeCallback: function (result) {
        var code = result["errorCode"];
        var mess = "";
        var coin = result["Coin"];
        var amount = result["Amount"];
        var eventName = result["eventName"];

        var thiz = this;
        if (code === 0) {
            var dialog = new HomeNotifyPopup();
            dialog.showNotification(MultiLanguage.getTextByKey("Chúc mừng bạn đã đổi GiftCode " + cc.Global.NumberFormat1(amount) + " thành công. Khi tham gia " + eventName));
            // PlayerMe.gold = coin;
            GlobalEvent.getInstance().postEvent("assetChange", coin);
            setTimeout(function () {
                thiz.giftCodeTF.setText("");
                thiz.giftCodeTF.setTextColor(cc.color("#000000"));
                thiz.captchaGiftcodeTF.setText("");
            }, 2500);
        } else {
            switch (code) {
                case -2301:
                    mess = "Tài khoản không tồn tại.";
                    break;
                case -2302:
                    mess = "Sai mã giftcode.";
                    break;
                case -2303:
                    mess = "Mã đã được sử dụng.";
                    break;
                case -2304:
                    mess = "Giftcode không hợp lệ.";
                    break;
            }
            thiz.lb_info1.setString(MultiLanguage.getTextByKey(mess));
            thiz.getCaptchaGiftCode();
        }
        this.clearGiftCodeText();
        this.setLoading(false);
    },
    ivtTime1: -1,
    getCaptchaGiftCode: function () {
        cc.Global.bGetCaptcha = false;
        cc.Global.getUrlCaptcha();
        clearInterval(this.ivtTime1);
        if (this.giftCodeView.getChildByName("sprCaptcha"))
            this.giftCodeView.getChildByName("sprCaptcha").removeFromParent();
        var thiz = this;
        this.ivtTime1 = setInterval(function () {
            if (cc.Global.bGetCaptcha) {
                var url = cc.Global.captchaData.urlCaptcha;
                TextureDownloader.load(url, function (tex) {
                    cc.spriteFrameCache.addSpriteFrames(url, tex);

                    var sprite = new cc.Sprite(tex);
                    sprite.setName("sprCaptcha");
                    sprite.x = thiz.captchaGiftcodeTF.x + 220;
                    sprite.y = thiz.captchaGiftcodeTF.y;
                    sprite.scale = 60 / sprite.height;
                    thiz.giftCodeView.addChild(sprite);
                });
                clearInterval(thiz.ivtTime1);
            }
        }, 100);
    },

    clearGiftCodeText: function () {
        this.giftCodeTF.setText("");
        this.captchaGiftcodeTF.setText("");
    },

    //================================================================================
    //================================================================================
    //==================================INFO VIEW=====================================
    //================================================================================
    //================================================================================
    _initInfoView: function () {
        this.infoView = new ccui.Widget();
        this.infoView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height * 0.8));
        this.infoView.y = -cc.winSize.height / 2 + this.infoView.height / 2 + 30;
        this.addChild(this.infoView);
        // var colorLayer = new cc.LayerColor(cc.color(0, 0, 0, 100), this.infoView.width, this.infoView.height);
        // this.infoView.addChild(colorLayer);
        //    avatar
        this._initAvatar();

        var line1 = new cc.Sprite("#seperate_line_baomat.png");
        // line1.setName("iconLight");
        line1.scaleX = 1.5;
        line1.scaleY = 2;
        line1.setPosition(this.infoView.width / 2 - 300, this.infoView.height / 2);
        this.infoView.addChild(line1);

        var line2 = new cc.Sprite("#seperate_line_baomat.png");
        // line1.setName("iconLight");
        line2.scaleX = 1.5;
        line2.scaleY = 2;
        line2.setPosition(this.infoView.width / 2 + 300, this.infoView.height / 2);
        this.infoView.addChild(line2);

        //===============================================
        //===================INFO ZONE===================
        //===============================================
        var _fontSize = 30;
        var _lb_x = this.infoView.width / 2 - 250;
        var _lb_y = this.infoView.height / 2 + 200;
        var _spacing = 60;

        // var lb_id = MultiLanguage.createLabelTTFFont("ID", cc.res.font.Myriad_Pro_Regular, _fontSize);
        // lb_id.setAnchorPoint(cc.p(0, 0.5));
        // lb_id.setPosition(_lb_x, _lb_y);
        // this.infoView.addChild(lb_id);

        var lb_username = MultiLanguage.createLabelTTFFont("Tên Đăng Nhập", cc.res.font.Myriad_Pro_Bold, _fontSize);
        lb_username.setAnchorPoint(cc.p(0, 0.5));
        lb_username.setPosition(_lb_x, _lb_y - _spacing);
        // lb_username.setPosition(_lb_x, _lb_y);
        this.infoView.addChild(lb_username);

        var lb_money = MultiLanguage.createLabelTTFFont("Số Tiền", cc.res.font.Myriad_Pro_Bold, _fontSize);
        lb_money.setAnchorPoint(cc.p(0, 0.5));
        lb_money.setPosition(_lb_x, _lb_y - _spacing * 2);
        this.infoView.addChild(lb_money);

        // var lb_email = MultiLanguage.createLabelTTFFont("Email", cc.res.font.Myriad_Pro_Regular, _fontSize);
        // lb_email.setAnchorPoint(cc.p(0, 0.5));
        // lb_email.setPosition(_lb_x, _lb_y - _spacing * 3);
        // this.infoView.addChild(lb_email);

        var lb_mobile = MultiLanguage.createLabelTTFFont("Số Điện Thoại", cc.res.font.Myriad_Pro_Bold, _fontSize);
        lb_mobile.setAnchorPoint(cc.p(0, 0.5));
        lb_mobile.setPosition(_lb_x, _lb_y - _spacing * 3);
        lb_mobile.visible = false;
        this.infoView.addChild(lb_mobile);

        var _txt_x = this.infoView.width / 2;

        // var id = new cc.LabelTTF(": " + PlayerMe.userId || "1234567", cc.res.font.Myriad_Pro_Bold, _fontSize);
        // id.setAnchorPoint(cc.p(0, 0.5));
        // id.setPosition(_txt_x, _lb_y);
        // this.infoView.addChild(id);

        var fullName = new cc.LabelTTF(": username", cc.res.font.Myriad_Pro_Bold, _fontSize);
        fullName.setString(": " + PlayerMe.username || "username");
        fullName.setAnchorPoint(cc.p(0, 0.5));
        fullName.setPosition(_txt_x, _lb_y - _spacing);
        this.fullName = fullName;
        // fullName.setPosition(_txt_x, _lb_y);
        this.infoView.addChild(fullName);

        console.log(typeof PlayerMe.gold);
        console.log(cc.Global.NumberFormat1(PlayerMe.gold));
        var coinLabel = new cc.LabelTTF(": ", cc.res.font.Myriad_Pro_Bold, _fontSize);
        coinLabel.setString(": " + cc.Global.NumberFormat1(PlayerMe.gold));
        coinLabel.setAnchorPoint(cc.p(0, 0.5));
        coinLabel.setPosition(_txt_x, _lb_y - _spacing * 2);
        this.userGold = coinLabel;
        // coinLabel.setFontFillColor(cc.color("#fff000"));
        this.infoView.addChild(coinLabel);
        this.coinLabel = coinLabel;

        // var email = new cc.LabelTTF(": " + PlayerMe.email || "", cc.res.font.Myriad_Pro_Bold, _fontSize);
        // email.setAnchorPoint(cc.p(0, 0.5));
        // email.setPosition(_txt_x, _lb_y - _spacing * 3);
        // this.infoView.addChild(email);

        var mobile = new cc.LabelTTF(": " + PlayerMe.phoneNumber || "", cc.res.font.Myriad_Pro_Bold, _fontSize);
        mobile.setAnchorPoint(cc.p(0, 0.5));
        mobile.setPosition(_txt_x, _lb_y - _spacing * 3);
        this.userPhone = mobile;
        mobile.visible = false;
        this.infoView.addChild(mobile);

        var baoMatBtn = this._initItemInNode(-1, "BẢO MẬT");
        baoMatBtn.scale = 0.68;
        baoMatBtn.setPosition(this.infoView.width / 2 - baoMatBtn.width / 2, _lb_y - _spacing * 6);
        baoMatBtn.setTouchEnabled(true);
        baoMatBtn.getChildByName("NameNode").setColor(cc.color(0, 0, 0));
        baoMatBtn.getChildByName("iconLight").visible = false;
        baoMatBtn.visible = false;
        this.infoView.addChild(baoMatBtn);


        var vipBtn = this._initItemInNode(-1, "VIP");
        vipBtn.scale = 0.68;
        vipBtn.setPosition(this.infoView.width / 2 + baoMatBtn.width / 2, _lb_y - _spacing * 6);
        vipBtn.setTouchEnabled(true);
        vipBtn.getChildByName("NameNode").setColor(cc.color(0, 0, 0));
        vipBtn.getChildByName("iconLight").visible = false;
        vipBtn.setVisible(false);
        this.infoView.addChild(vipBtn);
        //===============================================
        //===================VIP ZONE====================
        //===============================================
        var bgVip = new cc.Sprite("#icon_boder_vip.png");
        bgVip.scale = 0.68;
        bgVip.setPosition(this.infoView.width - bgVip.width / 2 - 20, this.infoView.height / 2);
        this.infoView.addChild(bgVip);

        var imgVip = new cc.Sprite("#icon_sapphire.png");
        // imgVip.scale = 0.68;
        imgVip.setPosition(bgVip.width / 2, bgVip.height / 2);
        bgVip.addChild(imgVip);

        // var imgType = new cc.Sprite("#icon_reward.png");
        // imgType.scale = 0.68;
        // imgType.setPosition(bgVip.x, bgVip.y - bgVip.height * 0.68 / 2 + 20);
        // this.infoView.addChild(imgType);

        var labelVip = new cc.LabelTTF(PlayerMe.vipName || "Sapphire", cc.res.font.Arial_Bold, 30);
        labelVip.setPosition(imgVip.width / 2, imgVip.height - 22);
        bgVip.addChild(labelVip);

        var labelPointVip = new cc.LabelTTF(PlayerMe.vipPoint || "100/200", cc.res.font.Arial_Bold, 30);
        labelPointVip.setPosition(imgVip.width / 2, -22);
        bgVip.addChild(labelPointVip);
        bgVip.visible = false;

        //===================PROCESS ACTION====================

        var thiz = this;

        baoMatBtn.addClickEventListener(function () {
            baoMatBtn.setScale(0.73);
            setTimeout(function () {
                baoMatBtn.setScale(0.68);
            });
            thiz._showSecurityDialog();
        });

        vipBtn.addClickEventListener(function () {
            vipBtn.setScale(0.73);
            setTimeout(function () {
                vipBtn.setScale(0.68);
            });
            var d = new HomeNotifyPopup();
            d.showNotification(MultiLanguage.getTextByKey("Coming Soon!"));
        });

        //REALAYOUT IPAD
        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {
            // cc.log("X: " + cc.winSize.width + bgVip.getContentSize().width);
            bgVip.setPositionX(cc.winSize.width + 10);
            imgVip.setPosition(bgVip.width / 2, bgVip.height / 2);
            // imgType.setPosition(bgVip.x, bgVip.y - bgVip.height * 0.68 / 2 + 20);
            // imgType.setPosition(bgVip.x, bgVip.y - bgVip.height * 0.68 / 2 + 20);
            // labelVip.setPosition(imgType.width / 2, imgType.height - 22);
            // labelPointVip.setPosition(imgType.width / 2, -22);
        }

    },

    _initItemInNode: function (typeItem, text) {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(300, 100));

        var bgItem = new ccui.Scale9Sprite("home_btn_chuyentien.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(node.width, node.height));
        bgItem.setPosition(node.width / 2, node.height / 2);
        node.addChild(bgItem);

        var label = new cc.LabelTTF(text, cc.res.font.Arial_Bold, 35, cc.p(400, 300), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        label.setName("NameNode");
        label.setColor(cc.color("#fde612"));

        label.setPosition(node.width / 2, node.height / 2);
        node.addChild(label);

        var borderItem = new cc.Sprite();
        borderItem.scaleY = 2;
        borderItem.setName("iconLight");
        borderItem.setPosition(node.width / 2, label.y - 20);
        node.addChild(borderItem);

        if (typeItem === 0) {
            borderItem.visible = true;
            bgItem.visible = false;
        }
        else if (typeItem === 1) {
            label.setFontSize(30);
            bgItem.setPreferredSize(cc.size(label.width * 1.5, label.height * 1.3));
        } else if (typeItem === 2) {
            label.setFontSize(30);
            bgItem.setPreferredSize(cc.size(label.width * 1.5, node.height));
        }

        return node;
    },

    _initAvatar: function () {
        var stencil = new ccui.Scale9Sprite("avatar_bg.png", "", "", ccui.Widget.PLIST_TEXTURE);
        stencil.setPreferredSize(cc.size(400, 400));
        var clippingNode = new cc.ClippingNode(stencil);
        clippingNode.setAlphaThreshold(0.5);

        var avatar = new cc.Sprite("#home_avatar_default_thantai.png");
        avatar.scale = 0.56;
        clippingNode.addChild(avatar);
        clippingNode.setPosition(avatar.width * 0.25 + 50, this.infoView.height / 2);
        this.infoView.addChild(clippingNode);

        var changeAva = new ccui.Button("btn_camera.png", "btn_camera.png", "btn_camera.png", ccui.Widget.PLIST_TEXTURE);
        changeAva.setAnchorPoint(0.5, 0);
        changeAva.pressedActionEnabled = false;
        changeAva.scale = 0.5;
        changeAva.y = -avatar.height * 0.25 - 13;
        clippingNode.addChild(changeAva);
        this.avatar = avatar;

        if (!PlayerMe.userAvatar) {
            // cc.log(PlayerMe);
        } else {
            var thiz = this;
            var url = PlayerMe.userAvatar;
            if (cc.sys.isNative) {
                TextureDownloader.load(url, function (tex) {
                    cc.spriteFrameCache.addSpriteFrames(url, tex);
                    if (thiz.avatar)
                        thiz.avatar.removeFromParent();

                    var avatar = new cc.Sprite(tex);
                    clippingNode.addChild(avatar);
                    thiz.avatar = avatar;
                });
            }
        }

        //    RELAYOUT FOR IPAD
        if (cc.winSize.height / cc.winSize.width === 4 / 3 || cc.winSize.height / cc.winSize.width === 3 / 4) {
            clippingNode.setPositionX(0);
        }
    },


    _showSecurityDialog: function () {
        var dialog = new HomeSecurityDialog();
        dialog.show();
    },
    _showGiftCodeDialog: function () {
        var dialog = new HomeGiftCodeDialog();
        dialog.show();
    },

    updateGetUserInfo: function (res) {
        this.setLoading(false);
        if (res.length > 0) {
            var userName = res["Username"];
            var userGold = res["userGold"];
            var userPhone = res["userPhone"];

            this.fullName.setString(": " + userName);
            this.userGold.setString(": " + cc.Global.NumberFormat1(userGold));
            if (userPhone) {
                this.userPhone.setString(": " + userPhone);
                PlayerMe.phoneNumber = userPhone;
            }
        }
    }


});
