var HomeSupportDialog = CloseButtonDialog.extend({
    ctor: function () {
        this._super();
        var bg = new ccui.Scale9Sprite("home_dialog_bg_red.png");
        bg.setPreferredSize(cc.size(738, 400));
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

        this._initLabels();
        this._initButtons();

    },
    _initLabels: function () {
        var title = MultiLanguage.createLabelTTFFont("CUSTOMER_SUPPORT_TITLE", cc.res.font.Myriad_Pro_Regular, 45);
        title.setPosition(0, 160);
        this.addChild(title);

        var subTitle = MultiLanguage.createLabelTTFFont("CONTACT_US", cc.res.font.Myriad_Pro_Regular, 30);
        subTitle.setPosition(0, title.y - 60);
        this.addChild(subTitle);
    },
    _initButtons: function () {
        // var faceMessBtn = new ccui.Button("home_dialog_button_support.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var faceMessBtn = new ccui.Button("btn_confirm.png", "", "", ccui.Widget.PLIST_TEXTURE);
        faceMessBtn.setScale9Enabled(true);
        faceMessBtn.setCapInsets(cc.rect(40, 0, 2, 85));
        faceMessBtn.setContentSize(cc.size(504, 85));
        faceMessBtn.setPosition(0, 25);
        faceMessBtn.setZoomScale(0);
        faceMessBtn.visible = false;
        this.addChild(faceMessBtn);

        faceMessBtn.addClickEventListener(function () {
            // if (cc.sys.isNative) {
            //     cc.Application.getInstance().openURL(cc.Global.chatBot + PlayerMe.username);
            //     cc.log("URL " + cc.Global.chatBot + PlayerMe.username);
            // }
            // else
            //     window.open(cc.Global.chatBot + PlayerMe.username);
            cc.log("Hỗ trợ thanh toán");
        });

        var faceMessLabel = MultiLanguage.createLabelTTFFont("SEND_FEEDBACK_MESSAGE", cc.res.font.Myriad_Pro_Bold, 25);
        faceMessLabel.setPosition(faceMessBtn.width / 2, faceMessBtn.height / 2);
        faceMessLabel.enableStroke(cc.color("#000000"), 2);
        faceMessLabel.setPositionY(faceMessBtn.y + 5);
        faceMessBtn.addChild(faceMessLabel);

        // var callBtn = new ccui.Button("home_dialog_button_support.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var callBtn = new ccui.Button("btn_confirm.png", "", "", ccui.Widget.PLIST_TEXTURE);
        callBtn.setScale9Enabled(true);
        callBtn.setCapInsets(cc.rect(40, 0, 2, 85));
        callBtn.setContentSize(cc.size(504, 85));
        // callBtn.setPosition(0, -75);
        callBtn.setPosition(0, -25);
        // callBtn.setZoomScale(0);
        this.addChild(callBtn);


        var callLabel = MultiLanguage.createLabelTTFFont("Hotline: 0868.66.79.66", cc.res.font.Myriad_Pro_Bold, 25);
        // var callLabel = MultiLanguage.createLabelTTFFont(cc.Global.supportPhone.replace("tel:", "Hotline: "), cc.res.font.Myriad_Pro_Bold, 25);
        callLabel.setPosition(callBtn.width / 2, callBtn.height / 2);
        // callLabel.setPositionY(callBtn.y +150);
        callLabel.setPositionY(callBtn.y + 50);
        callLabel.enableStroke(cc.color("#000000"), 2);
        callBtn.addChild(callLabel);

        callBtn.addClickEventListener(function () {
            if (cc.sys.isNative) {
                // cc.Application.getInstance().openURL(cc.Global.supportPhone);
                cc.log("CALL");
                cc.Application.getInstance().openURL("tel:0868667966");
            }
        });


        var btnClose = new ccui.Button("home_dialog_button_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnClose.setPosition(370, 200);
        btnClose.setScale(.7);
        this.addChild(btnClose);

        var thiz = this;
        btnClose.addClickEventListener(function () {
            thiz.hide();
        })

    },
    initBtnClose: function () {

    }
});
