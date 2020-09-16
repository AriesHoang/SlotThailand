var HomeHistoryDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite();
        bg.visible = false;
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

        this.getChildByName("buttonBack").loadTextures("home_dialog_button_back_mail.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.getChildByName("buttonBack").setPosition(-568, 314);

        this.initController();
        this._initContent();
        this._initGUIs();

        this.type = "play";
        this.currentType = this.type;

        var scrollViewHistory = new newui.TableView(cc.size(1200, 440), 1);
        scrollViewHistory.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollViewHistory.setScrollBarEnabled(false);
        scrollViewHistory.setTouchEnabled(true);
        scrollViewHistory.setBounceEnabled(true);
        scrollViewHistory.setAnchorPoint(cc.p(0.5, 1));
        scrollViewHistory.setPosition(this.viewListHistory.width / 2, this.viewListHistory.height - 60);
        this.viewListHistory.addChild(scrollViewHistory, 1);
        this.scrollViewHistory = scrollViewHistory;
        this._controller.sendGetHistory();

        this._pageIndex = 0;
        var thiz = this;
        cc.Global.implementInfiniteScroll(this.scrollViewHistory, function () {
            thiz._pageIndex = thiz._pageIndex + 1;
            thiz.quantity = thiz._pageIndex * 10;
            if (thiz.quantity <= thiz.pageCount)
                thiz._controller.sendGetHistory(thiz.quantity, 10, thiz.type);
        });

    },

    initController: function () {
        this._controller = new HomeHistoryController(this);
    },

    _initGUIs: function () {
        //    Item Gold
        var itemGold = this._initItemInNode(0, "CHƠI TIỀN");
        // itemGold.setAnchorPoint(cc.p(0, 0));
        itemGold.setPosition(-itemGold.width, cc.winSize.height / 2 - itemGold.height / 2 - 10);
        itemGold.setTouchEnabled(true);
        this.itemGold = itemGold;
        this.addChild(itemGold);

        //    Item Purchase Gold
        var itemPurchaseGold = this._initItemInNode(0, "NẠP TIỀN");
        itemPurchaseGold.setPosition(0, itemGold.y);
        itemPurchaseGold.setTouchEnabled(true);
        itemPurchaseGold.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
        itemPurchaseGold.getChildByName("iconLight").visible = false;
        this.itemPurchaseGold = itemPurchaseGold;
        this.addChild(itemPurchaseGold);

        //    Item spend Gold
        var itemSpendGold = this._initItemInNode(0, "TIÊU TIỀN");
        itemSpendGold.setPosition(itemSpendGold.width, itemGold.y);
        itemSpendGold.setTouchEnabled(true);
        itemSpendGold.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
        itemSpendGold.getChildByName("iconLight").visible = false;
        this.itemSpendGold = itemSpendGold;
        this.addChild(itemSpendGold);


        var thiz = this;
        itemGold.addClickEventListener(function () {
            itemGold.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            itemGold.getChildByName("iconLight").visible = true;
            itemPurchaseGold.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemPurchaseGold.getChildByName("iconLight").visible = false;
            itemSpendGold.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemSpendGold.getChildByName("iconLight").visible = false;
            thiz._onShowDataWhenChangeTab(thiz._allItems);
            thiz.type = "play";
            thiz._controller.sendGetHistory(0, 100, thiz.type);
        });

        itemSpendGold.addClickEventListener(function () {
            itemGold.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemGold.getChildByName("iconLight").visible = false;
            itemPurchaseGold.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemPurchaseGold.getChildByName("iconLight").visible = false;
            itemSpendGold.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            itemSpendGold.getChildByName("iconLight").visible = true;
            thiz._onShowDataWhenChangeTab(thiz._allItems);
            thiz.type = "cashout";
            thiz._controller.sendGetHistory(0, 100, thiz.type);
        });

        itemPurchaseGold.addClickEventListener(function () {
            cc.log("itemPurchaseGold Click");
            itemGold.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemGold.getChildByName("iconLight").visible = false;
            itemPurchaseGold.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            itemPurchaseGold.getChildByName("iconLight").visible = true;
            itemSpendGold.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemSpendGold.getChildByName("iconLight").visible = false;
            thiz._onShowDataWhenChangeTab(thiz._allItems);
            thiz.type = "topup";
            thiz._controller.sendGetHistory(0, 100, thiz.type);
        });


        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {
            itemGold.setPosition(-itemGold.width + 80, cc.winSize.height / 2 - itemGold.height / 2 - 10);
            this.getChildByName("buttonBack").setPosition(-430, 314);
            this.viewListHistory.setScale(cc.winSize.screenScale);
        }
    },
    //================================================================================
    //================================================================================
    //=================================CONTENT VIEW===================================
    //================================================================================
    //================================================================================
    _initContent: function () {
        var viewListHistory = new ccui.Widget();
        viewListHistory.setContentSize(cc.size(1200, 500));
        viewListHistory.setAnchorPoint(cc.p(0.5, 1));
        viewListHistory.setPosition(0, cc.winSize.height / 2 - 130);
        this.addChild(viewListHistory);
        this.viewListHistory = viewListHistory;
        this._initHeader();
    },
    _createItem: function (items, _i) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(1200, 57));
        res.setTouchEnabled(true);
        var color = cc.color("#d7cecf");
        var cell = new cc.LayerColor(color, 1200, 57);
        res.addChild(cell);
        if (_i % 2 === 0) {
            cell.setOpacity(50);
        } else {
            cell.setOpacity(100);
        }
        var font = cc.res.font.Myriad_Pro_Regular;
        var fontSize = 22;
        var _magd = new cc.LabelTTF(cc.Global.NumberFormat1(items.coin), font, fontSize);
        _magd.setPosition(95, res.height / 2);
        res.addChild(_magd);

        var _thoigian = new cc.LabelTTF(cc.Global.DateToString(new Date(items.transTime)), font, fontSize);
        _thoigian.setAnchorPoint(cc.p(0.5, 0.5));
        _thoigian.setPosition(330, res.height / 2);
        res.addChild(_thoigian);

        var transType = this._onConvertTransType(items.transType);

        var _dichvu = new cc.LabelTTF(transType, font, fontSize);
        _dichvu.setAnchorPoint(cc.p(0.5, 0.5));
        _dichvu.setPosition(590, res.height / 2);
        res.addChild(_dichvu);

        var _phatsinh = new cc.LabelTTF(cc.Global.NumberFormat1(items.amount), font, fontSize);
        _phatsinh.setAnchorPoint(cc.p(0.5, 0.5));
        _phatsinh.setPosition(840, res.height / 2);
        res.addChild(_phatsinh);

        if (items.transType === "cashout_card")
            var _mota = new cc.LabelTTF(transType, font, fontSize, cc.size(250, 0), cc.VERTICAL_TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        else
            var _mota = new cc.LabelTTF(items.description, font, fontSize, cc.size(250, 0), cc.VERTICAL_TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        _mota.setAnchorPoint(cc.p(0.5, 0.5));
        _mota.setPosition(1075, res.height / 2);
        res.addChild(_mota);

        var thiz = this;
        res.addClickEventListener(function () {
            thiz._onClickEntry(items.description);
        });

        return res;
    },

    _initHeader: function () {
        var container = this._createEntryBar(true);
        var headerSize = 30;

        var maGD = new cc.LabelTTF("SỐ TIỀN", cc.res.font.Myriad_Pro_Regular, headerSize, cc.p(200, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        maGD.setColor(new cc.Color(60, 60, 60));

        var _cell1 = container.getChildByName("cell1");
        maGD.setPosition(_cell1.x + _cell1.width / 2, 30);
        container.addChild(maGD);

        var thoigian = new cc.LabelTTF("THỜI GIAN", cc.res.font.Myriad_Pro_Regular, headerSize, cc.p(200, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        thoigian.setColor(new cc.Color(60, 60, 60));
        var _cell2 = container.getChildByName("cell2");
        thoigian.setPosition(_cell2.x + _cell2.width / 2, 30);
        container.addChild(thoigian);

        var dichvu = new cc.LabelTTF("DỊCH VỤ", cc.res.font.Myriad_Pro_Regular, headerSize, cc.p(200, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        dichvu.setColor(new cc.Color(60, 60, 60));
        var _cell3 = container.getChildByName("cell3");
        dichvu.setPosition(_cell3.x + _cell3.width / 2, 30);
        container.addChild(dichvu);

        var phatsinh = new cc.LabelTTF("PHÁT SINH", cc.res.font.Myriad_Pro_Regular, headerSize, cc.p(200, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        phatsinh.setColor(new cc.Color(60, 60, 60));
        var _cell4 = container.getChildByName("cell4");
        phatsinh.setPosition(_cell4.x + _cell4.width / 2, 30);
        container.addChild(phatsinh);

        var mota = new cc.LabelTTF("MÔ TẢ", cc.res.font.Myriad_Pro_Regular, headerSize, cc.p(200, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        mota.setColor(new cc.Color(60, 60, 60));
        var _cell5 = container.getChildByName("cell5");
        mota.setPosition(_cell5.x + _cell5.width / 2, 30);
        container.addChild(mota);

        container.setPosition(this.viewListHistory.width / 2, this.viewListHistory.height - 30);
        this.viewListHistory.addChild(container);
    },
    _createEntryBar: function (isDark) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(1200, 57));
        var opacity = 255;
        // var opacity = Math.floor(isDark ? (255 * 0.6) : (255 * 0.3));
        var color = cc.color("#d7cecf");

        var cell1 = new cc.LayerColor(color, 190, res.height);
        cell1.setPosition(0, 0);
        cell1.setName("cell1");
        cell1.setOpacity(opacity);
        res.addChild(cell1);

        var cell2 = new cc.LayerColor(color, 280, res.height);
        cell2.setPosition(cell1.x + cell1.width, 0);
        cell2.setName("cell2");
        cell2.setOpacity(opacity);
        res.addChild(cell2);

        var cell3 = new cc.LayerColor(color, 240, res.height);
        cell3.setPosition(cell2.x + cell2.width, 0);
        cell3.setName("cell3");
        cell3.setOpacity(opacity);
        res.addChild(cell3);

        var cell4 = new cc.LayerColor(color, 240, res.height);
        cell4.setPosition(cell3.x + cell3.width, 0);
        cell4.setName("cell4");
        cell4.setOpacity(opacity);
        res.addChild(cell4);

        var cell5 = new cc.LayerColor(color, 250, res.height);
        cell5.setPosition(cell4.x + cell4.width, 0);
        cell5.setName("cell5");
        cell5.setOpacity(opacity);
        res.addChild(cell5);

        return res;
    },
    _initItemInNode: function (typeItem, text) {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(300, 100));

        var bgItem = new ccui.Scale9Sprite("home_btn_chuyentien.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(node.width, node.height));
        bgItem.setPosition(node.width / 2, node.height / 2);
        node.addChild(bgItem);

        var label = new cc.LabelTTF(text, cc.res.font.Arial_Bold, 40, cc.p(300, 200), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label.setName("NameNode");
        label.setColor(cc.color(252, 194, 81));
        label.setPosition(node.width / 2, node.height / 2);
        node.addChild(label);

        var borderItem = new cc.Sprite("#border_btn.png");
        borderItem.scale = 2;
        borderItem.setName("iconLight");
        borderItem.setPosition(node.width / 2, label.y - 20);
        node.addChild(borderItem);

        if (typeItem === 0) {
            borderItem.visible = true;
            bgItem.visible = false;
        }
        else if (typeItem === 1) {
            label.setFontSize(30);
            bgItem.setPreferredSize(cc.size(label.width * 1.5, label.height * 1.3));
        } else if (typeItem === 2) {
            label.setFontSize(30);
            bgItem.setPreferredSize(cc.size(label.width * 1.5, node.height));
        }

        return node;
    },
    _onGetResponeError: function (mess) {
        var dialog = new HomeNotifyPopup();
        dialog.showNotification(mess);
    },
    _onGetResponseSuccess: function (page, pageCount, listTransaction) {
        this._allItems = this._allItems || [];
        if (this.currentType !== this.type)
            this._allItems = [];
        this.currentType = this.type;
        if (this._pageIndex === 0) {
            this.scrollViewHistory.removeAllItems();
            this._allItems = [];
        }
        this.pageCount = pageCount;
        for (var j = 0; j < listTransaction.length; j++) {
            var res = {};
            res.transTime = listTransaction[j]["1"];
            res.amount = listTransaction[j]["2"];
            res.coin = listTransaction[j]["3"];
            res.transType = listTransaction[j]["4"];
            res.description = listTransaction[j]["5"];
            this._allItems.push(res);
        }
        this._onShowDataWhenChangeTab(this._allItems);
    },
    _onConvertTransType: function (type) {
        var types = "";
        switch (type) {
            case "use_giftcode":
                types = "GiftCode";
                break;
            case "user_bet":
                types = "Đặt cược";
                break;
            case "topup_card":
                types = "Nạp Tiền";
                break;
            case "topup_iap":
                types = "Nạp IAP";
                break;
            case "cashout_card":
                types = "Đổi Tiền";
                break;
            case "user_win":
                types = "Trả thưởng";
                break;
            case "send_coin":
                types = "Chuyển Tiền"
                break;
            case "receive_coin":
                types = "Nhận Tiền";
                break;
        }
        return types;
    },
    _onClickEntry: function (data) {
        if (typeof data === 'undefined') return;

        if (data.length > 0) {
            if (typeof (data === "string")) {
                var dialog = new HomeNotifyPopup();
                var str = [];
                if (data.concat("|")) {
                    str = data.split("|");
                }

                if (str.length > 2) {
                    dialog.showNotification("Bạn đã đổi thành công thẻ " + str[0] + " mệnh giá " + cc.Global.NumberFormat1(str[1]) + ".\nSố Seri: " + str[3] + "\nMã thẻ: " + str[2] + "\nHạn dùng thẻ: " + str[4] + ".");
                } else {
                    dialog.showNotification(str[0]);
                }
            }
        }
    },
    _onShowDataWhenChangeTab: function (data) {
        if (data.length > 0) {
            this.scrollViewHistory.removeAllItems();
            for (var i = 0; i < data.length; i++) {
                var container = this._createItem(data[i], i);
                this.scrollViewHistory.pushItem(container);
            }
        } else {
            this.scrollViewHistory.removeAllItems();
        }
    }

});
