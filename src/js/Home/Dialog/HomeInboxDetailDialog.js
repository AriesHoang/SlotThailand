var HomeInboxDetailDialog = IDialog.extend({
    ctor: function (title, content) {
        this._super();

        var blackBg = new cc.LayerColor(cc.color(0, 0, 0, 204), cc.winSize.width, cc.winSize.height);
        blackBg.setPosition(-cc.winSize.width / 2, -cc.winSize.height / 2);
        // this.addChild(blackBg);


        var bgnew = new ccui.ImageView("bg_popup.png", ccui.Widget.PLIST_TEXTURE);
        bgnew.ignoreContentAdaptWithSize(false);
        bgnew.setScale9Enabled(true);
        bgnew.setContentSize(cc.winSize.width, cc.winSize.height);
        //bgnew.setOpacity(200);
        this.addChild(bgnew);
        this._alphaColor = 0;

        this.initBackground();

        var tipLabel = MultiLanguage.createLabelTTFFont("MAIL_NOTIFY", cc.res.font.Myriad_Pro_Bold, 24);
        tipLabel.enableStroke(cc.color("#ffffff"), 2);
        tipLabel.setPosition(0, 213);
        // this.addChild(tipLabel);

        var titleLabel = new cc.LabelTTF(title, cc.res.font.Myriad_Pro_Regular, 32);
        titleLabel.setPosition(0, 300);
        this.addChild(titleLabel);

        var contentLabel = new cc.LabelTTF(content, cc.res.font.Myriad_Pro_Regular, 28, cc.size(450, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.addChild(contentLabel);


    },

    initBackground: function () {
        var sprite = new cc.Sprite();
        sprite.setScale(700 / sprite.width, 420 / sprite.height);

        this.mTouch = cc.rect(0, 0, 0, 0);

        var mail = new cc.Sprite();
        mail.setPosition(-284, 141);

        var BtnOk = new ccui.Button("home_dialog_button_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        BtnOk.setPosition(568, 314);
        BtnOk.setScale(.68);
        this.addChild(BtnOk);
        if (cc.winSize.height / cc.winSize.width == 4 / 3 || cc.winSize.height / cc.winSize.width == 3 / 4) {
            BtnOk.setPosition(350, 300);
        }

        var label = MultiLanguage.createLabelTTFFont("DONE", cc.res.font.Myriad_Pro_Bold, 30);
        label.setPosition(BtnOk.width / 2, BtnOk.height / 2 + 15);
        label.color = cc.color("#fefb85");
        // BtnOk.addChild(label);

        var thiz = this;
        BtnOk.addClickEventListener(function () {
            thiz.inboxDialog.visible = true;
            thiz.hide();
        });

    },
    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            }
        }, this);
        this._isShow = true;
    }
});