var HomeLoginDialog = cc.Node.extend({
    ctor: function () {
        this._super();

        var bgDialog = new ccui.Button("bg_popup.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // bgDialog.setPreferredSize(cc.size(cc.winSize.width, cc.winSize.height));
        bgDialog.scaleX = cc.winSize.width / bgDialog.width;
        bgDialog.scaleY = cc.winSize.height / bgDialog.height;
        this.addChild(bgDialog);

        var btnBack = new ccui.Button("home_dialog_button_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnBack.scale = 0.68;
        btnBack.setName("buttonBack");
        btnBack.setPosition(568, 314);
        this.addChild(btnBack, 99);

        var thiz = this;
        btnBack.addClickEventListener(function () {
            thiz.visible = false;
        });

        this._initLoginPhoneView();
        this._initLoginView();
        this._initRegistView();
        this._initGUIs(0);
        // this.setLoading(true);
        this._initAccRemember();
    },
    _initAccRemember: function () {
        if (!cc.Global.getRememberAcc()) {
            this.usernameLogin.setText("");
            this.passwordLogin.setText("");
        } else {
            this.usernameLogin.setText(cc.Global.getSaveUsername());
            this.passwordLogin.setText(cc.Global.getSavePassword());
        }
        this.usernameLogin.setText("venue0002");
        this.passwordLogin.setText("123456aQ@");
    },

    _initGUIs: function (index) {
        if (index === 0) {//LoginView
            this.loginView.visible = true;
            this.registView.visible = false;
            this.loginPhoneView.visible = false;
            this.lb_infoLogin.setString("");
        } else if (index === 1) {//Regist View
            this.loginView.visible = false;
            this.registView.visible = true;
            this.loginPhoneView.visible = false;
            this.lb_infoRegister.setString("");
            this.getCaptcha();
        } else if (index === 2) {//Login Phone View
            this.loginPhoneView.visible = true;
            this.loginView.visible = false;
            this.registView.visible = false;
            this.lb_info.setString("");
        }

    },
    //================================================================================
    //================================================================================
    //================================ LOGIN MOBILE ==================================
    //================================================================================
    //================================================================================
    checkInputFormLoginWithPhoneNumber: function () {
        // cc.log("Check input form");
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

        if (!validation.isNotEmpty(this.phoneNumberTF.getText())) {
            this.lb_info.setString(MultiLanguage.getTextByKey("Chưa nhập số điện thoại!!!"));
            return false;
        }
        else if (!validation.isNumber(this.phoneNumberTF.getText())) {
            this.lb_info.setString(MultiLanguage.getTextByKey("Nhập không đúng định dạng số điện thoại!!!!"));
            return false;
        }
        else if (!validation.isNotEmpty(this.phoneOtpTF.getText())) {
            this.lb_info.setString(MultiLanguage.getTextByKey("Chưa nhập mã xác nhận!!!!"));
            return false;
        }
        return true;
    },
    _initLoginPhoneView: function () {
        // cc.log("_initLoginPhoneView");
        this.loginPhoneView = new ccui.Widget();
        this.loginPhoneView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
        // this.loginPhoneView.y = -cc.winSize.height / 2 + this.loginPhoneView.height / 2 + 30;
        this.addChild(this.loginPhoneView);
        // var colorLayer = new cc.LayerColor(cc.color(0, 100, 0, 100), this.loginPhoneView.width, this.loginPhoneView.height);
        // this.loginPhoneView.visible = false;
        // this.loginPhoneView.addChild(colorLayer);

        var label = new cc.LabelTTF("ĐĂNG NHẬP", cc.res.font.Myriad_Pro_Bold, 45);
        label.enableStroke(cc.color("#073abe"), 2);
        label.setPosition(this.loginPhoneView.width / 2, this.loginPhoneView.height - label.height);
        this.loginPhoneView.addChild(label);

        var btnBack = new ccui.Button("home_dialog_button_back_mail.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnBack.scale = 0.68;
        btnBack.setPosition(btnBack.width, this.loginPhoneView.height - btnBack.height * 0.68);
        this.loginPhoneView.addChild(btnBack, 99);

        var thiz = this;
        btnBack.addClickEventListener(function () {
            thiz._initGUIs(0);
        });

        var line1 = new cc.Sprite("#seperate_line_baomat.png");
        // line1.setName("iconLight");
        // line1.scaleX = 1.5;
        line1.scaleY = 1.5;
        line1.setPosition(this.loginPhoneView.width / 2, this.loginPhoneView.height / 2);
        this.loginPhoneView.addChild(line1);

        var _fontSize = 32;
        var _lb_x = this.loginPhoneView.width / 4;
        var _lb_y = this.loginPhoneView.height / 2 + 200;
        var _spacing = 100;

        var lb_intro = MultiLanguage.createLabelTTFFont("Đăng nhập bằng số điện thoại", cc.res.font.Myriad_Pro_Regular, _fontSize);
        lb_intro.setPosition(this.loginPhoneView.width / 2, this.loginPhoneView.height - lb_intro.height);
        // label.setName("NameNode");
        lb_intro.y = label.y - lb_intro.height - 50;
        lb_intro.setColor(cc.color(252, 194, 81));
        this.loginPhoneView.addChild(lb_intro);


        //=============== RIGHT SIZE

        var _lb2_x = this.loginPhoneView.width * 3 / 4;
        var _lb2_y = this.loginPhoneView.height / 2 + 150;
        var _spacing2 = 70;
        var label1 = new cc.LabelTTF("Vui lòng soạn tin", cc.res.font.Myriad_Pro_Regular, 23, cc.size(450, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label1.setPosition(_lb2_x, _lb2_y);
        this.loginPhoneView.addChild(label1);

        var smsBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        smsBg.setPreferredSize(cc.size(500, 80));
        smsBg.setPosition(_lb2_x, label1.y - _spacing2);
        this.loginPhoneView.addChild(smsBg);

        var labelSMS = new cc.LabelTTF("ABC OTP gửi 8xxx", cc.res.font.Myriad_Pro_Regular, 30, cc.size(450, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        labelSMS.setFontFillColor(cc.color(255, 255, 89));
        labelSMS.setPosition(smsBg.x, smsBg.y);
        this.loginPhoneView.addChild(labelSMS);


        var label2 = new cc.LabelTTF("để lấy mã xác nhận OTP", cc.res.font.Myriad_Pro_Regular, 23, cc.size(450, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label2.setPosition(_lb2_x, smsBg.y - _spacing2);
        this.loginPhoneView.addChild(label2);

        //===============TEXT FIELD MOBILE NUMBER
        var mobileBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        mobileBg.setPreferredSize(cc.size(500, 80));
        mobileBg.setPosition(_lb_x, smsBg.y);
        this.loginPhoneView.addChild(mobileBg);

        var mobileTF = new MultiLanguage.createNewUITextField("NEW_MOBILE_NUMBER_TYPE_HERE", cc.size(500, 45),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        mobileTF.setTextColor(cc.color(255, 255, 255));
        mobileTF.setPlaceHolderColor(cc.color(145, 143, 144));

        mobileTF.setPosition(mobileBg.x, mobileBg.y);
        this.loginPhoneView.addChild(mobileTF);
        this.phoneNumberTF = mobileTF;

        //===============OTP
        var otpBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        otpBg.setPreferredSize(cc.size(500, 80));
        otpBg.setPosition(mobileBg.x, mobileBg.y - _spacing);
        this.loginPhoneView.addChild(otpBg);

        var otpTF = new MultiLanguage.createNewUITextField("OTP_TYPE_HERE", cc.size(500, 45),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        otpTF.setTextColor(cc.color(255, 255, 255));
        otpTF.setPlaceHolderColor(cc.color(145, 143, 144));

        otpTF.setPosition(otpBg.x, otpBg.y);
        this.loginPhoneView.addChild(otpTF);
        this.phoneOtpTF = otpTF;

        //=============== INFO
        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 28);
        lb_info.setAnchorPoint(cc.p(0, 0.5));
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(otpBg.x - otpBg.width / 2, otpBg.y - _spacing + 10);
        this.loginPhoneView.addChild(lb_info);
        this.lb_info = lb_info;

        //=============== BUTTON OK

        var xacnhanBtn = this._initItemInNode(0, "ĐĂNG NHẬP");
        xacnhanBtn.scale = 0.8;
        xacnhanBtn.setPosition(otpBg.x, lb_info.y - _spacing + 10);
        xacnhanBtn.setTouchEnabled(true);
        xacnhanBtn.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
        xacnhanBtn.getChildByName("iconLight").visible = false;
        this.loginPhoneView.addChild(xacnhanBtn);
        this.loginPhoneBtn = xacnhanBtn;

    },
    //================================================================================
    //================================================================================
    //=================================Register VIEW==================================
    //================================================================================
    //================================================================================
    checkInputFormRegister: function () {
        var validation = {
            isNotEmpty: function (str) {
                var pattern = /\S+/;
                return pattern.test(str);  // returns a boolean
            },
            isUserName: function (str) {
                var pattern = /^[A-Za-z][a-zA-Z0-9_.-]{5,24}$/;
                return pattern.test(str);
            },
            isPass: function (str) {
                var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,30}$/;
                return pattern.test(str);
            }
        };

        if (!validation.isNotEmpty(this.userNameReg.getText())) {
            this.lb_infoRegister.setString(MultiLanguage.getTextByKey("Chưa nhập tên tài khoản!"));
            return false;
        } else if (!validation.isUserName(this.userNameReg.getText())) {
            this.lb_infoRegister.setString(MultiLanguage.getTextByKey("Tên tài khoản phải bắt đầu bằng chữ, từ 6 ký tự và không có ký tự đặc biệt!"));
            return false;
        } else if (!validation.isNotEmpty(this.passReg.getText())) {
            this.lb_infoRegister.setString(MultiLanguage.getTextByKey("Chưa nhập mật khẩu!"));
            return false;
        } else if (!validation.isPass(this.passReg.getText())) {
            this.lb_infoRegister.setString(MultiLanguage.getTextByKey("Mật khẩu phải từ 6 ký tự và có ít nhất một chữ hoa và chữ thường!"));
            return false;
        } else if (!validation.isNotEmpty(this.rePassReg.getText())) {
            this.lb_infoRegister.setString(MultiLanguage.getTextByKey("Chưa nhập lại mật khẩu!"));
            return false;
        } else if (this.passReg.getText() !== this.rePassReg.getText()) {
            this.lb_infoRegister.setString(MultiLanguage.getTextByKey("Mật khẩu nhập lại không đúng!"));
            return false;
        }
        else if (!validation.isNotEmpty(this.captchaReg.getText())) {
            this.lb_infoRegister.setString(MultiLanguage.getTextByKey("Chưa nhập mã captcha!"));
            return false;
        }
        else if (!this.checkboxReg.isSelected()) {
            this.lb_infoRegister.setString(MultiLanguage.getTextByKey("Bạn cần đồng ý với các điều khoản của nhà phát hành khi đăng ký!"));
            return false;
        }
        return true;
    },

    _initRegistView: function () {
        this.registView = new ccui.Widget();
        this.registView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
        this.addChild(this.registView);
        var _spacing = 100;

        var label = new cc.LabelTTF("ĐĂNG KÝ", cc.res.font.Myriad_Pro_Bold, 45, cc.p(400, 300), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        label.enableStroke(cc.color("#073abe"), 2);
        label.setPosition(this.registView.width / 2, this.registView.height - label.height);
        this.registView.addChild(label);

        var btnBack = new ccui.Button("home_dialog_button_back_mail.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnBack.scale = 0.68;
        btnBack.setPosition(btnBack.width, this.registView.height - btnBack.height * 0.68);
        this.registView.addChild(btnBack, 99);

        var thiz = this;
        btnBack.addClickEventListener(function () {
            thiz.registView.visible = false;
            thiz.loginView.visible = true;
        });

        //========UserName
        var usernameBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        usernameBg.setPreferredSize(cc.size(500, 90));
        usernameBg.setPosition(this.registView.width / 2, label.y - _spacing);
        this.registView.addChild(usernameBg);

        var usernameTF = new MultiLanguage.createNewUITextField("USER_NAME_TYPE", cc.size(500, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        usernameTF.setTextColor(cc.color(255, 255, 255));
        usernameTF.setPlaceHolderColor(cc.color(145, 143, 144));
        usernameTF.setPosition(usernameBg.x, usernameBg.y);
        this.registView.addChild(usernameTF);
        this.userNameReg = usernameTF;

        //========Password
        var passwordBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        passwordBg.setPreferredSize(cc.size(500, 90));
        passwordBg.setPosition(this.registView.width / 2, usernameBg.y - _spacing);
        this.registView.addChild(passwordBg);

        var passwordTF = new MultiLanguage.createNewUITextField("PASSWORD_TYPE", cc.size(400, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        passwordTF.setTextColor(cc.color(255, 255, 255));
        passwordTF.setPlaceHolderColor(cc.color(145, 143, 144));
        passwordTF.setPasswordEnable(true);
        passwordTF.setPosition(passwordBg.x, passwordBg.y);
        this.registView.addChild(passwordTF);
        this.passReg = passwordTF;

        //========RePassword
        var rePasswordBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rePasswordBg.setPreferredSize(cc.size(500, 90));
        rePasswordBg.setPosition(this.registView.width / 2, passwordBg.y - _spacing);
        this.registView.addChild(rePasswordBg);

        var rePasswordTF = new MultiLanguage.createNewUITextField("RE_PASSWORD_TYPE", cc.size(400, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        rePasswordTF.setTextColor(cc.color(255, 255, 255));
        rePasswordTF.setPlaceHolderColor(cc.color(145, 143, 144));
        rePasswordTF.setPasswordEnable(true);
        rePasswordTF.setPosition(rePasswordBg.x, rePasswordBg.y);
        this.registView.addChild(rePasswordTF);
        this.rePassReg = rePasswordTF;

        // //===============CAPTCHA
        var captchaBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        captchaBg.setPreferredSize(cc.size(250, 80));
        captchaBg.setPosition(rePasswordBg.x - rePasswordBg.width / 2 + captchaBg.width / 2, rePasswordBg.y - _spacing);
        this.registView.addChild(captchaBg);

        var captchaTF = new MultiLanguage.createNewUITextField("CAPTCHA_TYPE_HERE", cc.size(250, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        captchaTF.setTextColor(cc.color(255, 255, 255));
        captchaTF.setPlaceHolderColor(cc.color(145, 143, 144));

        captchaTF.setPosition(captchaBg.x, captchaBg.y);
        this.registView.addChild(captchaTF);
        this.captchaReg = captchaTF;
        // this.captchaReg.visible = false;
        // captchaBg.visible = false;

        var btnRefreshCaptcha = new ccui.Button("icon_refesh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnRefreshCaptcha.scale = 0.68;
        btnRefreshCaptcha.setAnchorPoint(1, 0.5);
        btnRefreshCaptcha.setName("btnRefesh");
        btnRefreshCaptcha.setPosition(rePasswordBg.x + rePasswordBg.width / 2, captchaBg.y);
        this.registView.addChild(btnRefreshCaptcha);
        // btnRefreshCaptcha.visible = false;

        btnRefreshCaptcha.addClickEventListener(function () {
            thiz.getCaptcha();
        });


        var checkbox = new HomeFixCheckbox("home_dialog_btn_checkbox.png", "home_icon_check.png", ccui.Widget.PLIST_TEXTURE);
        checkbox.setAnchorPoint(0, 0.5);
        checkbox.scale = 0.68;
        checkbox.setSelected(true);
        checkbox.setPosition(captchaBg.x - captchaBg.width / 2, captchaBg.y - _spacing);
        this.registView.addChild(checkbox);
        this.checkboxReg = checkbox;

        var content = "Tôi đồng ý với điều khoản sử dụng.";
        var contentLabel = new cc.LabelTTF(content, cc.res.font.Myriad_Pro_Regular, 23, cc.size(400, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        contentLabel.setAnchorPoint(0, 0.5);
        contentLabel.setPosition(checkbox.x + checkbox.width, checkbox.y);
        this.registView.addChild(contentLabel);

        //=============== INFO
        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 26);
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(contentLabel.x + 110, contentLabel.y - _spacing + 60);
        this.registView.addChild(lb_info);
        this.lb_infoRegister = lb_info;

        var registerBtn = this._initItemInNode(0, "ĐĂNG KÝ");
        // baoMatBtn.setAnchorPoint(cc.p(0, 0));
        registerBtn.scale = 0.65;
        registerBtn.setPosition(this.registView.width / 2, contentLabel.y - _spacing);
        registerBtn.setTouchEnabled(true);
        this.registView.addChild(registerBtn);
        this.registerBtn = registerBtn;

        var btnGoogle = new ccui.Button("login_btn_google.png", "login_btn_google.png", "", ccui.Widget.PLIST_TEXTURE);
        btnGoogle.scale = 0.68;
        btnGoogle.setAnchorPoint(0, 0.5);
        btnGoogle.setName("btnGoogle");
        btnGoogle.setPosition(this.registView.width - btnGoogle.width, registerBtn.y);
        this.registView.addChild(btnGoogle);
        btnGoogle.visible = false;
        this.btnGoogleReg = btnGoogle;


        var btnFacebook = new ccui.Button("login_btn_facebook.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnFacebook.scale = 0.68;
        btnFacebook.setAnchorPoint(0, 0.5);
        btnFacebook.setName("buttonBack");
        btnFacebook.setPosition(btnGoogle.x, btnGoogle.y + btnGoogle.height);
        btnFacebook.setTouchEnabled(true);
        this.registView.addChild(btnFacebook);
        btnFacebook.visible = false;
        this.btnFacebookReg = btnFacebook;
    },
    ivtTime: -1,
    getCaptcha: function () {
        cc.Global.bGetCaptcha = false;
        cc.Global.getUrlCaptcha();
        clearInterval(this.ivtTime);
        if (this.registView.getChildByName("sprCaptcha"))
            this.registView.getChildByName("sprCaptcha").removeFromParent();
        var thiz = this;
        this.ivtTime = setInterval(function () {
            if (cc.Global.bGetCaptcha) {
                cc.log("captchadata: " + JSON.stringify(cc.Global.captchaData));
                var url = cc.Global.captchaData.urlCaptcha;
                // cc.log(url);
                TextureDownloader.load(url, function (tex) {
                    cc.spriteFrameCache.addSpriteFrames(url, tex);

                    var sprite = new cc.Sprite(tex);
                    sprite.setName("sprCaptcha");
                    sprite.x = thiz.captchaReg.x + 220;
                    sprite.y = thiz.captchaReg.y;
                    sprite.scale = 60 / sprite.height;
                    thiz.registView.addChild(sprite);
                });
                clearInterval(thiz.ivtTime);
            }
        }, 100);
    },
    //================================================================================
    //================================================================================
    //=================================Login VIEW=====================================
    //================================================================================
    //================================================================================
    checkInputFormLogin: function () {
        var validation = {
            isNotEmpty: function (str) {
                var pattern = /\S+/;
                return pattern.test(str);  // returns a boolean
            }
        };

        if (!validation.isNotEmpty(this.usernameLogin.getText())) {
            this.lb_infoLogin.setString(MultiLanguage.getTextByKey("Chưa nhập tên tài khoản!!!"));
            return false;
        } else if (!validation.isNotEmpty(this.passwordLogin.getText())) {

            this.lb_infoLogin.setString(MultiLanguage.getTextByKey("Chưa nhập mật khẩu!!!!"));
            return false;
        }
        cc.Global.setRememberAcc(this.checkboxRemember.isSelected());

        return true;
    },

    _showErrorWhenRegisterFail: function (mess) {
        this.getCaptcha();
        this.captchaReg.setText("");
        this.lb_infoRegister.setString(MultiLanguage.getTextByKey("*** " + mess + " ***"));
    },

    _showErrorWhenLoginFail: function (mess) {
        this.lb_infoLogin.setString(MultiLanguage.getTextByKey("*** " + mess + " ***"));
    },

    _initLoginView: function () {
        this.loginView = new ccui.Widget();
        this.loginView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
        this.loginView.visible = false;
        this.addChild(this.loginView);

        var _spacing = 100;

        var label = new cc.LabelTTF("ĐĂNG NHẬP", cc.res.font.Myriad_Pro_Bold, 45, cc.p(400, 300), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        label.enableStroke(cc.color("073abe"), 2);
        label.setPosition(this.loginView.width / 2, this.loginView.height - label.height);
        this.loginView.addChild(label);

        var btnFacebook = new ccui.Button("login_btn_facebook.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnFacebook.scale = 0.68;
        btnFacebook.setName("buttonBack");
        btnFacebook.setPosition(this.loginView.width / 2, label.y - _spacing);
        this.loginView.addChild(btnFacebook);
        this.loginView.setTouchEnabled(true);
        this.btnFacebook = btnFacebook;
        this.btnFacebook.visible = false;

        // var loginFbLabel = new cc.LabelTTF("Đăng nhập bằng FB", "Arial", 20);
        // loginFbLabel.setPosition(btnFacebook.x + 40, btnFacebook.y);
        // loginFbLabel.setAnchorPoint(0, 0.5);
        // this.loginView.addChild(loginFbLabel);

        var btnPhoneNumber = new ccui.Button("login_btn_phoneNumber.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnPhoneNumber.scale = 0.68;
        btnPhoneNumber.setAnchorPoint(1, 0.5);
        btnPhoneNumber.setName("btnPhoneNumber");
        btnPhoneNumber.setPosition(btnFacebook.x - btnFacebook.width / 2, btnFacebook.y);
        this.loginView.addChild(btnPhoneNumber);
        btnPhoneNumber.visible = false;

        var btnGoogle = new ccui.Button("login_btn_google.png", "login_btn_google.png", "", ccui.Widget.PLIST_TEXTURE);
        btnGoogle.scale = 0.68;
        btnGoogle.setAnchorPoint(0, 0.5);
        btnGoogle.setName("btnGoogle");
        // btnGoogle.setPosition(loginFbLabel.x + loginFbLabel.width + 10, btnFacebook.y);
        btnGoogle.setPosition(btnFacebook.x + btnFacebook.width / 2, btnFacebook.y);
        this.loginView.addChild(btnGoogle);
        this.btnGoogle = btnGoogle;
        this.btnGoogle.visible = false;

        // var loginGoogleLabel = new cc.LabelTTF("Đăng nhập bằng Google", "Arial", 20);
        // loginGoogleLabel.setPosition(btnGoogle.x + 75, btnGoogle.y);
        // loginGoogleLabel.setAnchorPoint(0, 0.5);
        // this.loginView.addChild(loginGoogleLabel);

        //========UserName
        var usernameBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        usernameBg.setPreferredSize(cc.size(500, 90));
        usernameBg.setPosition(this.loginView.width / 2, label.y - _spacing * 1.5);
        this.loginView.addChild(usernameBg);

        var iconUsername = new cc.Sprite("#icon_people.png");
        iconUsername.scale = 0.68;
        iconUsername.setPosition(iconUsername.width, usernameBg.height / 2);
        usernameBg.addChild(iconUsername);

        var usernameTF = new MultiLanguage.createNewUITextField("USER_NAME_TYPE", cc.size(400, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        usernameTF.setTextColor(cc.color(255, 255, 255));
        usernameTF.setPlaceHolderColor(cc.color(145, 143, 144));

        usernameTF.setPosition(usernameBg.x + 30, usernameBg.y);
        this.loginView.addChild(usernameTF);
        this.usernameLogin = usernameTF;
//========Password
        var passwordBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        passwordBg.setPreferredSize(cc.size(500, 90));
        passwordBg.setPosition(this.loginView.width / 2, usernameBg.y - _spacing);
        this.loginView.addChild(passwordBg);

        var iconPassword = new cc.Sprite("#icon_key.png");
        iconPassword.scale = 0.68;
        iconPassword.setPosition(iconPassword.width, passwordBg.height / 2);
        passwordBg.addChild(iconPassword);

        var passwordTF = new MultiLanguage.createNewUITextField("PASSWORD_TYPE", cc.size(400, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        passwordTF.setTextColor(cc.color(255, 255, 255));
        passwordTF.setPlaceHolderColor(cc.color(145, 143, 144));
        passwordTF.setPasswordEnable(true);
        passwordTF.setPosition(passwordBg.x + 30, passwordBg.y);
        this.loginView.addChild(passwordTF);
        this.passwordLogin = passwordTF;

        var registerBtn = this._initItemInNode(0, "ĐĂNG KÝ");
        registerBtn.scale = 0.65;
        registerBtn.setPosition(this.loginView.width / 2 - registerBtn.width / 2, passwordBg.y - _spacing);
        registerBtn.setTouchEnabled(true);
        this.loginView.addChild(registerBtn);
        // registerBtn.visible = false;

        var loginBtn = this._initItemInNode(0, "ĐĂNG NHẬP");
        loginBtn.scale = 0.65;
        loginBtn.setPosition(this.loginView.width / 2 + loginBtn.width / 2, passwordBg.y - _spacing);
        // loginBtn.setPosition(this.loginView.width / 2, passwordBg.y - _spacing);
        loginBtn.setTouchEnabled(true);
        this.loginView.addChild(loginBtn);
        this.loginBtn = loginBtn;

        //==============REMEMBER USER - PASS
        var checkbox = new HomeFixCheckbox("home_dialog_btn_checkbox.png", "home_icon_check.png", ccui.Widget.PLIST_TEXTURE);
        checkbox.setAnchorPoint(0, 0.5);
        checkbox.scale = 0.68;
        checkbox.setSelected(true);
        checkbox.setPosition(this.loginView.width / 2 - registerBtn.width + 50, loginBtn.y - _spacing + 30);
        this.loginView.addChild(checkbox);
        this.checkboxRemember = checkbox;
        this.checkboxRemember.visible = false;

        var content1 = "Lưu mật khẩu";
        var contentLabel1 = new cc.LabelTTF(content1, cc.res.font.Myriad_Pro_Regular, 23, cc.size(400, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        contentLabel1.setAnchorPoint(0, 0.5);
        contentLabel1.setPosition(checkbox.x + checkbox.width, checkbox.y);
        this.loginView.addChild(contentLabel1);
        contentLabel1.visible = false;

        //==============

        var quenmatkhauBtn = this._initItemInNode(1, "Quên mật khẩu?");
        quenmatkhauBtn.scale = 0.65;
        quenmatkhauBtn.setPosition(this.loginView.width / 2 + loginBtn.width / 2, loginBtn.y - _spacing + 30);
        quenmatkhauBtn.setTouchEnabled(true);
        quenmatkhauBtn.visible = false;
        this.loginView.addChild(quenmatkhauBtn);
        quenmatkhauBtn.visible = false;

        var content = "Chú ý: Đối với tài khoản đã kích hoạt OTP, có thể sử dụng số điện thoại đã đăng ký để đăng nhập thay cho Tên Đăng Nhập và Mật Khẩu.";
        var contentLabel = new cc.LabelTTF(content, cc.res.font.Myriad_Pro_Regular, 23, cc.size(500, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        contentLabel.setAnchorPoint(0.5, 1);
        contentLabel.setPosition(this.loginView.width / 2, quenmatkhauBtn.y - quenmatkhauBtn.height / 2);
        this.loginView.addChild(contentLabel);
        contentLabel.visible = false;
        //=============== INFO
        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 26);
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(contentLabel.x, contentLabel.y - _spacing);
        this.loginView.addChild(lb_info);
        this.lb_infoLogin = lb_info;

        var thiz = this;
        quenmatkhauBtn.addClickEventListener(function () {
            // thiz.hide();
            thiz._showRecoverPasswordDialog();
        });

        registerBtn.addClickEventListener(function () {
            thiz._initGUIs(1);

        });

        btnPhoneNumber.addClickEventListener(function () {
            thiz._initGUIs(2);
        });
    },

    inputNameDialog: null,
    showInputNameDialog: function (errorMessage) {
        if (!this.inputNameDialog) {
            this.inputNameDialog = new ccui.Widget();
            this.addChild(this.inputNameDialog);
            var blackBg = new cc.LayerColor(cc.color(0, 0, 0, 180), cc.winSize.width, cc.winSize.height);
            blackBg.setPosition(-cc.winSize.width / 2, -cc.winSize.height / 2);
            this.inputNameDialog.addChild(blackBg);

            var sprite = new cc.Sprite("#disconnect_bg.png");
            sprite.setScale(700 / sprite.width, 420 / sprite.height);
            this.inputNameDialog.addChild(sprite);

            this.mTouch = cc.rect(-350, -210, 700, 420);

            var titleLabel = MultiLanguage.createLabelTTFFont("Nhập tên hiển thị", cc.res.font.Myriad_Pro_Bold, 32);
            titleLabel.setPosition(0, 150);
            this.inputNameDialog.addChild(titleLabel);

            var inputNameBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
            inputNameBg.setPreferredSize(cc.size(500, 90));
            this.inputNameDialog.addChild(inputNameBg);

            var inputNameTF = new MultiLanguage.createNewUITextField("USER_NAME_TYPE", cc.size(400, 48),
                cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
            inputNameTF.setTextColor(cc.color(255, 255, 255));
            inputNameTF.setPlaceHolderColor(cc.color(145, 143, 144));
            inputNameTF.setPosition(inputNameBg.x, inputNameBg.y);
            this.inputNameDialog.addChild(inputNameTF);

            var errorLabel = MultiLanguage.createLabelTTFFont("* " + errorMessage, cc.res.font.Myriad_Pro_Bold, 22);
            errorLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            errorLabel.setFontFillColor(cc.color(255, 255, 0));
            errorLabel.setPosition(0, -70);
            errorLabel.setTag(5);
            errorLabel.visible = !!errorMessage;
            this.errorLabel = errorLabel;
            this.inputNameDialog.addChild(errorLabel);

            //
            var okBtn = this._initItemInNode(0, "ĐỒNG Ý");
            okBtn.scale = 0.65;
            okBtn.setPosition(0, -150);
            okBtn.setTouchEnabled(true);
            this.inputNameDialog.addChild(okBtn);
            //
            var thiz = this;
            okBtn.addClickEventListener(function () {
                if (thiz.checkInputNameDialogBeforeSend(inputNameTF.getText())) {
                    thiz.inputNameDialog.visible = false;
                    switch (cc.Global.LoginMethod) {
                        case cc.Global.LoginAcc:
                            break;
                        case cc.Global.LoginReg:
                            break;
                        case cc.Global.LoginFb:
                            SmartfoxClient.getInstance().sendLoginFacebook(cc.Global.getTokenFB(), inputNameTF.getText());
                            break;
                        case cc.Global.LoginGG:
                            SmartfoxClient.getInstance().sendLoginGoogle(cc.Global.getTokenGG(), inputNameTF.getText());
                            break;
                        case cc.Global.LoginMobile:
                            break;
                    }
                }
            });
        } else {
            this.inputNameDialog.visible = true;
            var errorLabel1 = this.inputNameDialog.getChildByTag(5);
            if (errorMessage) {
                if (errorLabel1) {
                    errorLabel1.visible = true;
                    errorLabel1.setString("* " + errorMessage);
                }
            }
            else {
                if (errorLabel1) {
                    errorLabel1.visible = false;
                }
            }
        }

    },
    checkInputNameDialogBeforeSend: function (value) {
        var validation = {
            isNotEmpty: function (str) {
                var pattern = /\S+/;
                return pattern.test(str);  // returns a boolean
            },
            isUserName: function (str) {
                var pattern = /^[A-Za-z][a-zA-Z0-9_.-]{5,24}$/;
                return pattern.test(str);
            }
        };

        if (!validation.isNotEmpty(value)) {
            this.errorLabel.setString(MultiLanguage.getTextByKey("Chưa nhập tên tài khoản!"));
            return false;
        } else if (!validation.isUserName(value)) {
            this.errorLabel.setString(MultiLanguage.getTextByKey("Tên tài khoản phải bắt đầu bằng chữ, từ 6 ký tự và không có ký tự đặc biệt!"));
            return false;
        }
        return true;
    },

    hide: function () {
        this.visible = false;
    },
    _initItemInNode: function (typeItem, text) {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(281, 91));

        var _fontName = cc.res.font.Myriad_Pro_Regular;
        var _imgBg = "home_btn_chuyentien.png";
        if (text === "ĐĂNG KÝ") {
            _imgBg = "home_btn_dangky.png";
            _fontName = cc.res.font.Myriad_Pro_Bold;
        } else if (text === "ĐĂNG NHẬP") {
            _imgBg = "home_btn_dangnhap.png";
            _fontName = cc.res.font.Myriad_Pro_Bold;
        }

        var bgItem = new ccui.Scale9Sprite(_imgBg, "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(node.width, node.height));
        bgItem.setPosition(node.width / 2, node.height / 2);
        node.addChild(bgItem);

        var label = new cc.LabelTTF(text, _fontName, 40);
        label.setName("NameNode");
        label.setPosition(node.width / 2, node.height / 2);
        node.addChild(label);

        if (text === "ĐĂNG KÝ" || text === "ĐĂNG NHẬP") {
            label.visible = false;
        }
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

    _showRecoverPasswordDialog: function () {
        var dialog = new HomePasswordDialog();
        dialog.show();
    }
});

var HomeFixCheckbox = ccui.Button.extend({
    ctor: function (normalTex, crossTex, texType) {
        if (!crossTex || (crossTex.length === 0)) {
            crossTex = normalTex;
        }
        this.normalTex = normalTex;
        this.texType = texType;
        this._super(normalTex, "", "", texType);
        this.setZoomScale(0);
        this._selected = false;
        var thiz = this;
        this.addClickEventListener(function () {
            thiz.setSelected(!thiz._selected);
        });

        if (texType === ccui.Widget.PLIST_TEXTURE) {
            crossTex = "#" + crossTex;
        }

        var crossSprite = new cc.Sprite(crossTex);
        crossSprite.setPosition(this.width / 2, this.height / 2);
        crossSprite.visible = false;
        this.addChild(crossSprite);
        this.crossSprite = crossSprite;
    },

    setSelected: function (isSelected) {
        this._selected = isSelected;
        this.crossSprite.visible = isSelected;
    },

    isSelected: function () {
        return !!this._selected;
    }
});
