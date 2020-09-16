var s_homejackpotList = s_homejackpotList || [100, 1000, 10000];
var HomeJackpotLayer = HomeBoderLayer.extend({
    ctor: function () {
        this._super();
        this._initController();
        this.bg.visible = false;

        var title = MultiLanguage.createLabelTTFFont("JACKPOT_TITLE", cc.res.font.Myriad_Pro_Bold, 30);
        title.setPosition(this.width / 2, 693);
        title.visible = false;
        this.addChild(title);

        var bgnew = new cc.Sprite("#bg_tophu_new.png");
        bgnew.setPosition(this.width / 2 + 30, this.height / 2 - 30);
        bgnew.scale = 0.67;
        this.bgnew = bgnew;
        this.addChild(bgnew);

        var titlenew = new cc.Sprite("#tophu_title.png");
        titlenew.scale = 0.68;
        titlenew.setPosition(bgnew.x, bgnew.y + bgnew.height / 2 * bgnew.scaleY - titlenew.height / 2 * titlenew.scaleY - 20);
        this.addChild(titlenew);

        var effect = new cc.Sprite("#home_tophu_effect.png");
        effect.scale = 0.8;
        effect.setPosition(titlenew.x, titlenew.y - effect.height / 2 * effect.scaleY + 20);
        this.addChild(effect);

        var bg = new cc.Sprite("#bg_header_tophu.png");
        bg.setPosition(titlenew.x, titlenew.y - titlenew.height / 2 * titlenew.scaleY - 50);
        this.bg = bg;
        this.addChild(bg);

        // var thiz = this;
        var mToggle = new ToggleNodeGroup();
        this.mToggle = mToggle;
        this.addChild(mToggle);
        this.allItemsList = [];
        this.mapIdLabel = {};

        this.initHeader();

        if (cc.Global.JackpotGameListData) {
            this.initJackpotGameList(cc.Global.JackpotGameListData);
        }

    },
    _initController: function () {
        this._controller = new HomeJackpotController(this);
    },
    onEnter: function () {
        this._super();
        this.mToggle.selectItem(0);

    },

    _initListGame: function (itemList, gamelist) {
        itemList.removeAllItems();
        // gamelist.sort(function (lhs, rhs) {
        //     return lhs.id - rhs.id;
        // });
        for (var j = 0; j < gamelist.length; j++) {
            if (gamelist[j].isReady && gamelist[j].id !== 21) {
                this.addItem(itemList, gamelist[j]);
            }
        }
    },

    initJackpotGameList: function (data) {
        // cc.log("==================initJackpotGameList: " + JSON.stringify(data));
        cc.Global.JackpotGameListData = data;
        for (var i = 0; i < 3; i++) {
            this._initListGame(this.allItemsList[i], data);
        }
    },

    addItem: function (mList, game) {
        var container = new ccui.Widget();
        var buttonClick = new ccui.Button("", "", "", ccui.Widget.PLIST_TEXTURE);
        buttonClick.setAnchorPoint(.5, .5);
        buttonClick.setPosition(buttonClick.width / 2, buttonClick.height / 2);
        buttonClick.setContentSize(250, 50);
        // buttonClick.setOpacity(0);
        container.addChild(buttonClick);

        var icon = new cc.Sprite("#" + game.iconUrl);
        // var icon = new cc.Sprite(game.iconUrl);
        icon.setScale(0.23);
        icon.setPosition(50, icon.height * icon.scaleY / 2);
        container.addChild(icon);

        var labelName = new cc.LabelTTF(game.name, cc.res.font.Myriad_Pro_Regular, 24);
        labelName.setAnchorPoint(cc.p(0, 0));
        labelName.setPosition(110, icon.height * icon.scaleY / 2 + 10);
        container.addChild(labelName);

        var label = new cc.LabelTTF("0", cc.res.font.Arial_Bold, 30);
        label.setColor(new cc.Color(255, 255, 0));
        label.setAnchorPoint(cc.p(0, 0.5));
        label.setPosition(110, icon.height * icon.scaleY / 2 - 10);
        container.addChild(label);

        var line = new cc.Sprite("#list_jp_line2.png");
        line.scaleX = mList.width / line.width;
        line.setPosition(line.width * line.scaleX / 2, -10);
        container.addChild(line);


        container.setContentSize(cc.size(mList.width, icon.height * icon.scaleY + 10));
        mList.pushItem(container);

        mList[game.id] = label;

        buttonClick.addClickEventListener(function () {
            // cc.log("CLICK");
            if (cc.Global.isLogin)
                SceneNavigator.startGame(game.id);
            else {
                var d = new HomeNotifyPopup();
                d.showNotification(MultiLanguage.getTextByKey("TRY_LOGIN"));
            }
        });
    },
    setDataJackpotTopHu: function (id, banks) {
        for (var i = 0; i < this.allItemsList.length; i++) {
            if (this.allItemsList[i][id] != null) {
                this.allItemsList[i][id].stopAllActions();
                // this.allItemsList[i][id].runAction(new quyetnd.ActionNumber(1, banks[i].money));
            }
        }
    },
    initHeader: function () {
        var thiz = this;
        for (var i = 0; i < s_homejackpotList.length; i++) {
            (function (i) {
                var touchIcon = new cc.Sprite("#home_tophu_tab_header_active" + (i + 1) + ".png");
                touchIcon.setScaleX(0.77);
                touchIcon.setScaleY(0.68);
                touchIcon.setPosition(thiz.bg.x - (thiz.bg.width / 3) + (thiz.bg.width * (i / 3)), thiz.bg.y +2);
                thiz.addChild(touchIcon);

                var label = new cc.LabelTTF(cc.Global.NumberFormat1(s_homejackpotList[i]), cc.res.font.Myriad_Pro_Regular, 24);
                label.setPosition(touchIcon.x, touchIcon.y);
                label.enableStroke(cc.color("#000000"), 1);
                thiz.addChild(label, 1);

                var itemList = new newui.TableView(cc.size(thiz.bgnew.width * thiz.bgnew.scaleX, 280), 1);
                itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
                itemList.setBounceEnabled(true);
                itemList.setPosition(30, 120);
                itemList.setPadding(10);
                itemList.setMargin(10, 10, 0, 0);
                thiz.addChild(itemList, 2);

                var touchItem = new ToggleNodeItem(touchIcon.getContentSize());
                touchItem.setPosition(touchIcon.getPosition());
                thiz.mToggle.addItem(touchItem);
                touchItem.onSelect = function () {
                    touchIcon.setVisible(true);
                    itemList.setVisible(true);
                };
                touchItem.onUnSelect = function () {
                    touchIcon.setVisible(false);
                    itemList.setVisible(false);
                };
                thiz.allItemsList.push(itemList);

            })(i);
        }
    }
});
