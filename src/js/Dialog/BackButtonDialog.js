var BackButtonDialog = IDialog.extend({
    ctor: function () {
        this._super();

        var bgDialog = new ccui.Scale9Sprite("bg_popup.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgDialog.setPreferredSize(cc.size(cc.winSize.width, cc.winSize.height));
        this.addChild(bgDialog);

        this.initBackButton();
    },

    hideDialog: function () {
        this.hide();
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
    onExit: function () {
        this._super();
        // cc.log("remove controller");
        if (this._controller) {
            this._controller.release();
            this._controller = null;
        }
    },
    initBackButton: function () {
        var btnBack = new ccui.Button("home_dialog_button_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnBack.scale = 0.68;
        btnBack.setName("buttonBack");
        btnBack.setPosition(568, 314);

        this.addChild(btnBack, 99);

        var thiz = this;
        btnBack.addClickEventListener(function () {
            thiz.hide();
        });

        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {
            // this.setScale(cc.winSize.screenScale);
            btnBack.setPosition(-420, 314);

        }
    }
});