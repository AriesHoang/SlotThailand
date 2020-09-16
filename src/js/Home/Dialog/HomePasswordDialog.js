var HomePasswordDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite();
        bg.visible = false;
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

        this.getChildByName("buttonBack").loadTextures("btn_back_email.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.getChildByName("buttonBack").setPosition(-568, 314);

        this._initMainView();
        this._initGUIs();
        // this.setLoading(true);
    },

    _initGUIs: function () {

    },

    //================================================================================
    //================================================================================
    //=================================MAIN VIEW=====================================
    //================================================================================
    //================================================================================
    _initMainView: function () {
        this.mainView = new ccui.Widget();
        this.mainView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
        // this.mainView.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(this.mainView);

        var _spacing = 100;
        // var colorLayer = new cc.LayerColor(cc.color(0, 0, 0, 100), this.mainView.width, this.mainView.height);
        // this.mainView.addChild(colorLayer);

        var label = new cc.LabelTTF("QUÊN MẬT KHẨU", cc.res.font.Myriad_Pro_Bold, 45);
        label.setPosition(this.mainView.width / 2, this.mainView.height - label.height);
        this.mainView.addChild(label);

        var line1 = new cc.Sprite("#seperate_line_baomat.png");
        // line1.setName("iconLight");
        line1.scaleX = 1.5;
        line1.scaleY = 2;
        line1.setPosition(this.mainView.width / 2, this.mainView.height / 2);
        this.mainView.addChild(line1);

        //================= INFO ZONE

        var btnFacebook = new ccui.Button("login_btn_facebook.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnFacebook.scale = 0.45;
        btnFacebook.setAnchorPoint(0, 0.5);
        btnFacebook.setName("buttonBack");
        btnFacebook.setPosition(this.mainView.width / 2 + 30, label.y - _spacing);
        this.mainView.addChild(btnFacebook);
        this.HomePassWordBtnFacebook = btnFacebook;

        var btnGoogle = new ccui.Button("login_btn_google.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnGoogle.scale = 0.72;
        btnGoogle.setAnchorPoint(0, 0.5);
        btnGoogle.setName("btnGoogle");
        btnGoogle.setPosition(btnFacebook.x + btnFacebook.width, btnFacebook.y);
        this.mainView.addChild(btnGoogle);
        this.HomePassWordBtnGoogle = btnGoogle;

        var content = "Lưu ý: Để lấy lại mật khẩu bằng SMS, bạn cần kích hoạt bảo mật bằng SMS." +
            "\nBước 1: Soạn tin ABC OTP gửi 8xxx để lấy mã xác thực." +
            "\nBước 2: Nhập các thông tin theo yêu cầu và thực hiện đổi mật khẩu.";
        var contentLabel = new cc.LabelTTF(content, cc.res.font.Myriad_Pro_Regular, 23, cc.size(500, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        contentLabel.setAnchorPoint(0, 1);
        contentLabel.setPosition(btnFacebook.x, btnFacebook.y - btnFacebook.height / 2);
        this.mainView.addChild(contentLabel);

        // var dangKyBtn = this._initItemInNode(1, "Đăng ký");
        // dangKyBtn.setAnchorPoint(cc.p(0, 0.5));
        // dangKyBtn.scale = 0.65;
        // dangKyBtn.setPosition(contentLabel.x, contentLabel.y - contentLabel.height - _spacing + 30);
        // dangKyBtn.setTouchEnabled(true);
        // this.mainView.addChild(dangKyBtn);
        //
        // var dangnhapBtn = this._initItemInNode(1, "Đăng nhập");
        // // dangnhapBtn.setAnchorPoint(cc.p(0, 0));
        // dangnhapBtn.scale = 0.65;
        // dangnhapBtn.setPosition(dangKyBtn.x + dangKyBtn.width, dangKyBtn.y);
        // dangnhapBtn.setTouchEnabled(true);
        // this.mainView.addChild(dangnhapBtn);


//INPUT VIEW
        var btnMethod = this._itemNhaMang();
        btnMethod.setPosition(btnMethod.width / 2 + 60, label.y - _spacing);
        btnMethod.setTouchEnabled(true);
        this.mainView.addChild(btnMethod);

        if(cc.winSize.height/cc.winSize.width === 4/3
            || cc.winSize.height/cc.winSize.width === 3/4){
            this.mainView.setScale(cc.winSize.screenScale);
            btnMethod.setPositionX(200);
        }


        this.smsView = this._initSMSView();
        this.smsView.setAnchorPoint(0.5, 1);
        this.smsView.setPosition(btnMethod.x, btnMethod.y - btnMethod.height / 2);
        this.mainView.addChild(this.smsView);


        this.emailView = this._initEmailView();
        this.emailView.setAnchorPoint(0.5, 1);
        this.emailView.visible = false;
        this.emailView.setPosition(btnMethod.x, btnMethod.y - btnMethod.height / 2);
        this.mainView.addChild(this.emailView);

        var viewMethods = new ccui.Widget();
        viewMethods.setContentSize(cc.size(500, 200));
        viewMethods.setAnchorPoint(cc.p(0.5, 1));
        viewMethods.setPosition(btnMethod.x, btnMethod.y - btnMethod.height / 2);
        viewMethods.visible = false;
        this.mainView.addChild(viewMethods);

        btnMethod.scale = this.smsView.scale = this.emailView.scale = viewMethods.scale = 0.9;

        var bgItem = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(viewMethods.width, viewMethods.height));
        bgItem.setPosition(viewMethods.width / 2, viewMethods.height / 2);
        viewMethods.addChild(bgItem);

        for (var i1 = 0; i1 < 2; i1++) {
            var cell = new ccui.Widget();
            cell.setContentSize(cc.size(500, 57));
            cell.setAnchorPoint(cc.p(0.5, 1));
            viewMethods.addChild(cell);

            var _name = "";
            if (i1 == 0) {
                cell.setName("SMS");
                _name = "Lấy lại mật khẩu bằng SMS";
            }
            else if (i1 == 1) {
                cell.setName("EMAIL");
                _name = "Lấy lại mật khẩu bằng EMAIL";
            }
            cell.setTouchEnabled(true);

            //-------
            var color = cc.color("#d7cecf");
            var _bg = new cc.LayerColor(color, 495, 57);
            _bg.x = 2;
            if (i1 % 2 == 0) {
                _bg.setOpacity(50);
            } else {
                _bg.setOpacity(100);
            }
            //-------
            var label1 = new cc.LabelTTF(_name, cc.res.font.Myriad_Pro_Regular, 30);
            label1.setColor(cc.color(255, 255, 255));
            label1.setPosition(cell.width / 2, cell.height / 2);
            cell.addChild(label1);

            cell.setPosition(viewMethods.width / 2, viewMethods.height - cell.height * i1 - 5);
            cell.addChild(_bg);

        }
        var thiz = this;
        viewMethods.getChildByName("SMS").addClickEventListener(function () {
            btnMethod.getChildByName("NameNode").setString("Lấy lại mật khẩu bằng SMS");
            thiz.smsView.visible = true;
            thiz.emailView.visible = false;
            viewMethods.visible = false;
            thiz.lb_infoSMS.setString("");
        });
        viewMethods.getChildByName("EMAIL").addClickEventListener(function () {
            thiz.lb_infoSMS.setString("Chưa hỗ trợ chức năng này.");
            // btnMethod.getChildByName("NameNode").setString("Lấy lại mật khẩu bằng EMAIL");
            // thiz.smsView.visible = false;
            // thiz.emailView.visible = true;
            viewMethods.visible = false;
        });
        btnMethod.addClickEventListener(function () {
            viewMethods.visible = !viewMethods.visible;
        });

        // dangKyBtn.addClickEventListener(function () {
        //     thiz._showLoginView(1);
        // });
        // dangnhapBtn.addClickEventListener(function () {
        //     thiz._showLoginView(0);
        // });
        this.getCaptchaSMS();
    },

    _showLoginView: function (index) {
        this.hide();
        var dialog = new HomeLoginDialog();
        dialog._initGUIs(index);
        // dialog.show();
    },

    _initSMSView: function () {
        smsView = new ccui.Widget();
        this.smsView = smsView;
        smsView.setContentSize(cc.size(500, cc.winSize.height * 0.8));

        // var colorLayer = new cc.LayerColor(cc.color(0, 0, 0, 100), smsView.width, smsView.height);
        // smsView.addChild(colorLayer);
        var _spacing = 90;

        // //===============USERNAME
        var usernameBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        usernameBg.setPreferredSize(cc.size(500, 80));
        usernameBg.setPosition(smsView.width / 2, smsView.height - usernameBg.height / 2 - 10);
        smsView.addChild(usernameBg);

        var usernameTF = new MultiLanguage.createNewUITextField("USER_NAME_TYPE", cc.size(480, 80),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        usernameTF.setTextColor(cc.color(255, 255, 255));
        usernameTF.setPlaceHolderColor(cc.color(145, 143, 144));
        usernameTF.setPosition(usernameBg.x, usernameBg.y);
        this.usernameTF = usernameTF;
        smsView.addChild(usernameTF);

        // //===============OTP
        var otpBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        otpBg.setPreferredSize(cc.size(500, 80));
        otpBg.setPosition(usernameBg.x, usernameBg.y - _spacing);
        smsView.addChild(otpBg);

        var otpTF = new MultiLanguage.createNewUITextField("nhập OTP ...", cc.size(480, 80),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        otpTF.setTextColor(cc.color(255, 255, 255));
        otpTF.setPlaceHolderColor(cc.color(145, 143, 144));
        otpTF.setPosition(otpBg.x, otpBg.y);
        this.otpTF = otpTF;
        smsView.addChild(otpTF);

        // //===============NEW PASSWORD
        var newPassBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        newPassBg.setPreferredSize(cc.size(500, 80));
        newPassBg.setPosition(otpBg.x, otpBg.y - _spacing);
        smsView.addChild(newPassBg);

        var newPassTF = new MultiLanguage.createNewUITextField("PASSWORD_TYPE", cc.size(480, 80),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        newPassTF.setTextColor(cc.color(255, 255, 255));
        newPassTF.setPlaceHolderColor(cc.color(145, 143, 144));
        newPassTF.setPasswordEnable(true);
        newPassTF.setPosition(newPassBg.x, newPassBg.y);
        this.newPassTF = newPassTF;
        smsView.addChild(newPassTF);

        // //===============RE NEW PASSWORD
        var newRePassBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        newRePassBg.setPreferredSize(cc.size(500, 80));
        newRePassBg.setPosition(newPassBg.x, newPassBg.y - _spacing);
        smsView.addChild(newRePassBg);

        var newRePassTF = new MultiLanguage.createNewUITextField("RE_PASSWORD_TYPE", cc.size(480, 80),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        newRePassTF.setTextColor(cc.color(255, 255, 255));
        newRePassTF.setPlaceHolderColor(cc.color(145, 143, 144));
        newRePassTF.setPosition(newRePassBg.x, newRePassBg.y);
        newRePassTF.setPasswordEnable(true);
        this.newRePassTF = newRePassTF;
        smsView.addChild(newRePassTF);

        // //===============CAPTCHA
        var captchaBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        captchaBg.setPreferredSize(cc.size(250, 80));
        captchaBg.setPosition(newRePassBg.x - newRePassBg.width / 2 + captchaBg.width / 2, newRePassBg.y - _spacing);
        smsView.addChild(captchaBg);

        var captchaTF = new MultiLanguage.createNewUITextField("CAPTCHA_TYPE_HERE", cc.size(250, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        captchaTF.setTextColor(cc.color(255, 255, 255));
        captchaTF.setPlaceHolderColor(cc.color(145, 143, 144));
        captchaTF.setPosition(captchaBg.x, captchaBg.y);
        this.captchaTF = captchaTF;
        smsView.addChild(captchaTF);

        var btnRefreshCaptcha = new ccui.Button("icon_refesh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnRefreshCaptcha.scale = 0.68;
        btnRefreshCaptcha.setAnchorPoint(1, 0.5);
        btnRefreshCaptcha.setName("btnRefesh");
        btnRefreshCaptcha.setPosition(newRePassBg.x + newRePassBg.width / 2, captchaBg.y);
        smsView.addChild(btnRefreshCaptcha);
        var thizz = this;
        btnRefreshCaptcha.addClickEventListener(function () {
            thizz.getCaptchaSMS();
        });


        //=============== INFO
        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 28);
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(usernameBg.x, captchaBg.y - _spacing + 10);
        this.lb_infoSMS = lb_info;
        smsView.addChild(lb_info);
        // this.lb_info = lb_info;
        //=============== BUTTON GIFT CODE

        var submitBtn = this._initItemInNode(0, "Lấy lại mật khẩu");
        // submitBtn.setAnchorPoint(cc.p(0, 0));
        submitBtn.scale = 0.65;
        submitBtn.setPosition(usernameBg.x, lb_info.y - _spacing + 30);
        submitBtn.setTouchEnabled(true);
        smsView.addChild(submitBtn);

        submitBtn.addClickEventListener(function () {
            cc.Global.sendVerifyCaptcha(cc.Global.captchaData.token, captchaTF.getText(), function () {
                if (thizz._checkBeforeSubmitSMS(usernameTF.getText(), otpTF.getText(), newPassTF.getText(), newRePassTF.getText(), captchaTF.getText())) {
                    var params = {
                        "1": newPassTF.getText(),
                        "2": otpTF.getText()
                    };
                    SmartfoxClient.getInstance().sendResetPass(params);
                } else {
                    thizz.getCaptchaSMS();
                }
            })
        });

        return smsView;
    },

    _initEmailView: function () {
        emailView = new ccui.Widget();
        emailView.setContentSize(cc.size(500, cc.winSize.height * 0.8));

        // var colorLayer = new cc.LayerColor(cc.color(0, 0, 0, 100), emailView.width, emailView.height);
        // emailView.addChild(colorLayer);
        var _spacing = 90;

        // //===============USERNAME
        var usernameBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        usernameBg.setPreferredSize(cc.size(500, 80));
        usernameBg.setPosition(emailView.width / 2, emailView.height - usernameBg.height / 2 - 10);
        emailView.addChild(usernameBg);

        var usernameTF = new MultiLanguage.createNewUITextField("USER_NAME_TYPE", cc.size(480, 80),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        usernameTF.setTextColor(cc.color(255, 255, 255));
        usernameTF.setPlaceHolderColor(cc.color(145, 143, 144));
        usernameTF.setPosition(usernameBg.x, usernameBg.y);
        emailView.addChild(usernameTF);

        // //===============Email
        var mailBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        mailBg.setPreferredSize(cc.size(500, 80));
        mailBg.setPosition(usernameBg.x, usernameBg.y - _spacing);
        emailView.addChild(mailBg);

        var otpTF = new MultiLanguage.createNewUITextField("OTP_TYPE_HERE", cc.size(480, 80),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        otpTF.setTextColor(cc.color(255, 255, 255));
        otpTF.setPlaceHolderColor(cc.color(145, 143, 144));
        otpTF.setPosition(mailBg.x, mailBg.y);
        emailView.addChild(otpTF);

        // //===============CAPTCHA
        var captchaBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        captchaBg.setPreferredSize(cc.size(250, 80));
        captchaBg.setPosition(mailBg.x - mailBg.width / 2 + captchaBg.width / 2, mailBg.y - _spacing);
        emailView.addChild(captchaBg);

        var captchaTF = new MultiLanguage.createNewUITextField("CAPTCHA_TYPE_HERE", cc.size(250, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        captchaTF.setTextColor(cc.color(255, 255, 255));
        captchaTF.setPlaceHolderColor(cc.color(145, 143, 144));

        captchaTF.setPosition(captchaBg.x, captchaBg.y);
        emailView.addChild(captchaTF);
        // this.captchaGiftcodeTF = captchaTF;

        //=============== INFO
        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 28);
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(usernameBg.x, captchaBg.y - _spacing + 5);
        emailView.addChild(lb_info);
        // this.lb_info = lb_info;
        //=============== BUTTON GIFT CODE

        var submitBtn = this._initItemInNode(0, "Lấy lại mật khẩu");
        // submitBtn.setAnchorPoint(cc.p(0, 0));
        submitBtn.scale = 0.65;
        submitBtn.setPosition(usernameBg.x, lb_info.y - _spacing + 15);
        submitBtn.setTouchEnabled(true);
        emailView.addChild(submitBtn);

        return emailView;
    },

    _initItemInNode: function (typeItem, text) {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(300, 100));
        // var opacity = Math.floor(255);

        var bgItem = new ccui.Scale9Sprite("home_btn_chuyentien.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(node.width, node.height));
        // bgItem.scale = 1.75;
        bgItem.setPosition(node.width / 2, node.height / 2);
        node.addChild(bgItem);

        var label = new cc.LabelTTF(text, cc.res.font.Myriad_Pro_Regular, 40);
        // label.setAnchorPoint(cc.p(0, 0));
        label.setName("NameNode");
        // label.setColor(cc.color(252,194,81));
        label.setPosition(node.width / 2, node.height / 2);
        node.addChild(label);

        var borderItem = new ccui.Scale9Sprite("tophu_seperate_line.png", "", "", ccui.Widget.PLIST_TEXTURE);
        borderItem.visible = false;
        borderItem.setName("iconLight");
        borderItem.setPosition(node.width / 2, label.y - 20);
        node.addChild(borderItem);

        if (typeItem == 0) {
            // borderItem.visible = true;
            // bgItem.visible = false;
        }
        else if (typeItem == 1) {
            bgItem.visible = false;
            borderItem.visible = true;
            borderItem.setPreferredSize(cc.size(label.width, borderItem.height));
        } else if (typeItem == 2) {
            label.setFontSize(30);
            bgItem.setPreferredSize(cc.size(label.width * 1.5, node.height));
        }

        return node;
    },

    _itemNhaMang: function () {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(500, 80));
        var bgItem = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(node.width, node.height));
        bgItem.setName("bgItem");
        bgItem.setPosition(node.width / 2, node.height / 2);
        node.addChild(bgItem);

        var label = new cc.LabelTTF("Lấy lại mật khẩu bằng SMS", cc.res.font.Myriad_Pro_Regular, 30);
        label.setAnchorPoint(cc.p(0, 0.5));
        label.setName("NameNode");
        label.setColor(cc.color(255, 255, 255));
        label.setPosition(20, node.height / 2);
        node.addChild(label);

        var borderItem = new cc.Sprite("#icon_scroldown.png");
        borderItem.setName("iconLight");
        borderItem.setPosition(node.width - borderItem.width, node.height / 2);
        node.addChild(borderItem);

        return node;
    },

    _checkBeforeSubmitSMS: function (userName, otp, newpass, repass, captcha) {
        cc.log("_checkBeforeSubmitSMS");
        var validation = {
            isNotEmpty: function (str) {
                var pattern = /\S+/;
                return pattern.test(str);  // returns a boolean
            },
            isPass: function (str) {
                var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,30}$/;
                return pattern.test(str);
            }
        };

        if (!validation.isNotEmpty(userName)) {
            this.lb_infoSMS.setString(MultiLanguage.getTextByKey("Chưa nhập tên tài khoản!"));
            return false;
        } else if (!validation.isNotEmpty(otp)) {
            this.lb_infoSMS.setString(MultiLanguage.getTextByKey("Chưa nhập mã otp!"));
            return false;
        } else if (!validation.isNotEmpty(newpass)) {
            this.lb_infoSMS.setString(MultiLanguage.getTextByKey("Chưa nhập mật khẩu!"));
            return false;
        } else if (!validation.isNotEmpty(repass)) {
            this.lb_infoSMS.setString(MultiLanguage.getTextByKey("Chưa nhập lại mật khẩu!"));
            return false;
        } else if (!validation.isNotEmpty(captcha)) {
            this.lb_infoSMS.setString(MultiLanguage.getTextByKey("Chưa nhập mã xác nhận!"));
            return false;
        } else if (!validation.isPass(newpass)) {
            this.lb_infoSMS.setString(MultiLanguage.getTextByKey("Mật khẩu phải từ 6 ký tự và có ít nhất một chữ hoa!"));
            return false;
        } else if (newpass !== repass) {
            this.lb_infoSMS.setString(MultiLanguage.getTextByKey("Mật khẩu nhập lại không đúng!"));
            return false;
        } else if (cc.Global.isVerify === false) {
            this.lb_infoSMS.setString(MultiLanguage.getTextByKey("Chưa nhập mã xác nhận không đúng!"));

            return false;
        }
        return true;
    },

    ivtTime: -1,
    getCaptchaSMS: function () {
        cc.Global.bGetCaptcha = false;
        cc.Global.getUrlCaptcha();
        clearInterval(this.ivtTime);
        if (this.smsView.getChildByName("sprCaptcha"))
            this.smsView.getChildByName("sprCaptcha").removeFromParent();
        var thiz = this;
        this.ivtTime = setInterval(function () {
            if (cc.Global.bGetCaptcha) {
                cc.log("captchadata: " + JSON.stringify(cc.Global.captchaData));
                var url = cc.Global.captchaData.urlCaptcha;
                cc.log(url);
                // cc.textureCache.addImageAsync(url, function (texture) {
                //     if (texture instanceof cc.Texture2D) {
                //         cc.log(texture);
                //         cc.log("Remote texture loaded for user_id: ");
                //         var sprite = new cc.Sprite(texture);
                //         sprite.setName("sprCaptcha");
                //         sprite.x = thiz.captchaTF.x + 220;
                //         sprite.y = thiz.captchaTF.y;
                //         sprite.scale = 60 / sprite.height;
                //         thiz.smsView.addChild(sprite);
                //     }
                //     else {
                //         cc.log("Fail to load remote texture");
                //     }
                // }, this);
                TextureDownloader.load(url, function (tex) {
                    cc.spriteFrameCache.addSpriteFrames(url, tex);

                    var sprite = new cc.Sprite(tex);
                    sprite.setName("sprCaptcha");
                    sprite.x = thiz.captchaTF.x + 220;
                    sprite.y = thiz.captchaTF.y;
                    sprite.scale = 60 / sprite.height;
                    thiz.smsView.addChild(sprite);
                });
                clearInterval(thiz.ivtTime);
            }
        }, 100);
    },
});