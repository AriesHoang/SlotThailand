var SlotHero = SlotHero || {};

(function () {
    SlotHero.Popup = cc.Node.extend({
        ctor: function (width, height) {
            this._super();
            width = width || 1190;
            height = height || 673;
            // var border = new ccui.Scale9Sprite("SlotHero_popup_border.png", cc.rect(30, 30, 2, 2));
            // border.setPreferredSize(cc.size(width, height));
            // this.setContentSize(cc.size(width, height));
            // border.setPosition(this.width / 2, this.height / 2);

            var mainLayer = new ccui.Layout();
            mainLayer.setContentSize(this.width - 10,this.height - 10);
            mainLayer.setAnchorPoint(0.5,0.5);
            mainLayer.setClippingEnabled(true);
            mainLayer.setPosition(this.width/2,this.height/2);
            this.mainLayer = mainLayer;

            this.addChild(mainLayer);
            // this.addChild(border);

            var closeBtn = new ccui.Button("slotwomenagent_popup_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
            closeBtn.setPosition(this.width - 60, this.height - 60);
            this.addChild(closeBtn);
            this._exitCallback = null;
            this._exitCallbackTarget = null;
            var thiz = this;
            closeBtn.addClickEventListener(function () {
                thiz.removeFromParent();
            });

            this.setAnchorPoint(cc.p(0.5,0.5));
        },

        setExitCallback: function (fn, target) {
            this._exitCallback = fn;
            this._exitCallbackTarget = target;
        },

        onExit: function () {
            this._super();
            if (this._exitCallback && typeof (this._exitCallback) === "function")
                this._exitCallback.call(this._exitCallbackTarget);

            if (this._controller){
                this._controller.releaseController();
                this._controller = null;
            }
        }
    });
})();
