var MiniGameNavigator = MiniGameNavigator || {};
MiniGameNavigator.allGame = [];

MiniGameNavigator.createGameLayer = function (gameId) {
    if (gameId === SceneNavigator.GameId.MiniGame_Poker)
        return new MiniPokerGameLayer();

    if (gameId === SceneNavigator.GameId.MiniGame_CaoThap) {
        return new CaoThapGameLayer();
    }

    if (gameId === SceneNavigator.GameId.MiniGame_TaiXiu) {
        return new TaiXiuLayer();
    }

    if (gameId === SceneNavigator.GameId.MiniGame_PhucSinh)
        return new PhucSinhGameLayer();

    if (gameId === SceneNavigator.GameId.MiniGame_TuLinh) {
        return new TuLinhLayer();
    }

};

MiniGameNavigator.showAll = function () {
    for (var i = 0; i < MiniGameNavigator.allGame.length;) {
        var miniGame = MiniGameNavigator.allGame[i];
        miniGame.show();
        i++;
    }
};

MiniGameNavigator.focus = function (view) {
    setTimeout(function () {
        var index = MiniGameNavigator.allGame.indexOf(view);
        MiniGameNavigator.allGame.splice(index, 1);
        MiniGameNavigator.allGame.push(view);
        for (var i = 0; i < MiniGameNavigator.allGame.length; i++) {
            MiniGameNavigator.allGame[i].changeLayerOrder(i);
        }
        HomeFloatButton.getInstance().collapse();
    }, 0);
};

MiniGameNavigator.hideAll = function () {
    for (var i = 0; i < MiniGameNavigator.allGame.length; i++) {
        MiniGameNavigator.allGame[i].hide();
        MiniGameNavigator.allGame[i].release();
    }
    MiniGameNavigator.allGame = [];
};

MiniGameNavigator.showGame = function (gameId, position) {
    for (var i = 0; i < MiniGameNavigator.allGame.length; i++) {
        var miniGame = MiniGameNavigator.allGame[i];
        if (miniGame.gameType === gameId) {
            if (miniGame.isRunning()) {
                // cc.log("MiniGame " + gameId + " is running !!!");
            }
            else {
                miniGame.show();
                if (position) {
                    miniGame.setPosition(position);
                }
            }
            return;
        }
    }

    var newMiniGame = MiniGameNavigator.createGameLayer(gameId);
    MiniGameNavigator.allGame.push(newMiniGame);
    newMiniGame.show();
    if (position) {
        miniGame.setPosition(position);
    }
    newMiniGame.retain();
};

MiniGameNavigator.hideGame = function (gameId) {
    for (var i = 0; i < MiniGameNavigator.allGame.length; i++) {
        var miniGame = MiniGameNavigator.allGame[i];
        if (miniGame.gameType === gameId) {
            MiniGameNavigator.allGame.splice(i, 1);
            miniGame.hide();
            miniGame.release();
            // miniGame.removeFromParent();
            return;
        }
    }
};

var HomeMiniGamePopup = cc.Node.extend({
    ctor: function () {
        this._super();
        var x = 30 - Math.random() * 60;
        var y = 30 - Math.random() * 60;
        this.setPosition(cc.winSize.width / 2 + x, cc.winSize.height / 2 + y);
        this._boudingRect = cc.rect(-400, -300, 800, 600); //
    },

    onEnter: function () {
        this._super();

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return thiz.onTouchBegan(touch, event);
            },
            onTouchMoved: function (touch, event) {
                thiz.onTouchMoved(touch, event);
            },
            onTouchEnded: function (touch, event) {
                thiz.onTouchEnded(touch, event);
            }
        }, this);
        MiniGameNavigator.focus(this);
    },

    onExit: function () {
        this._super();
        if (this._controller)
            this._controller.releaseController();
        this._controller = null;
    },

    onTouchBegan: function (touch, event) {
        if (this._touchStartPoint) {
            return false;
        }

        this._touchStartPoint = touch.getLocation();
        var p = this.convertToNodeSpace(this._touchStartPoint);
        if (cc.rectContainsPoint(this._boudingRect, p)) {
            MiniGameNavigator.focus(this);
            return true;
        }
        this._touchStartPoint = null;
        return false;
        // return true;
    },

    onTouchMoved: function (touch, event) {
        if (!this._touchStartPoint) {
            return;
        }
        var p = touch.getLocation();
        this.moveNode(cc.p(p.x - this._touchStartPoint.x, p.y - this._touchStartPoint.y));
        this._touchStartPoint = p;
    },

    onTouchEnded: function (touch, event) {
        this._touchStartPoint = null;
    },

    moveNode: function (ds) {
        this.x += ds.x;
        this.y += ds.y;

        var lb = this.convertToWorldSpace(cc.p(this._boudingRect.x, this._boudingRect.y));
        var rt = this.convertToWorldSpace(cc.p(this._boudingRect.x + this._boudingRect.width, this._boudingRect.y + this._boudingRect.height));

        if (lb.x < 0) {
            this.x -= lb.x;
        }
        if (rt.x > cc.winSize.width) {
            this.x -= (rt.x - cc.winSize.width);
        }
        if (lb.y < 0) {
            this.y -= lb.y;
        }
        if (rt.y > cc.winSize.height) {
            this.y -= (rt.y - cc.winSize.height);
        }
    },

    show: function () {
        var parent = this.getParent();
        if (parent) {
            this.removeFromParent(true);
        }

        var runningScene = cc.director.getRunningScene();
        if (runningScene) {
            if (runningScene.popupLayer) {
                runningScene.popupLayer.addChild(this, 100);
            }
            else {
                runningScene.addChild(this, 100);
            }
        }
    },

    changeLayerOrder: function (order) {
        var thiz = this;
        var mParent = thiz.getParent();
        if (mParent) {
            this.setLocalZOrder((order + 1) * 100);
        }
    },

    backToHomeScene: function () {
        MiniGameNavigator.hideGame(this.gameType);
    },

    hide: function () {
        this._controller && this._controller.releaseController();
        var parent = this.getParent();
        if (parent) {
            this.removeFromParent(true);
            // parent.removeFromParent(true)
        }
    },

    closeButtonHandler: function () {
        // this.hide();
        MiniGameNavigator.hideGame(this.gameType);
    }
});