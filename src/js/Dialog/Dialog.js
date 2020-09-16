/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var IDialog = cc.Node.extend({
    ctor: function () {
        this._super();
        this._isShow = false;
        this.mTouch = cc.rect(0, 0, cc.winSize.width, cc.winSize.height);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        this._maxLeft = 0;
        this._maxRight = cc.winSize.width;
        this._maxBottom = 0;
        this._maxTop = cc.winSize.height;
        this._alphaColor = 0;
    },
    adjustlel: function () {

    },
    show: function (rootNode) {
        // SoundPlayer.playSound("click-button", false);
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
                this._bgColor = cc.color(0, 0, 0, this._alphaColor);
            }
            var colorLayer = new cc.LayerColor(this._bgColor, cc.winSize.width, cc.winSize.height);
            colorLayer.addChild(this);
            parentNode.addChild(colorLayer, 800);
            this.colorLayer = colorLayer;
        }
    },
    showWithAnimationScale: function () {
        IDialog.prototype.show.apply(this, arguments);

        var defaultScale = this.getScale();
        this.setScale(0.0);
        var scaleAction = new cc.EaseElasticOut(new cc.ScaleTo(0.3, defaultScale));
        this.runAction(scaleAction);
        // SoundPlayer.playSound("click-button", false);
    },
    showWithAnimationMove: function () {
        IDialog.prototype.show.apply(this, arguments);
        this.y = cc.winSize.height + this.getContentSize().height / 2;
        var moveAction = new cc.EaseBounceOut(new cc.MoveTo(0.7, cc.p(cc.winSize.width / 2, cc.winSize.height / 2)));
        this.runAction(moveAction);
        // SoundPlayer.playSound("click-button", false);
    },
    hide: function () {
        this._isShow = false;
        var parent = this.getParent();
        if (parent && !this.dontclosepoup) {
            this.removeFromParent(true);
            parent.removeFromParent(true);
        }
        // SoundPlayer.playSound("click-button", false);
    },

    isShow: function () {
        //return this._running;
        return this._isShow;
    },

    onTouchDialog: function () {

    },

    onExit: function () {
        this._super();
        this._isShow = false;
        if (this._controller)
            this._controller.release();
    },

    onEnter: function () {
        this._super();
        this._isShow = true;

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if (thiz._moveEnable) {
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if (cc.rectContainsPoint(thiz.mTouch, p)) {
                        thiz.onTouchDialog();
                        return true;
                    }
                    return false;
                }
                else {
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if (cc.rectContainsPoint(thiz.mTouch, p)) {
                        thiz._touchInside = true;
                        thiz.adjustlel();
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                if (thiz._moveEnable) {
                    thiz.moveDialog(touch.getDelta());
                }
            },
            onTouchEnded: function (touch, event) {
                if (thiz._moveEnable) {

                }
                else {
                    if (thiz._touchInside) {
                        thiz._touchInside = false;
                        return;
                    }
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if (!cc.rectContainsPoint(thiz.mTouch, p)) {
                        thiz.hide();
                    }
                }
                cc.log(thiz._moveEnable);
            }
        }, this);
    },

    moveDialog: function (ds) {
        this.x += ds.x;
        this.y += ds.y;
        if (this.x < this._maxLeft) {
            this.x = this._maxLeft;
        }
        if (this.x > this._maxRight) {
            this.x = this._maxRight;
        }
        if (this.y < this._maxBottom) {
            this.y = this._maxBottom;
        }
        if (this.y > this._maxTop) {
            this.y = this._maxTop;
        }
    },
    setLoading: function (isLoading) {
        this.loadingLayer && this.loadingLayer.hide();
        this.loadingLayer = null;
        if (isLoading) {
            var loadingPopup = new HomeLoadingPopup();
            loadingPopup.show(this);
            loadingPopup.colorLayer.setPosition(-loadingPopup.colorLayer.width / 2, -loadingPopup.colorLayer.height / 2);
            this.loadingLayer = loadingPopup;
        }
    }

});
