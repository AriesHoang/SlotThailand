var HomeLoadingPopup = cc.Node.extend({
    ctor: function () {
        this._super();
        this._initGUI();
    },
    _initGUI: function () {
        var loading = new cc.Sprite("#home_loading_indicator.png");
        var rotateAction = new cc.RotateBy(1, 360);
        loading.runAction(new cc.RepeatForever(rotateAction));

        this.addChild(loading);
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
    show: function (rootNode, timeout) {
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
            parentNode.addChild(colorLayer, 99);
            this.colorLayer = colorLayer;
        }

        var thiz = this;
        setTimeout(function () {
            if (thiz._isShow) {
                thiz.hide();
                var popup = new HomeNotifyPopup();
                popup.showNotification(MultiLanguage.getTextByKey("DISCONECT_NOTIFY"));
            }
        }, timeout || 5000);
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