var HomeNotifyPopup = cc.Node.extend({
    ctor: function () {
        this._super();

        var blackBg = new cc.LayerColor(cc.color(0, 0, 0, 204), cc.winSize.width, cc.winSize.height);
        blackBg.setPosition(-cc.winSize.width / 2, -cc.winSize.height / 2);
        this.addChild(blackBg);

        this.initBackground();
        var titleLabel = MultiLanguage.createLabelTTFFont("NOTIFICATION", cc.res.font.Myriad_Pro_Bold, 32);
        titleLabel.setPosition(0, 140);
        this.addChild(titleLabel);

        var contentLabel = new cc.LabelTTF("", cc.res.font.Myriad_Pro_Regular, 28, cc.size(450, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.addChild(contentLabel);

        this.contentLabel = contentLabel;
    },

    initBackground: function () {
        // var sprite = new cc.Sprite("#home_dialog_bg_texture_light_only.png");
        var sprite = new cc.Sprite("#disconnect_bg.png");
        sprite.setScale(700 / sprite.width, 420 / sprite.height);
        this.addChild(sprite);

        this.mTouch = cc.rect(-350, -210, 700, 420);

        // var mail = new cc.Sprite("#home_icon_notify.png");
        // mail.setPosition(-284, 141);
        // this.addChild(mail);

        // var BtnOk = new ccui.Button("home_dialog_btn_nhanthuong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var BtnOk = new ccui.Button("btn_confirm.png", "", "", ccui.Widget.PLIST_TEXTURE);
        BtnOk.setPosition(0, -140);
        // BtnOk.setScale(.6);
        this.addChild(BtnOk);

        var label = MultiLanguage.createLabelTTFFont("DONE", cc.res.font.Myriad_Pro_Bold, 25);
        label.setPosition(BtnOk.width / 2, BtnOk.height / 2 - 5);
        label.enableStroke(cc.color(0, 0, 0, 255), 1);
        BtnOk.addChild(label);

        var thiz = this;
        BtnOk.addClickEventListener(function () {
            thiz.hide();
        });
    },
    showNotification: function (content) {
        this.contentLabel.setString(content);
        this.show();
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
    },
    show: function (rootNode) {
        this._isShow = true;
        var parentNode = this.getParent();
        if (parentNode) {
            this.removeFromParent(true);
            parentNode.removeFromParent(true);
            parentNode = null;
        }

        if (!rootNode) {
            rootNode = cc.director.getRunningScene();
        }

        if (rootNode) {
            if (rootNode.popupLayer) {
                parentNode = rootNode.popupLayer;
            }
            else {
                parentNode = rootNode;
            }

            this.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            if (!this._bgColor) {
                this._bgColor = cc.color(0, 0, 0, 180);
            }
            var colorLayer = new cc.LayerColor(this._bgColor, cc.winSize.width, cc.winSize.height);
            colorLayer.addChild(this);
            parentNode.addChild(colorLayer, 1000);
            this.colorLayer = colorLayer;
        }
    },
    hide: function () {
        this._isShow = false;
        var parent = this.getParent();
        if (parent && !this.dontclosepoup) {
            this.removeFromParent(true);
            parent.removeFromParent(true);
        }
    }
});