var SlotAladdinFloatButton = (function () {
    var instance = null;

    var SlotAladdinExpandedFloatBtn = cc.Node.extend({
        ctor: function () {
            this._super();

            var bg = new cc.Sprite("#home_floatExpandedBg.png");
            this.addChild(bg);
            this.setScale(cc.sys.isNative ? (cc.view.getDesignResolutionSize().width / (1280)) : (cc.winSize.screenScale * cc.view.getDesignResolutionSize().width) / (1280));
            this.touchRect = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);
            this._pos = [
                cc.p(70, 250),
                cc.p(270, 70),
                cc.p(160, -80),
                cc.p(-80, 70),
                cc.p(0, -80)
            ];
            this.initMinigameList();

        },

        initMinigameList: function () {
            var listMinigame = cc.GlobalSlotAladdin.miniGameData;
            for (var i = 0; i < listMinigame.length; i++) {
                var icon = this.createMiniGameButton(listMinigame[i], this._pos[i]);
                this.addChild(icon);
            }
        },
        createMiniGameButton: function (item, pos) {
            var icon = item.iconUrl;
            var button = new ccui.Button(icon, "", "", ccui.Widget.PLIST_TEXTURE);
            button.scale = 0.6;
            var iconWidget = new ccui.Widget();
            iconWidget.setContentSize(button.width, button.height);
            iconWidget.addChild(button);
            button.setPosition(pos);
            button.setTouchEnabled(item.isReady);
            button.setColor(item.isReady ? cc.color(255, 255, 255, 255) : cc.color(100, 100, 100, 255));

            var loadingText = new cc.LabelTTF("", "Arial", 20);
            loadingText.setPosition(button.x, button.y);
            loadingText.setString(item.isReady ? "" : "03/2018");
            iconWidget.addChild(loadingText);

            var thiz = this;
            button.addClickEventListener(function () {
                SceneNavigator.startGame(item.id);

                var status = HomeDownloadManager.getInstance().getModuleStatus(SceneNavigator.ModuleProperties[item.id].moduleName);
                if (status.progress === 100 && status.isDownloading === false) {
                    thiz.removeFromParent();
                }
            });

            // add load process
            var loadingProgress = new cc.Node();
            loadingProgress.setPosition(item.width - 45, 60);
            loadingProgress.visible = false;

            loadingProgress.item = item;

            loadingProgress.onLoadModule = function (moduleName, progress, isDownloading) {
                loadingText.enableStroke(cc.color(0, 0, 0), 2);
                loadingText.setString(progress + "%");
                loadingProgress.visible = !(progress === 100 && isDownloading === false);
                if (progress === 100 && isDownloading === false) {
                    setTimeout(function () {
                        thiz.removeFromParent();
                        SceneNavigator.startGame(item.id);
                    }, 100);
                }
            };

            loadingProgress.onEnter = function () {
                cc.Node.prototype.onEnter.apply(loadingProgress);
                if (!SceneNavigator.ModuleProperties[item.id])
                    return;
                var moduleName = SceneNavigator.ModuleProperties[item.id].moduleName;
                HomeDownloadManager.getInstance().removeListener(loadingProgress);
                HomeDownloadManager.getInstance().addDownloadStatusListener(
                    moduleName,
                    loadingProgress.onLoadModule, loadingProgress);

                var status = HomeDownloadManager.getInstance().getModuleStatus(moduleName);
                if (status.progress < 100 && status.isDownloading)
                    loadingProgress.visible = true;
            };

            loadingProgress.onExit = function () {
                cc.Node.prototype.onExit.apply(loadingProgress);
                HomeDownloadManager.getInstance().removeListener(loadingProgress);
            };

            iconWidget.addChild(loadingProgress);

            return iconWidget;
        },

        onEnter: function () {
            this._super();
            var thiz = this;
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if (!cc.rectContainsPoint(thiz.touchRect, p)) {
                        setTimeout(function () {
                            thiz.removeFromParent();
                        }, 10);
                    }
                    return true;
                }
            }, this);
        },

        onExit: function () {
            SlotAladdinFloatButton.getInstance().collapse();
            this._super();
        }
    });

    var SlotAladdinFloatButtonClass = cc.Node.extend({
        ctor: function () {
            if (instance) {
                throw "Can't create a new instance of a singleton class";
            }

            this._super();

            var bg = new cc.Sprite("#slotaladdin_minigame_btn.png");

            this.addChild(bg);
            this.bg = bg;

            this.boundingSize = bg.getContentSize();
            this.touchRect = cc.rect(-this.boundingSize.width / 2, -this.boundingSize.height / 2,
                this.boundingSize.width, this.boundingSize.height);
            this.expanded = false;

            //
            this.x = cc.winSize.width;
            this.y = cc.winSize.height;
        },

        onEnter: function () {
            this._super();
            this.isTouch = false;

            var thiz = this;
            cc.eventManager.addListener({

                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    // SlotAladdinSoundPlayer.playSound("spin_button_press", false);
                    if (thiz.isTouch) {
                        return false;
                    }
                    var b = thiz.onTouchBegan(touch, event);
                    if (b) {
                        thiz.isTouch = true;
                    }
                    return b;
                },
                onTouchMoved: function (touch, event) {
                    //Không cho move trong game đề phòng user lợi dụng để che số tiền --> lừa đảo =))
                    // thiz.onTouchMoved(touch, event);
                },
                onTouchEnded: function (touch, event) {
                    thiz.isTouch = false;
                    thiz.onTouchEnded(touch, event);
                }
            }, this);

        },

        onTouchBegan: function (touch, event) {
            if (!this.visible)
                return false;

            var p = this.convertToNodeSpace(touch.getLocation());
            if (cc.rectContainsPoint(this.touchRect, p)) {
                this.startLocation = touch.getLocation();
                this.isMoved = false;
                this.stopAllActions();
                return true;
            } else {
                this.collapse();
                return false;
            }
        },

        onTouchMoved: function (touch, event) {
            var p = touch.getLocation();
            if (!this.isMoved) {
                if (cc.pDistance(this.startLocation, p) >= 10) {
                    this.isMoved = true;
                }
            }

            var x = this.x + (p.x - this.startLocation.x);
            var y = this.y + (p.y - this.startLocation.y);
            //fix position
            var left = x - this.boundingSize.width / 2;
            var right = x + this.boundingSize.width / 2;
            var top = y + this.boundingSize.height / 2;
            var bottom = y - this.boundingSize.height / 2;
            if (left < 0) {
                x = this.boundingSize.width / 2;
            }
            if (right > cc.winSize.width) {
                x = cc.winSize.width - this.boundingSize.width / 2;
            }
            if (bottom < 0) {
                y = this.boundingSize.height / 2;
            }
            if (top > cc.winSize.height) {
                y = cc.winSize.height - this.boundingSize.height / 2;
            }

            this.x = x;
            this.y = y;
            this.startLocation = p;

        },

        onTouchEnded: function (touch, event) {
            if (this.isMoved) {
                this.moveToBorder();
            } else {
                this.expanded ? this.collapse() : this.expand();
            }
        },

        moveToBorder: function () {
            this.stopAllActions();

            var left = this.boundingSize.width / 2;
            var right = cc.winSize.width - left;
            var bottom = this.boundingSize.height / 2;
            var top = cc.winSize.height - bottom;

            var x = this.x;
            if (x < left) {
                x = left;
            }
            if (x > right) {
                x = right;
            }

            var y = this.y;
            if (y < bottom) {
                y = bottom;
            }
            if (y > top) {
                y = top;
            }

            var dx1 = Math.abs(x - left);
            var dx2 = Math.abs(x - right);
            var dx = dx1 < dx2 ? dx1 : dx2;

            var dy1 = Math.abs(y - bottom);
            var dy2 = Math.abs(y - top);
            var dy = dy1 < dy2 ? dy1 : dy2;

            if (dx < dy) {
                if (dx1 < dx2) {
                    this.runAction(new cc.MoveTo(0.2, cc.p(left, y)));
                }
                else {
                    this.runAction(new cc.MoveTo(0.2, cc.p(right, y)));
                }
            }
            else {
                if (dy1 < dy2) {
                    this.runAction(new cc.MoveTo(0.2, cc.p(x, bottom)));
                }
                else {
                    this.runAction(new cc.MoveTo(0.2, cc.p(x, top)));
                }
            }

        },

        show: function (parent) {
            this.hide();

            parent = parent || cc.director.getRunningScene();
            parent.addChild(this, 500);

            this.bg.setSpriteFrame("slotaladdin_minigame_btn.png");

            this.moveToBorder();
        },

        hide: function () {
            var currentParent = this.getParent();
            if (currentParent)
                currentParent.removeChild(this);
        },

        expand: function () {
            this.expanded = true;
            this.visible = false;
            var expandedNode = new SlotAladdinExpandedFloatBtn();
            var parent = this.getParent();
            parent = parent || cc.director.getRunningScene();
            if (parent.expandedNode) {
                parent.expandedNode.removeFromParent();
            }
            var p = parent.convertToNodeSpace(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
            expandedNode.setPosition(p);
            parent.addChild(expandedNode, 999);
            parent.expandedNode = expandedNode;
        },

        collapse: function () {
            this.expanded = false;
            this.visible = true;
            var parent = this.getParent();
            parent = parent || cc.director.getRunningScene();
            if (parent.expandedNode) {
                parent.expandedNode = null;
            }
        }
    });

    SlotAladdinFloatButtonClass.getInstance = function () {
        if (!instance) {
            instance = new SlotAladdinFloatButtonClass();
            instance.retain();
        }
        return instance;
    };

    return SlotAladdinFloatButtonClass;

})();
