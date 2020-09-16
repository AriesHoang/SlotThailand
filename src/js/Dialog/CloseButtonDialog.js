var CloseButtonDialog = IDialog.extend({
    ctor: function () {
        this._super();


        this.initBtnClose();

    },

    initBtnClose: function () {
        var btnClose = new ccui.Button("home_dialog_button_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnClose.setPosition(508, 202);
        this.addChild(btnClose);

        var thiz = this;
        btnClose.addClickEventListener(function () {
            thiz.hide();
        })
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