var HomeFloatButton = (function () {
    var instance = null;

    var ExpandedFloatBtn = cc.Node.extend({
        ctor: function () {
            this._super();

            // var bg = new cc.Sprite("#btn_minigame.png");
            // bg.scale=0.68;
            // this.addChild(bg);
            //
            // this.initButtons();
            // this.touchRect = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

            var bg = new cc.Sprite("#home_floatExpandedBg.png");
            this.addChild(bg);

            this.initButtons();
            this.touchRect = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);
        },

        initButtons: function () {
            // var btnTaiXiu = new ccui.Button("minigame_icon_taixiu.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnTaiXiu.setPosition(0, 198);
            // this.addChild(btnTaiXiu);
            //
            // var btnSicbo = new ccui.Button("minigame_icon_caothap.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnSicbo.setPosition(116, 159);
            // this.addChild(btnSicbo);
            //
            // var btnTaiXiu2 = new ccui.Button("minigame_icon_taixiu.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnTaiXiu2.setPosition(199, 56);
            // this.addChild(btnTaiXiu2);
            //
            // var btnPhucSinh = new ccui.Button("minigame_icon_phucsinh.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnPhucSinh.setPosition(199, -58);
            // this.addChild(btnPhucSinh);
            //
            // var btnCaoThap = new ccui.Button("minigame_icon_caothap.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnCaoThap.setPosition(116, -154);
            // this.addChild(btnCaoThap);
            //
            // var btnBauCua = new ccui.Button("minigame_icon_minipoker.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnBauCua.setPosition(0, -190);
            // this.addChild(btnBauCua);
            //
            // var btnTuLinh = new ccui.Button("minigame_icon_tuling.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnTuLinh.setPosition(-112, -161);
            // this.addChild(btnTuLinh);
            //
            // var btnTanLoc = new ccui.Button("minigame_icon_phucsinh.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnTanLoc.setPosition(-195, -58);
            // this.addChild(btnTanLoc);
            //
            // var btnTaiXiu3 = new ccui.Button("minigame_icon_taixiu.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnTaiXiu3.setPosition(-195, 75);
            // this.addChild(btnTaiXiu3);
            //
            // var btnMiniPoker = new ccui.Button("minigame_icon_minipoker.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnMiniPoker.setPosition(-112, 164);
            // this.addChild(btnMiniPoker);

            var btnTaiXiu = new ccui.Button("home_floatCaoThap.png", "", "", ccui.Widget.PLIST_TEXTURE);
            btnTaiXiu.setColor(cc.color(100, 100, 100));
            btnTaiXiu.setScale(0.6);
            btnTaiXiu.setPosition(0, 198);
            btnTaiXiu.setTouchEnabled(false);
            this.addChild(btnTaiXiu);

            var TaiXiu_CommingSoon_Label = new MultiLanguage.createLabelTTFFont("Coming soon", cc.res.font.Myriad_Pro_Regular, 15);
            TaiXiu_CommingSoon_Label.enableStroke(cc.color(0, 0, 0), 1);
            TaiXiu_CommingSoon_Label.setPosition(btnTaiXiu.x, btnTaiXiu.y);
            this.addChild(TaiXiu_CommingSoon_Label);

            // var icon_downloadTaiXiu = new cc.Sprite("#home_floatDownLoad.png");
            // icon_downloadTaiXiu.setPosition(50,100);
            // icon_downloadTaiXiu.setScale(0.5);
            // btnTaiXiu.addChild(icon_downloadTaiXiu);


            var btnCaoThap = new ccui.Button("home_floatCaoThap.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btnCaoThap.setColor(cc.color(100, 100, 100));
            btnCaoThap.setScale(0.6);
            btnCaoThap.setPosition(190, 30);
            // btnCaoThap.setTouchEnabled(false);
            this.addChild(btnCaoThap);

            // var CaoThap_CommingSoon_Label = new MultiLanguage.createLabelTTFFont("Coming soon", cc.res.font.Myriad_Pro_Regular, 15);
            // CaoThap_CommingSoon_Label.enableStroke(cc.color(0, 0, 0), 1);
            // CaoThap_CommingSoon_Label.setPosition(btnCaoThap.x, btnCaoThap.y);
            // this.addChild(CaoThap_CommingSoon_Label);

            // var icon_downloadPhucSinh = new cc.Sprite("#home_floatDownLoad.png");
            // icon_downloadPhucSinh.setPosition(50,100);
            // icon_downloadPhucSinh.setScale(0.5);
            // btnPhucSinh.addChild(icon_downloadPhucSinh);

            var btnPhucSinh = new ccui.Button("home_floatCaoThap.png", "", "", ccui.Widget.PLIST_TEXTURE);
            btnPhucSinh.setColor(cc.color(100, 100, 100));
            btnPhucSinh.setScale(0.6);
            btnPhucSinh.setTouchEnabled(false);
            btnPhucSinh.setPosition(116, -154);
            this.addChild(btnPhucSinh);

            var PhucSinh_CommingSoon_Label = new MultiLanguage.createLabelTTFFont("Coming soon", cc.res.font.Myriad_Pro_Regular, 15);
            PhucSinh_CommingSoon_Label.enableStroke(cc.color(0, 0, 0), 1);
            PhucSinh_CommingSoon_Label.setPosition(btnPhucSinh.x, btnPhucSinh.y);
            this.addChild(PhucSinh_CommingSoon_Label);

            // var icon_downloadCaoThap = new cc.Sprite("#home_floatDownLoad.png");
            // icon_downloadCaoThap.setPosition(50,100);
            // icon_downloadCaoThap.setScale(0.5);
            // btnCaoThap.addChild(icon_downloadCaoThap);

            var btnTuLinh = new ccui.Button("home_floatCaoThap.png", "", "", ccui.Widget.PLIST_TEXTURE);
            btnTuLinh.setColor(cc.color(100, 100, 100));
            btnTuLinh.setScale(0.6);
            btnTuLinh.setTouchEnabled(false);
            btnTuLinh.setPosition(-115, -150);
            this.addChild(btnTuLinh);

            var TuLinh_CommingSoon_Label = new MultiLanguage.createLabelTTFFont("Coming soon", cc.res.font.Myriad_Pro_Regular, 15);
            TuLinh_CommingSoon_Label.enableStroke(cc.color(0, 0, 0), 1);
            TuLinh_CommingSoon_Label.setPosition(btnTuLinh.x, btnTuLinh.y);
            this.addChild(TuLinh_CommingSoon_Label);

            // var icon_downloadTuLinh = new cc.Sprite("#home_floatDownLoad.png");
            // icon_downloadTuLinh.setPosition(50,100);
            // icon_downloadTuLinh.setScale(0.5);
            // btnTuLinh.addChild(icon_downloadTuLinh);

            var btnMiniPoker = new ccui.Button("home_floatMinipoker.png", "", "", ccui.Widget.PLIST_TEXTURE);
            btnMiniPoker.setScale(0.6);
            // btnMiniPoker.setColor(cc.color(100, 100, 100));
            // btnMiniPoker.setTouchEnabled(false);
            btnMiniPoker.setPosition(-190, 30);
            this.addChild(btnMiniPoker);

            // var MiniPoker_CommingSoon_Label = new MultiLanguage.createLabelTTFFont("Comming soon", cc.res.font.Myriad_Pro_Regular, 15);
            // MiniPoker_CommingSoon_Label.setPosition(btnMiniPoker.x, btnMiniPoker.y);
            // this.addChild(MiniPoker_CommingSoon_Label);

            // var icon_downloadMiniPoker = new cc.Sprite("#home_floatDownLoad.png");
            // icon_downloadMiniPoker.setPosition(50,100);
            // icon_downloadMiniPoker.setScale(0.5);
            // btnMiniPoker.addChild(icon_downloadMiniPoker);

            var thiz = this;



            btnTaiXiu.addClickEventListener(function () {
                // thiz.removeFromParent();
                // SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_TaiXiu);
            });

            // btnTaiXiu3.addClickEventListener(function () {
            //     thiz.removeFromParent();
            //     SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_TaiXiu);
            // });
            // //Cao thap

            btnCaoThap.addClickEventListener(function () {
                thiz.removeFromParent();
                SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_CaoThap);
            });

            // btnSicbo.addClickEventListener(function () {
            //     thiz.removeFromParent();
            //     SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_CaoThap);
            // });
            //
            // //PhucSinh
            //
            // btnPhucSinh.addClickEventListener(function () {
            //     thiz.removeFromParent();
            //     SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_PhucSinh);
            // });
            //
            // btnTanLoc.addClickEventListener(function () {
            //     thiz.removeFromParent();
            //     SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_PhucSinh);
            // });
            // //Poker

            btnMiniPoker.addClickEventListener(function () {
                thiz.removeFromParent();
                SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_Poker);
            });

            // btnBauCua.addClickEventListener(function () {
            //     thiz.removeFromParent();
            //     SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_Poker);
            // });
            //
            //
            //
            // //TuLinh
            //
            // btnTaiXiu2.addClickEventListener(function () {
            //     thiz.removeFromParent();
            //     SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_TuLinh);
            // });
            //
            // btnTuLinh.addClickEventListener(function () {
            //     thiz.removeFromParent();
            //     SceneNavigator.startGame(SceneNavigator.GameId.MiniGame_TuLinh);
            // });
        },

        setupMinigameButton: function (minigameList) {
            if (minigameList && minigameList.length) {
                var nameList = [];
                for (var i = 0; i < minigameList.length; i++) {
                    if (!minigameList[i]["isActive"])
                        continue;
                    nameList.push(minigameList[i]["name"]);
                }

                var btnIndex = 0;
                for (var i = 0; i < this.allBtn.length; i++) {
                    var btn = this.allBtn[i];
                    btn.visible = false;
                    if (nameList.indexOf(btn.gameName) !== -1) {
                        btn.visible = true;
                        btn.setPosition(this.getBtnPosition(btnIndex, nameList.length));
                        btnIndex++;
                    }
                }
            }
        },

        createMiniGameButton: function (texture, name) {
            var res = new ccui.Button(texture, "", "", ccui.Widget.PLIST_TEXTURE);
            res.gameName = name;

            var loadingProgress = new cc.Node();
            loadingProgress.setPosition(6, 89);
            res.addChild(loadingProgress);
            // loadingProgress.visible = false;

            var loadingBackground = new cc.Sprite("#home_minigme_downloading_background.png");
            loadingProgress.addChild(loadingBackground);

            var loadingForeground = new cc.ProgressTimer(new cc.Sprite("#home_minigme_downloading_foreground.png"));
            loadingProgress.addChild(loadingForeground);

            res.onLoadModule = function (moduleName, progress, isDownloading) {
                loadingForeground.setPercentage(progress);
                loadingProgress.visible = !(progress === 100 && isDownloading === false);
            };

            res.onEnter = function () {
                ccui.Button.prototype.onEnter.apply(res);
                if (name) {
                    // var moduleName = "mg" + (name === "VideoPoker" ? "MiniPoker" : name); // map
                    var moduleName = "mg" + name; // map
                    HomeDownloadManager.getInstance().addDownloadStatusListener(moduleName, res.onLoadModule, res);
                    var status = HomeDownloadManager.getInstance().getModuleStatus(moduleName);
                    if (status && status.downloaded)
                        loadingProgress.visible = false;
                }
            };

            res.onExit = function () {
                ccui.Button.prototype.onExit.apply(res);
                HomeDownloadManager.getInstance().removeListener(res);
            };

            return res;
        },

        getBtnPosition: function (index, length) {
            var angle = index * Math.PI * 2 / length;
            var x = 200 * Math.sin(angle);
            var y = 200 * Math.cos(angle);
            return cc.p(x, y);
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
                            // HomeFloatButton.getInstance().collapse();
                        }, 10);
                    }
                    return true;
                }
            }, this);
        },

        onExit: function () {
            HomeFloatButton.getInstance().collapse();
            this._super();
        }
    });

    var FloatButtonClass = cc.Node.extend({
        ctor: function () {
            if (instance) {
                throw "Can't create a new instance of a singleton class";
            }

            this._super();

            var bg = new cc.Sprite("#home_floatButton.png");
            bg.scale = 0.7;

            this.addChild(bg);
            this.bg = bg;

            this.boundingSize = bg.getContentSize();
            this.touchRect = cc.rect(-this.boundingSize.width / 2, -this.boundingSize.height / 2,
                this.boundingSize.width, this.boundingSize.height);
            this.expanded = false;

            //
            this.x = cc.winSize.width;
        },

        onEnter: function () {
            this._super();
            this.isTouch = false;

            var thiz = this;
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
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
                    thiz.onTouchMoved(touch, event);
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
            parent.addChild(this, 100);

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
            var expandedNode = new ExpandedFloatBtn();
            expandedNode.retain();
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
            // cc.log("collapse");
            this.expanded = false;
            this.visible = true;
            var parent = this.getParent();
            parent = parent || cc.director.getRunningScene();
            if (parent.expandedNode) {
                parent.expandedNode = null;
            }
        }
    });

    FloatButtonClass.getInstance = function () {
        if (!instance) {
            instance = new FloatButtonClass();
            instance.retain();
        }
        return instance;
    };

    return FloatButtonClass;

})();
