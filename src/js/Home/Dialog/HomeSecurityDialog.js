var HomeSecurityDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite();
        bg.visible = false;
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);
        this._initController();
        this.getChildByName("buttonBack").loadTextures("home_dialog_button_back_mail.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.getChildByName("buttonBack").setPosition(-568, 314);
        this._initSecureInfoView();
        this._initSecureLoginView();
        this._initGUIs();
        // this.setLoading(true);
    },
    _initController: function () {
        this._controller = new HomeSecurityController(this);
    },

    _initGUIs: function () {
        //    Item Thong Tin
        var itemSecureInfo = this._initItemInNode(0, "BẢO MẬT ĐĂNG NHẬP");
        itemSecureInfo.setPosition(-itemSecureInfo.width + 40, cc.winSize.height / 2 - itemSecureInfo.height / 2 - 10);
        itemSecureInfo.setTouchEnabled(true);
        this.addChild(itemSecureInfo);

//    Item Security Login
        var itemSecureLogin = this._initItemInNode(0, "CẬP NHẬT SỐ ĐIỆN THOẠI");
        itemSecureLogin.setPosition(itemSecureInfo.width, itemSecureInfo.y);
        itemSecureLogin.setTouchEnabled(true);
        itemSecureLogin.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
        itemSecureLogin.getChildByName("iconLight").visible = false;
        this.addChild(itemSecureLogin);

        var thiz = this;

        itemSecureInfo.addClickEventListener(function () {
            itemSecureInfo.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            itemSecureInfo.getChildByName("iconLight").visible = true;
            itemSecureLogin.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemSecureLogin.getChildByName("iconLight").visible = false;

            thiz.secureInfoView.visible = true;
            thiz.secureLoginView.visible = false;
            thiz.lb_info1.setString("");
        });

        itemSecureLogin.addClickEventListener(function () {
            itemSecureInfo.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemSecureInfo.getChildByName("iconLight").visible = false;
            itemSecureLogin.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            itemSecureLogin.getChildByName("iconLight").visible = true;

            thiz.secureInfoView.visible = false;
            thiz.secureLoginView.visible = true;
            thiz.lb_info.setString("");
        });

        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {

            itemSecureInfo.setPosition(-itemSecureInfo.width + 80, cc.winSize.height / 2 - itemSecureInfo.height / 2);
            itemSecureLogin.setPosition(itemSecureInfo.width, itemSecureInfo.y);
            this.getChildByName("buttonBack").setPosition(-430, 314);

            this.secureInfoView.setScale(cc.winSize.screenScale);
            this.secureLoginView.setScale(cc.winSize.screenScale);
            itemSecureLogin.setAnchorPoint(0.6, 0.5);
        }
    },

    //================================================================================
    //================================================================================
    //===============================SECURE INFO VIEW=================================
    //================================================================================
    //================================================================================
    _initSecureInfoView: function () {
        // cc.log("_initGiftCodeView");
        this.secureInfoView = new ccui.Widget();
        this.secureInfoView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height * 0.8));
        this.secureInfoView.y = -cc.winSize.height / 2 + this.secureInfoView.height / 2 + 30;
        this.addChild(this.secureInfoView);

        var line1 = new cc.Sprite("#seperate_line_baomat.png");
        line1.scaleY = 1.5;
        line1.setPosition(this.secureInfoView.width / 2, this.secureInfoView.height / 2);
        this.secureInfoView.addChild(line1);

        var _fontSize = 32;
        var _lb_x = this.secureInfoView.width / 4;
        var _lb_y = this.secureInfoView.height / 2 + 200;
        var _spacing = 100;

        var lb_intro = MultiLanguage.createLabelTTFFont("Cập nhật thông tin bảo mật OTP", cc.res.font.Myriad_Pro_Bold, _fontSize);
        lb_intro.setPosition(this.secureInfoView.width / 2, this.secureInfoView.height - lb_intro.height);
        this.secureInfoView.addChild(lb_intro);

        var _lb2_x = this.secureInfoView.width * 3 / 4;
        var _lb2_y = this.secureInfoView.height / 2 + 150;

        if (cc.winSize.height / cc.winSize.width === 4 / 3 || cc.winSize.height / cc.winSize.width === 3 / 4) {
            _lb_x = _lb_x - 50;
            _lb2_x = _lb2_x + 50;
        }

        //===============USER NAME

        var lb_username = MultiLanguage.createLabelTTFFont("Tài khoản ", cc.res.font.Myriad_Pro_Bold, _fontSize);
        lb_username.setAnchorPoint(cc.p(0, 0.5));
        lb_username.setPosition(_lb_x - lb_username.width, _lb_y);
        this.secureInfoView.addChild(lb_username);


        var fullName = new cc.LabelTTF(": " + PlayerMe.username || "username", cc.res.font.Myriad_Pro_Bold, _fontSize);
        fullName.setAnchorPoint(cc.p(0, 0.5));
        fullName.setFontFillColor(cc.color(255, 255, 89));
        fullName.setPosition(lb_username.x + lb_username.width, _lb_y);
        this.secureInfoView.addChild(fullName);

        //===============MOBILE NUMBER
        var mobileBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        mobileBg.setPreferredSize(cc.size(500, 80));
        mobileBg.setPosition(_lb_x, lb_username.y - _spacing + 10);
        this.secureInfoView.addChild(mobileBg);

        var mobileTF = new MultiLanguage.createNewUITextField("MOBILE_NUMBER_TYPE_HERE", cc.size(500, 45),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        mobileTF.setTextColor(cc.color(255, 255, 255));
        mobileTF.setPlaceHolderColor(cc.color(145, 143, 144));

        mobileTF.setPosition(mobileBg.x, mobileBg.y);
        this.secureInfoView.addChild(mobileTF);
        this.mobileTF = mobileTF;

        //===============OTP
        var otpBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        otpBg.setPreferredSize(cc.size(500, 80));
        otpBg.setPosition(mobileBg.x, mobileBg.y - _spacing);
        this.secureInfoView.addChild(otpBg);

        var otpTF = new MultiLanguage.createNewUITextField("OTP_TYPE_HERE", cc.size(500, 45),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        otpTF.setTextColor(cc.color(255, 255, 255));
        otpTF.setPlaceHolderColor(cc.color(145, 143, 144));

        otpTF.setPosition(otpBg.x, otpBg.y);
        this.secureInfoView.addChild(otpTF);
        this.otpTF = otpTF;

        //=============== INFO
        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 28);
        lb_info.setAnchorPoint(cc.p(0, 0.5));
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(otpBg.x - otpBg.width / 2, otpBg.y - _spacing + 10);
        this.secureInfoView.addChild(lb_info);
        this.lb_info1 = lb_info;

        //=============== BUTTON OK

        var xacnhanBtn = this._initItemInNode(2, "ĐỒNG Ý");
        xacnhanBtn.setPosition(otpBg.x, lb_info.y - _spacing + 10);
        xacnhanBtn.setTouchEnabled(true);
        xacnhanBtn.getChildByName("NameNode").setColor(cc.color(0, 0, 0));
        xacnhanBtn.getChildByName("iconLight").visible = false;
        this.secureInfoView.addChild(xacnhanBtn);
        var thiz = this;
        xacnhanBtn.addClickEventListener(function () {
            xacnhanBtn.setScale(1.05);
            setTimeout(function () {
                xacnhanBtn.setScale(1);
            }, 100);
            if (thiz._checkBeforeSubmit(mobileTF.getText(), otpTF.getText())) {
                var params = {
                    "1": mobileTF.getText(),
                    "2": otpTF.getText()
                };
                thiz._controller.sendVerifyPhone(params);
            }
        });

        //=============== RIGHT SIZE
        var _spacing2 = 70;
        var label1 = new cc.LabelTTF("Vui lòng soạn tin theo mẫu dưới để lấy mã OTP:", cc.res.font.Myriad_Pro_Regular, 23, cc.size(450, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label1.setPosition(_lb2_x, _lb2_y);
        this.secureInfoView.addChild(label1);

        var smsBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        smsBg.setPreferredSize(cc.size(500, 80));
        smsBg.setPosition(_lb2_x, label1.y - _spacing2);
        this.secureInfoView.addChild(smsBg);

        var labelSMS = new cc.LabelTTF("XYZ OTP gửi 8xxx", cc.res.font.Myriad_Pro_Regular, 30, cc.size(450, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        labelSMS.setFontFillColor(cc.color(255, 255, 89));
        labelSMS.setPosition(smsBg.x, smsBg.y);
        this.secureInfoView.addChild(labelSMS);

        var content = "Tài khoản đã kích hoạt bảo mật, có thể sử dụng số điện thoại để đăng nhập thay thế cho Username và Password.";
        var contentLabel = new cc.LabelTTF(content, cc.res.font.Myriad_Pro_Regular, 23, cc.size(450, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        contentLabel.setAnchorPoint(0.5, 1);
        contentLabel.setPosition(_lb2_x, smsBg.y - _spacing2 + 20);
        this.secureInfoView.addChild(contentLabel);

    },
    _checkBeforeSubmit: function (Phone, OTP) {
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

        if (!validation.isNotEmpty(Phone)) {
            this.lb_info1.setString(MultiLanguage.getTextByKey("VERIFYPHONE_PHONE_NOT_EMPTY"));
            return false;
        } else if (!validation.isNotEmpty(OTP)) {
            this.lb_info1.setString(MultiLanguage.getTextByKey("VERIFYPHONE_OTP_NOT_EMPTY"));
            return false;
        } else if (!validation.isNumber(Phone)) {
            this.lb_info1.setString(MultiLanguage.getTextByKey("VERIFYPHONE_PHONE_INVALID"));
            return false;
        }
        return true;
    },

    //================================================================================
    //================================================================================
    //================================SECURE LOGIN VIEW===============================
    //================================================================================
    //================================================================================
    _initSecureLoginView: function () {
        this.secureLoginView = new ccui.Widget();
        this.secureLoginView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height * 0.8));
        this.secureLoginView.y = -cc.winSize.height / 2 + this.secureLoginView.height / 2 + 30;
        this.addChild(this.secureLoginView);
        this.secureLoginView.visible = false;

        var line1 = new cc.Sprite("#seperate_line_baomat.png");
        line1.scaleY = 1.5;
        line1.setPosition(this.secureLoginView.width / 2, this.secureLoginView.height / 2);
        this.secureLoginView.addChild(line1);

        var _fontSize = 32;
        var _lb_x = this.secureLoginView.width / 4;
        var _lb_y = this.secureLoginView.height / 2 + 200;
        var _spacing = 100;

        var lb_intro = MultiLanguage.createLabelTTFFont("Cập nhật thông tin bảo mật OTP", cc.res.font.Myriad_Pro_Bold, _fontSize);
        lb_intro.setPosition(this.secureLoginView.width / 2, this.secureLoginView.height - lb_intro.height);
        this.secureLoginView.addChild(lb_intro);

        var _lb2_x = this.secureLoginView.width * 3 / 4;
        var _lb2_y = this.secureLoginView.height / 2 + 150;
        var _spacing2 = 70;

        if (cc.winSize.height / cc.winSize.width === 4 / 3 || cc.winSize.height / cc.winSize.width === 3 / 4) {
            _lb_x = _lb_x - 50;
            _lb2_x = _lb2_x + 50;
        }

        //===============USER NAME

        var lb_username = MultiLanguage.createLabelTTFFont("Tài khoản ", cc.res.font.Myriad_Pro_Bold, _fontSize);
        lb_username.setAnchorPoint(cc.p(0, 0.5));
        lb_username.setPosition(_lb_x - lb_username.width, _lb_y);
        this.secureLoginView.addChild(lb_username);

        var fullName = new cc.LabelTTF(": " + PlayerMe.username || "username", cc.res.font.Myriad_Pro_Bold, _fontSize);
        fullName.setAnchorPoint(cc.p(0, 0.5));
        fullName.setFontFillColor(cc.color(255, 255, 89));
        fullName.setPosition(lb_username.x + lb_username.width, lb_username.y);
        this.secureLoginView.addChild(fullName);

        //===============PHONE NUMBER

        var lb_phoneNumber = MultiLanguage.createLabelTTFFont("Số điện thoại ", cc.res.font.Myriad_Pro_Bold, _fontSize);
        lb_phoneNumber.setAnchorPoint(cc.p(0, 0.5));
        lb_phoneNumber.setPosition(_lb_x - lb_phoneNumber.width, _lb_y - _spacing + 40);
        this.secureLoginView.addChild(lb_phoneNumber);

        var phoneNumber = new cc.LabelTTF(": " + PlayerMe.phoneNumber, cc.res.font.Myriad_Pro_Bold, _fontSize);
        phoneNumber.setAnchorPoint(cc.p(0, 0.5));
        phoneNumber.setFontFillColor(cc.color(255, 255, 89));
        phoneNumber.setPosition(lb_phoneNumber.x + lb_phoneNumber.width, lb_phoneNumber.y);
        this.secureLoginView.addChild(phoneNumber);


        //===============TEXT FIELD MOBILE NUMBER
        var mobileBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        mobileBg.setPreferredSize(cc.size(500, 80));
        mobileBg.setPosition(_lb_x, lb_phoneNumber.y - _spacing + 20);
        this.secureLoginView.addChild(mobileBg);

        var mobileTF = new MultiLanguage.createNewUITextField("NEW_MOBILE_NUMBER_TYPE_HERE", cc.size(500, 45),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        mobileTF.setTextColor(cc.color(255, 255, 255));
        mobileTF.setPlaceHolderColor(cc.color(145, 143, 144));

        mobileTF.setPosition(mobileBg.x, mobileBg.y);
        this.secureLoginView.addChild(mobileTF);
        this.mobileTF1 = mobileTF;

        //===============OTP
        var otpBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        otpBg.setPreferredSize(cc.size(500, 80));
        otpBg.setPosition(mobileBg.x, mobileBg.y - _spacing);
        this.secureLoginView.addChild(otpBg);

        var otpTF = new MultiLanguage.createNewUITextField("OTP_TYPE_HERE", cc.size(500, 45),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        otpTF.setTextColor(cc.color(255, 255, 255));
        otpTF.setPlaceHolderColor(cc.color(145, 143, 144));

        otpTF.setPosition(otpBg.x, otpBg.y);
        this.secureLoginView.addChild(otpTF);
        this.otpTF1 = otpTF;

        //=============== INFO
        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 28);
        lb_info.setAnchorPoint(cc.p(0, 0.5));
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(otpBg.x - otpBg.width / 2, otpBg.y - _spacing + 10);
        this.secureLoginView.addChild(lb_info);
        this.lb_info = lb_info;

        //=============== BUTTON OK

        var xacnhanBtn1 = this._initItemInNode(2, "THAY ĐỔI SỐ ĐIỆN THOẠI");
        xacnhanBtn1.scale = 0.8;
        xacnhanBtn1.setPosition(otpBg.x, lb_info.y - _spacing + 10);
        xacnhanBtn1.setTouchEnabled(true);
        xacnhanBtn1.getChildByName("NameNode").setColor(cc.color(0, 0, 0));
        xacnhanBtn1.getChildByName("iconLight").visible = false;
        this.secureLoginView.addChild(xacnhanBtn1);

        //=============== RIGHT SIZE
        var label1 = new cc.LabelTTF("Để cập nhật SĐT mới vui lòng sử dụng số điện thoại mới để soạn tin:", cc.res.font.Myriad_Pro_Regular, 23, cc.size(450, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label1.setPosition(_lb2_x, _lb2_y);
        this.secureLoginView.addChild(label1);

        var smsBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        smsBg.setPreferredSize(cc.size(500, 80));
        smsBg.setPosition(_lb2_x, label1.y - _spacing2);
        this.secureLoginView.addChild(smsBg);

        var labelSMS = new cc.LabelTTF("XYZ OTP gửi 8xxx", cc.res.font.Myriad_Pro_Regular, 30, cc.size(450, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        labelSMS.setFontFillColor(cc.color(255, 255, 89));
        labelSMS.setPosition(smsBg.x, smsBg.y);
        this.secureLoginView.addChild(labelSMS);

        var thiz = this;

        xacnhanBtn1.addClickEventListener(function () {
            xacnhanBtn1.setScale(0.85);
            setTimeout(function () {
                xacnhanBtn1.setScale(0.8);
            }, 100);

            if (thiz._checkBeforeSubmit1(thiz.mobileTF1.getText(), thiz.otpTF1.getText())) {
                var params = {
                    "1": thiz.mobileTF1.getText(),
                    "2": thiz.otpTF1.getText()
                };
                thiz._controller.sendVerifyPhone(params);
            }
        });
    },

    _checkBeforeSubmit1: function (Phone, OTP) {
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

        if (!validation.isNotEmpty(Phone)) {
            this.lb_info.setString(MultiLanguage.getTextByKey("VERIFYPHONE_PHONE_NOT_EMPTY"));
            return false;
        } else if (!validation.isNotEmpty(OTP)) {
            this.lb_info.setString(MultiLanguage.getTextByKey("VERIFYPHONE_OTP_NOT_EMPTY"));
            return false;
        } else if (!validation.isNumber(Phone)) {
            this.lb_info.setString(MultiLanguage.getTextByKey("VERIFYPHONE_PHONE_INVALID"));
            return false;
        }
        return true;
    },

    _initItemInNode: function (typeItem, text) {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(300, 100));

        var bgItem = new ccui.Scale9Sprite("home_btn_chuyentien.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(node.width, node.height));
        bgItem.setPosition(node.width / 2, node.height / 2);
        node.addChild(bgItem);

        var label = new cc.LabelTTF(text, cc.res.font.Arial_Bold, 30);
        label.setName("NameNode");
        label.setColor(cc.color(252, 194, 81));
        label.setPosition(node.width / 2, node.height / 2);
        node.addChild(label);

        var borderItem = new cc.Sprite();
        borderItem.scale = 2;
        borderItem.setName("iconLight");
        borderItem.setPosition(node.width / 2, label.y - 20);
        node.addChild(borderItem);

        if (typeItem === 0) {
            borderItem.visible = true;
            bgItem.visible = false;
        } else if (typeItem === 1) {
            label.setFontSize(30);
            bgItem.setPreferredSize(cc.size(label.width * 1.5, label.height * 1.3));
        } else if (typeItem === 2) {
            label.setFontSize(30);
            bgItem.setPreferredSize(cc.size(label.width * 1.5, node.height));
        }

        return node;
    },

    onVerifyPhoneRespone: function (code) {
        var mess = "";
        if (code === 0) {
            if (this.secureInfoView.visible)
                this.lb_info1.setString(MultiLanguage.getTextByKey("VERIFYPHONE_PHONE_SUCCESS"));
            else if (this.secureLoginView.visible)
                this.lb_info.setString(MultiLanguage.getTextByKey("VERIFYPHONE_PHONE_SUCCESS"));

            var thiz = this;
            setTimeout(function () {
                var dialog = new HomeProfileDialog();
                dialog._showViewIndex(0);
                dialog.show();
                thiz.hideDialog();
            }, 500);

        } else {
            switch (code) {
                case -1801:
                    mess = "VERIFYPHONE_USER_NOT_FOUND";
                    break;
                case -1802:
                    mess = "VERIFYPHONE_VERIFIED_OTHER_PHONE";
                    break;
                case -1803:
                    mess = "VERIFYPHONE_VERIFIED_THIS_PHONE";
                    break;
                case -1804:
                    mess = "VERIFYPHONE_OTP_WRONG";
                    break;
                case -1805:
                    mess = "VERIFYPHONE_SYSTEM_ERROR";
                    break;
                case -1806:
                    mess = "VERIFYPHONE_OTHER_USER_VERIFIED";
                    break;
            }
        }
        if (this.secureInfoView.visible)
            this.lb_info1.setString(MultiLanguage.getTextByKey(mess));
        else if (this.secureLoginView.visible)
            this.lb_info.setString(MultiLanguage.getTextByKey(mess));
    }
});