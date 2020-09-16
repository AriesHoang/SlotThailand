var HomeVariable = HomeVariable || {};

var HomeGameLayer = cc.Node.extend({
    ctor: function () {
        this._super();

        this.mapIdLabel = this.mapIdLabel || [];

        this._initController();
        var listGame = new newui.TableView(cc.size(cc.winSize.width - 40, 500), 1);
        listGame.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listGame.setPadding(15);
        listGame.setMargin(0, 0, 5, 5);
        listGame.setBounceEnabled(true);
        listGame.setScrollBarEnabled(false);
        listGame.setPosition(50, 100);
        listGame.setCustomRefreshControl(function (view, row, col) {
            if (row % 2) {
                view.setPosition((col + 0.5) * 200 + 10 * col + 40, 160);
            }
            else {
                view.setPosition((col + 0.5) * 200 + 10 * col + 40, 400);
            }
        });
        // var listGame = new newui.TableView(cc.size(cc.winSize.width - 390, 500), 2);
        // listGame.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        // listGame.setMargin(0, 0, 5, 5);
        // listGame.setBounceEnabled(true);
        // listGame.setScrollBarEnabled(false);
        // listGame.setPosition(350, 80);
        //
        // listGame.setCustomRefreshControl(function (view, row, col) {
        //     // cc.log("ROW: " + row + " - COL: " + col);
        //     // if (col === 0 ) {
        //     //     if (row % 2) {
        //     //         view.setPosition((col + 0.5) * 200 + 10 * col + 40, 400);
        //     //     }
        //     //     else {
        //             view.setPosition((col + 0.5) * 200 + 10 * col + 40, 250);
        //         // }
        //     // } else {
        //     //     if (col === 1) {
        //     //         if (row === 0) {
        //     //             view.setPosition((col + 0.5) * 200 + 10 * col + 40, 300)
        //     //         } else {
        //     //             view.setPosition((col + 1 + 0.5) * 200 + 10 * (col + 1) + 40, 300)
        //     //         }
        //     //     } else if (col === 2) {
        //     //         if (row === 0) {
        //     //             view.setPosition((col + 1 + 0.5) * 200 + 10 * (col + 1) + 40, 300)
        //     //         } else {
        //     //             view.setPosition((col + 2 + 0.5) * 200 + 10 * (col + 2) + 40, 300)
        //     //         }
        //     //     }
        //     // }
        // });
        this.addChild(listGame);

        this.listGame = listGame;

        this._initSideButton();
        MultiLanguage.addChangeLanguageEvent(this);

        // cc.log("gameData: " + JSON.stringify(cc.Global.gameData));
        /* if (cc.Global.gameData) {
              this.initJackpotGameList(cc.Global.gameData);
          }
          if (cc.Global.GameLayerJackpotData) {
              this.setDataJackpot(cc.Global.GameLayerJackpotId, cc.Global.GameLayerJackpotData);
              this.setOnOffBigJackpot(cc.Global.GameLayerBigJackpotVisible);
          }*/

        this._createGameList();

    },

    moveListGameEffect: function () {
        var containerSize = this.listGame.getInnerContainerSize();
        var containerPos = this.listGame.getInnerContainerPosition();
        var contentSize = this.listGame.getContentSize();
        var currentPercent = -(containerPos.x * 100 / (containerSize.width - contentSize.width));
        currentPercent = currentPercent || 0;
        var destinationPercent = Math.min(currentPercent + 30, 100);
        this.listGame.scrollToPercentHorizontal(destinationPercent, 0.3, false);
    },

    _initController: function () {
        this._controller = new HomeGameController(this);
    },

    onExit: function () {
        this._super();
        if (this._controller)
            this._controller.release();
    },

    _initSideButton: function () {
        var thiz = this;
        if (this.jackpotBt !== undefined) {
            this.jackpotBt.removeFromParent(true);
            this.jackpotBt = undefined;
        }

        if (this.agencyBt !== undefined) {
            this.agencyBt.removeFromParent(true);
            this.agencyBt = undefined;
        }

        var jackpotBt = new ccui.Button("gate_btn_tophu.png", "", "", ccui.Widget.PLIST_TEXTURE);
        jackpotBt.setPosition(110, 580);
        jackpotBt.setScale(0.68);
        this.addChild(jackpotBt);
        this.jackpotBt = jackpotBt;

        jackpotBt.addClickEventListener(function () {
            if (cc.Global.isLogin)
                thiz.jackpotButonHandler();
            else {
                var d = new HomeNotifyPopup();
                d.showNotification(MultiLanguage.getTextByKey("TRY_LOGIN"));
            }
        });

        var agencyBt = new ccui.Button("gate_btn_daily.png", "", "", ccui.Widget.PLIST_TEXTURE);
        agencyBt.setPosition(220, 580);
        agencyBt.setScale(0.68);
        agencyBt.visible = false;
        this.addChild(agencyBt);
        this.agencyBt = agencyBt;

        agencyBt.addClickEventListener(function () {
            if (cc.Global.isLogin)
                thiz.agencyButtonHandler();
            else {
                var d = new HomeNotifyPopup();
                d.showNotification(MultiLanguage.getTextByKey("TRY_LOGIN"));
            }
        });
    },

    _onChangeLanguage: function () {
        this.jackpotBt.loadTextureNormal("home_jackpotBt_" + MultiLanguage._currentLanguage + ".png", ccui.Widget.PLIST_TEXTURE);
    },


    initJackpotGameList: function (res, idBig) {
        this.listGame.removeAllItems();
        res.sort(function (lhs, rhs) {
            return lhs.id - rhs.id;
        });
        cc.Global.gameData = res;
        for (var i = 0; i < res.length; i++) {
            var gameIcon = this.createGameButton(res[i]);
            this.listGame.pushItem(gameIcon);
        }
    },

    setDataJackpot: function (id, res) {
        cc.Global.GameLayerJackpotData = res;
        cc.Global.GameLayerJackpotId = id;
        // if (id === 1) {
        //     this.mapIdLabel[0].stopAllActions();
        //     this.mapIdLabel[0].runAction(new quyetnd.ActionNumber(1, res[0].money));
        // }
        var label = this.mapIdLabel[id];
        if (label) {
            for (var i = 0; i < label.length; i++) {
                label[i].stopAllActions();
                // label[i].runAction(new quyetnd.ActionNumber(1, res[i].money));
            }
        }
    },

    createGameButton: function (item) {
        var icon = item.iconUrl;
        var gameBt = new ccui.Button(icon, "", "", ccui.Widget.PLIST_TEXTURE);
        var gameIcon = new ccui.Widget();
        gameIcon.setScale(0.6);
        gameBt.setTouchEnabled(item.isReady);
        gameIcon.setContentSize(gameBt.width, gameBt.height);
        if (item.id === 3) {
            gameBt.setPosition(gameIcon.width / 2, gameIcon.height / 2 + 10);
        } else {
            gameBt.setPosition(gameIcon.width / 2, gameIcon.height / 2);
        }
        gameIcon.addChild(gameBt);

        // var comingSoonBg = new cc.Sprite("#icon_commingsoon.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // comingSoonBg.scaleX = gameBt.width / comingSoonBg.width;
        // comingSoonBg.scaleY = gameBt.height / comingSoonBg.height;
        // comingSoonBg.setPosition(gameBt.width / 2, gameBt.height / 2);
        // comingSoonBg.visible = !item.isReady;
        // gameBt.addChild(comingSoonBg);
        //
        // var comingSoonText = new cc.LabelTTF("", "Arial", 40);
        // comingSoonText.setPosition(comingSoonBg.height / 2, comingSoonBg.width / 2);
        // comingSoonText.visible = !item.isReady;
        // comingSoonText.enableStroke(cc.color(0, 0, 0, 255), 2);
        // gameBt.addChild(comingSoonText);
        // if (item.id === 1)
        //     comingSoonText.setString("Bảo trì game.");
        // else if (item.id === 2)
        //     comingSoonText.setString("08/03/2018");
        // else if (item.id === 5)
        //     comingSoonText.setString("16/03/2018");
        // else
        //     comingSoonText.setString("03/2018");

        var jackpotLayer = gameBt.getRendererNormal();
        // var jackpotBg = new cc.Sprite("#bg_list_jackpot_hv.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // jackpotBg.setPosition(gameBt.x + 5, 70);
        // // if (item.id === 2 || item.id === 4 || item.id === 3)
        // if (item.id === 1)
        //     jackpotBg.setPosition(gameBt.x + 15, 70);
        //
        // // if (item.id === 2 || item.id === 1)
        // if (item.id === 4 || item.id === 1 || item.id === 26)
        //     jackpotBg.visible = item.isReady;
        // else
        //     jackpotBg.visible = false;
        // jackpotLayer.addChild(jackpotBg);

        var jackpotLabel1 = cc.Label.createWithBMFont("res/Home/fonts/home_font_jackpot1.fnt", "0");
        jackpotLabel1.setScale(1.3);
        jackpotLabel1.setPosition(gameBt.x, 110);
        // if (item.id === 4)
        //     jackpotLabel1.setPosition(gameBt.x, 110);

        if (item.id === 1 || item.id === 4 || item.id === 24 || item.id === 25 || item.id === 26)
            jackpotLabel1.visible = item.isReady;
        else
            jackpotLabel1.visible = false;
        jackpotLayer.addChild(jackpotLabel1);

        var jackpotLabel2 = cc.Label.createWithBMFont("res/Home/fonts/home_font_jackpot2.fnt", "0");
        jackpotLabel2.setScale(1.2);
        jackpotLabel2.setPosition(gameBt.x, 75);
        // if (item.id === 4)
        //     jackpotLabel2.setPosition(gameBt.x, 75);
        if (item.id === 1 || item.id === 4 || item.id === 24 || item.id === 25 || item.id === 26)
            jackpotLabel2.visible = item.isReady;
        else
            jackpotLabel2.visible = false;
        jackpotLayer.addChild(jackpotLabel2);

        var jackpotLabel3 = cc.Label.createWithBMFont("res/Home/fonts/home_font_jackpot2.fnt", "0");
        jackpotLabel3.setScale(1.1);
        jackpotLabel3.setPosition(gameBt.x, 45);
        // if (item.id === 4)
        //     jackpotLabel3.setPosition(gameBt.x, 50);
        if (item.id === 1 || item.id === 4 || item.id === 24 || item.id === 25 || item.id === 26)
            jackpotLabel3.visible = item.isReady;
        else
            jackpotLabel3.visible = false;
        jackpotLayer.addChild(jackpotLabel3);

        this.mapIdLabel[item.id] = [jackpotLabel1, jackpotLabel2, jackpotLabel3];

        gameBt.addClickEventListener(function () {
            if (cc.Global.isLogin) {
                SceneNavigator.startGame(item.id);
            }
            else {
                var d = new HomeNotifyPopup();
                d.showNotification(MultiLanguage.getTextByKey("TRY_LOGIN"));
            }
        });

        // add load process
        var loadingProgress = new cc.Node();
        loadingProgress.setPosition(gameIcon.width - 45, 60);
        loadingProgress.setScale(1.7);
        loadingProgress.visible = false;

        var loadingLabel = new cc.LabelTTF("Loading 0%", "Arial", 20);
        loadingLabel.setAnchorPoint(0, 0);
        loadingLabel.setPosition(-160, 30);
        loadingLabel.enableStroke(cc.color(255, 0, 255), 2);
        loadingProgress.addChild(loadingLabel);

        loadingProgress.item = item;

        loadingProgress.onLoadModule = function (moduleName, progress, isDownloading) {
            loadingLabel.setString("Loading " + progress + "%");
            loadingProgress.visible = !(progress === 100 && isDownloading === false);
            if (progress === 100 && isDownloading === false) {
                setTimeout(function () {
                    if (cc.Global.isLogin)
                        SceneNavigator.startGame(item.id);
                    else {
                        var d = new HomeNotifyPopup();
                        d.showNotification(MultiLanguage.getTextByKey("TRY_LOGIN"));
                    }
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

        gameIcon.addChild(loadingProgress);

        return gameIcon;
    },

    _createGameList: function () {
        this.listGame.removeAllItems();
        var list = cc.Global.gameData;
        for (var i = 0; i < list.length; i++) {
            var gameIcon = this.createGameButton(list[i]);
            this.listGame.pushItem(gameIcon);
        }
    }
});
