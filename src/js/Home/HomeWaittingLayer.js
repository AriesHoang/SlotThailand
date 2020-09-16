var HomeWaittingLayer = (function () {
    var instance = null;
    var WaittingLayer = cc.Node.extend({
        ctor: function () {
            this._super();

            var bg = new ccui.Layout();
            bg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            bg.setBackGroundColor(cc.color(0, 0, 0));
            bg.setBackGroundColorOpacity(100);
            bg.setTouchEnabled(true);
            bg.setFocusEnabled(false);
            bg.setPosition(-cc.winSize.width / 2, -cc.winSize.height / 2);
            bg.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
            this.addChild(bg);

            this._callback = null;
        },

        initAnimation: function () {
            var base = cc.p(-93, 0);
            var offset = 38;
            var numberOfDot = 6;
            for (var i = 0; i < numberOfDot; i++) {
                var sprite = new cc.Sprite("#home_loading_dot.png");
                sprite.setPosition(base.x + offset * i, base.y);
                this.addChild(sprite);

                var seed = i / numberOfDot;
                sprite.setScale(seed);
                var initAction = cc.scaleTo(0.4 - seed * 0.4, 1);
                var scaleBy = cc.scaleBy(0.4, 0.2);
                // var scaleUp = cc.scaleTo(0.4, 1);
                // var scaleDown = cc.scaleTo(0.4, 0.2);
                // var delayAction = cc.delayTime(0.1);
                // var action = cc.sequence(scaleDown, delayAction, scaleUp);
                var loopAction = cc.sequence(scaleBy, scaleBy.reverse()).repeatForever();
                (function (sp, ia, la) {
                    sp.runAction(cc.sequence(
                        ia,
                        cc.callFunc(function () {
                            sp.runAction(la);
                        })
                    ));
                })(sprite, initAction, loopAction);
            }
        },

        show: function (parent) {
            this.hide();
            parent = parent || cc.director.getRunningScene();
            this.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.initAnimation();
            parent.addChild(this, 1000);

            var thiz = this;
            this.autoHide = setTimeout(function () {
                thiz.hide();
            }, 2000);
        },

        hide: function () {
            if(this.autoHide){
                clearTimeout(this.autoHide);
                this.autoHide = null;
            }

            var currentParent = this.getParent();
            if (currentParent)
                currentParent.removeChild(this);
        },

        setCallback: function (fn) {
            this._callback = fn;
        }
    });

    return {
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            if (!instance) {
                instance = new WaittingLayer();
                instance.retain();
            }
            return instance;
        }
    };
})();