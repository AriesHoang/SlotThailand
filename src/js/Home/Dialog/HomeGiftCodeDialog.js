var HomeGiftCodeDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite();
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

        this._initLabels();
        this._initGUIs();
        // this.setLoading(true);
    },


    _initLabels: function () {
        var title = MultiLanguage.createLabelTTFFont("GIFTCODE_TITLE", cc.res.font.Myriad_Pro_Regular, 64);
        title.enableStroke(cc.color("#00d8ff"), 2);
        title.setPosition(0, 197);
        this.addChild(title);

        var label1 = MultiLanguage.createLabelTTFFont("NOTE_1_GIFTCODE", cc.res.font.Myriad_Pro_Regular, 43);
        label1.enableStroke(cc.color("#ffffff"), 3);
        label1.setFontFillColor(cc.color("#000000"));
        label1.setPosition(0, -49);
        this.addChild(label1);

        var label2 = MultiLanguage.createLabelTTFFont("NOTE_2_GIFTCODE", cc.res.font.Myriad_Pro_Regular, 43);
        label2.enableStroke(cc.color("#ffffff"), 3);
        label2.setFontFillColor(cc.color("#000000"));
        label2.setPosition(0, -129);
        this.addChild(label2);
    },

    _initGUIs: function () {
        var textFieldBg = new ccui.Scale9Sprite("home_dialog_giftcode_bar.png", cc.rect(70, 0, 2, 117));
        textFieldBg.setPreferredSize(cc.size(864, 117));
        textFieldBg.setPosition(0, 48);
        this.addChild(textFieldBg);

        var giftCodeTF = new MultiLanguage.createNewUITextField("GIFTCODE_TYPE_HERE", cc.size(775, 48),
            cc.res.font.Myriad_Pro_Regular, 40, cc.res.font.Myriad_Pro_Regular, 40);
        giftCodeTF.setTextColor(cc.color("#000"));
        giftCodeTF.setPlaceHolderColor(cc.color("#000"));

        giftCodeTF.setPosition(0, 45);
        this.addChild(giftCodeTF);
        this.giftCodeTF = giftCodeTF;

        var nhanthuongBtn = new ccui.Button("home_dialog_btn_nhanthuong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        nhanthuongBtn.setPosition(0, -252);
        this.addChild(nhanthuongBtn);

        var label = MultiLanguage.createLabelTTFFont("RECEIVE_REWARD", cc.res.font.Myriad_Pro_Bold, 35, cc.size(220, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label.setPosition(nhanthuongBtn.width / 2, nhanthuongBtn.height / 2 + 15);
        label.color = cc.color("#fefb85");
        nhanthuongBtn.addChild(label);

        var thiz = this;
        nhanthuongBtn.addClickEventListener(function () {
            thiz.setLoading(true);
            thiz.nhanThuongBtnHandler();
        })
    },

    nhanThuongBtnHandler: function () {
        // cc.log("nhanThuongBtnHandler : " + this.giftCodeTF.getText());
        this._controller.sendGiftCode(this.giftCodeTF.getText());
        // if (cc.sys.isNative) {
        //     // KingIDSDK.getInstance().enterPromotionCode(this.giftCodeTF.getText(), this._getGiftCodeCallback, this);
        // }
    },
    _getGiftCodeCallback: function (isSuccess, result) {
        if (isSuccess) {
            // var code = result["error_code"];
            var mess = result["errorMessage"];

            this.giftCodeTF.setText(mess);
            this.giftCodeTF.setTextColor((code == 0) ? cc.color("#079904") : cc.color("#ff0000"));

            var thiz = this;
            setTimeout(function () {
                thiz.giftCodeTF.setText("");
                thiz.giftCodeTF.setTextColor(cc.color("#000000"));
            }, 2500);
        }
        this.setLoading(false);
    }
});