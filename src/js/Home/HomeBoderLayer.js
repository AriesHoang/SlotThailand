var HomeBoderLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setAnchorPoint(cc.p(0.0, 0.0));

        var bg = new cc.Sprite("#bg_setting.png");
        bg.scaleX=350/bg.width;
        bg.scaleY=720/bg.height;
        this.setContentSize(350,720);
        bg.setPosition(this.width / 2, this.height / 2);
        this.addChild(bg);
        this.bg = bg;

        this._rectTouch = cc.rect(0, 0, this.width, this.height);
        this._showPosition = cc.p(0, 0);
        this._hidePosition = cc.p(-this.width, 0);

        this.setVisible(false);
    },

    onEnter: function () {
        this._super();

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return thiz.isVisible();
            },
            onTouchEnded: function (touch, event) {
                var p = thiz.convertToNodeSpace(touch.getLocation());
                if (!cc.rectContainsPoint(thiz._rectTouch, p)) {
                    thiz.hide();
                }
            }
        }, this);
    },

    onExit: function () {
        this._super();
        if (this._controller){
            this._controller.release();
            this._controller = null;
        }
    },

    show: function () {
        this.setVisible(true);
        this.stopAllActions();
        //this.setPosition(this._hidePosition);
        // this.runAction(new cc.EaseSineOut(new cc.MoveTo(0.3, this._showPosition)));
        this.setPosition(this._showPosition);
        // SoundPlayer.playSound("click-button", false);
    },

    hide: function () {
        var thiz = this;
        this.stopAllActions();
        // this.runAction(new cc.Sequence(new cc.EaseSineOut(new cc.MoveTo(0.3, this._hidePosition)), new cc.CallFunc(function () {
        //     thiz.setVisible(false);
        // })));

        this.setPosition(this._hidePosition);
        this.setVisible(false);
        // SoundPlayer.playSound("click-button", false);
    }
});