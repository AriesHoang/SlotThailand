var HomeChargeMoneyDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();
        var bg = new cc.Sprite();
        this.addChild(bg);
        bg.visible = false;
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

        this.initController();


        this._initIAPView();
        this._initNapTienView();
        this._initDoiThuongView();
        this._initChuyenTienView();
        this._initMainView();
        this._controller.sendGetListCard();

        // this.setLoading(true);
    },
    initController: function () {
        this._controller = new HomeChargeController(this);
    },

    _initLabels: function () {
        var title = MultiLanguage.createLabelTTFFont("RECHARGE_TITLE", cc.res.font.Myriad_Pro_Regular, 50, cc.p(400, 300), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        title.enableStroke(cc.color("#00d8ff"), 2);
        title.setPosition(0, 197);
        title.visible = false;
        this.addChild(title);
    },

    _showViewIndex: function (index) {
        if (index === 0) {//NAP
            this.itemNapTien.getChildByName("NameNode").setColor(cc.color("#fde612"));
            this.itemNapTien.getChildByName("iconLight").visible = true;
            this.itemDoithuong.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemDoithuong.getChildByName("iconLight").visible = false;
            this.itemChuyentien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemChuyentien.getChildByName("iconLight").visible = false;
            if (cc.sys.isNative) {
                this.itemIAP.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                this.itemIAP.getChildByName("iconLight").visible = false;
            }

            this.naptienView.visible = true;
            this.chuyentienView.visible = false;
            this.doithuongView.visible = false;
            if (cc.sys.isNative)
                this.iapView.visible = false;
            this.getCaptchaNapTien();
            this.clearTextNapTien();
            this.lb_infoNaptien.setString("");
        } else if (index === 1) {//DOI
            this._controller.sendGetListBuyCard();
            this.itemNapTien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemNapTien.getChildByName("iconLight").visible = false;
            this.itemDoithuong.getChildByName("NameNode").setColor(cc.color("#fde612"));
            this.itemDoithuong.getChildByName("iconLight").visible = true;
            this.itemChuyentien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemChuyentien.getChildByName("iconLight").visible = false;
            if (cc.sys.isNative) {
                this.itemIAP.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                this.itemIAP.getChildByName("iconLight").visible = false;
            }


            this.naptienView.visible = false;
            this.chuyentienView.visible = false;
            this.doithuongView.visible = true;
            if (cc.sys.isNative)
                this.iapView.visible = false;

        } else if (index === 2) {//Chuyen
            this.itemNapTien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemNapTien.getChildByName("iconLight").visible = false;
            this.itemDoithuong.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemDoithuong.getChildByName("iconLight").visible = false;
            this.itemChuyentien.getChildByName("NameNode").setColor(cc.color("#fde612"));
            this.itemChuyentien.getChildByName("iconLight").visible = true;
            if (cc.sys.isNative) {
                this.itemIAP.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                this.itemIAP.getChildByName("iconLight").visible = false;
            }

            this.naptienView.visible = false;
            this.chuyentienView.visible = true;
            this.doithuongView.visible = false;
            if (cc.sys.isNative)
                this.iapView.visible = false;
            this.lb_infoChuyenTien.setString("");
            this.clearTextAfterSubmit();
            this.getCaptchaChuyenTien();
        } else {//IAP
            if (cc.sys.isNative) {
                this._controller.sendGetListIAP();
                this.itemNapTien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                this.itemNapTien.getChildByName("iconLight").visible = false;
                this.itemDoithuong.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                this.itemDoithuong.getChildByName("iconLight").visible = false;
                this.itemChuyentien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                this.itemChuyentien.getChildByName("iconLight").visible = false;
                this.itemIAP.getChildByName("NameNode").setColor(cc.color("#fde612"));
                this.itemIAP.getChildByName("iconLight").visible = true;

                this.naptienView.visible = false;
                this.chuyentienView.visible = false;
                this.doithuongView.visible = false;
                this.iapView.visible = true;
            }
        }
    },

    _initMainView: function () {
        this.mainView = new ccui.Widget();
        this.mainView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
        this.addChild(this.mainView);

        //    Item NapTien
        var itemNapTien = this._initItemInNode(0, "Nạp Tiền");
        itemNapTien.setPosition(itemNapTien.width / 2, this.mainView.height - itemNapTien.height / 2);
        itemNapTien.setTouchEnabled(true);
        itemNapTien.getChildByName("NameNode").setColor(cc.color("#fde612"));
        itemNapTien.getChildByName("iconLight").visible = true;
        this.itemNapTien = itemNapTien;
        this.mainView.addChild(itemNapTien);

        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {
            this.mainView.setScale(cc.winSize.screenScale);
            this.naptienView.setScale(cc.winSize.screenScale);
            this.chuyentienView.setScale(cc.winSize.screenScale);
            this.doithuongView.setScale(cc.winSize.screenScale);
            this.iapView.setScale(cc.winSize.screenScale);
            itemNapTien.setPositionX(itemNapTien.width / 2 - 100);
        }


        //    Item Doi Thuong
        var itemDoiThuong = this._initItemInNode(0, "Đổi Tiền");
        itemDoiThuong.getChildByName("NameNode").setColor(cc.color(255, 255, 255, 255));
        itemDoiThuong.setPosition(itemNapTien.x + itemNapTien.width, itemNapTien.y);
        itemDoiThuong.setTouchEnabled(true);
        this.itemDoithuong = itemDoiThuong;
        // itemDoiThuong.visible = false;
        this.mainView.addChild(itemDoiThuong);

        //    Item ChuyenTien
        var itemChuyenTien = this._initItemInNode(0, "Chuyển Tiền");
        itemChuyenTien.getChildByName("NameNode").setColor(cc.color(255, 255, 255, 255));
        itemChuyenTien.setPosition(itemDoiThuong.x + itemChuyenTien.width + 10, itemNapTien.y);
        itemChuyenTien.setTouchEnabled(true);
        // itemChuyenTien.visible = false;
        this.itemChuyentien = itemChuyenTien;
        this.mainView.addChild(itemChuyenTien);


        if (cc.sys.isNative && !cc.sys.os === cc.sys.IOS) {
            //    Item ChuyenTien
            var itemInApp = this._initItemInNode(0, "INAPP");
            itemInApp.getChildByName("NameNode").setColor(cc.color(255, 255, 255, 255));
            // itemInApp.setPosition(itemInApp.width/2, this.mainView.height - itemInApp.height/2);
            itemInApp.setPosition(itemChuyenTien.x + itemInApp.width - 5, itemNapTien.y);
            itemInApp.setTouchEnabled(true);
            this.itemIAP = itemInApp;
            this.mainView.addChild(itemInApp);
        }


        //=== Dành cho lần đầu tiên mở tab lên, sẽ request captcha nạp Tiền
        var thiz = this;
        thiz.getCaptchaNapTien();
        itemNapTien.addClickEventListener(function () {
            itemNapTien.getChildByName("NameNode").setColor(cc.color("#fde612"));
            itemNapTien.getChildByName("iconLight").visible = true;
            itemDoiThuong.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemDoiThuong.getChildByName("iconLight").visible = false;
            itemChuyenTien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemChuyenTien.getChildByName("iconLight").visible = false;
            if (cc.sys.isNative && !cc.sys.os === cc.sys.IOS) {
                itemInApp.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                itemInApp.getChildByName("iconLight").visible = false;
            }

            thiz.naptienView.visible = true;
            thiz.chuyentienView.visible = false;
            thiz.doithuongView.visible = false;
            if (cc.sys.isNative && !cc.sys.os === cc.sys.IOS)
                thiz.iapView.visible = false;
            thiz.getCaptchaNapTien();
            thiz.clearTextNapTien();
            thiz.lb_infoNaptien.setString("");
        });

        itemDoiThuong.addClickEventListener(function () {
            thiz._controller.sendGetListBuyCard();
            itemNapTien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemNapTien.getChildByName("iconLight").visible = false;
            itemDoiThuong.getChildByName("NameNode").setColor(cc.color("#fde612"));
            itemDoiThuong.getChildByName("iconLight").visible = true;
            itemChuyenTien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemChuyenTien.getChildByName("iconLight").visible = false;
            if (cc.sys.isNative && !cc.sys.os === cc.sys.IOS) {
                itemInApp.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                itemInApp.getChildByName("iconLight").visible = false;
            }
            thiz._showListBuyCardWithInDex(0);

            thiz.naptienView.visible = false;
            thiz.chuyentienView.visible = false;
            thiz.doithuongView.visible = true;
            if (cc.sys.isNative && !cc.sys.os === cc.sys.IOS)
                thiz.iapView.visible = false;


        });

        itemChuyenTien.addClickEventListener(function () {
            itemNapTien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemNapTien.getChildByName("iconLight").visible = false;
            itemDoiThuong.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemDoiThuong.getChildByName("iconLight").visible = false;
            itemChuyenTien.getChildByName("NameNode").setColor(cc.color("#fde612"));
            itemChuyenTien.getChildByName("iconLight").visible = true;
            if (cc.sys.isNative && !cc.sys.os === cc.sys.IOS) {
                itemInApp.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                itemInApp.getChildByName("iconLight").visible = false;
            }

            thiz.naptienView.visible = false;
            thiz.chuyentienView.visible = true;
            thiz.doithuongView.visible = false;
            if (cc.sys.isNative && !cc.sys.os === cc.sys.IOS)
                thiz.iapView.visible = false;
            thiz.lb_infoChuyenTien.setString("");
            thiz.clearTextAfterSubmit();
            thiz.getCaptchaChuyenTien();
        });

        if (cc.sys.isNative && !cc.sys.os === cc.sys.IOS) {
            itemInApp.addClickEventListener(function () {
                thiz._controller.sendGetListIAP();
                itemNapTien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                itemNapTien.getChildByName("iconLight").visible = false;
                itemDoiThuong.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                itemDoiThuong.getChildByName("iconLight").visible = false;
                itemChuyenTien.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
                itemChuyenTien.getChildByName("iconLight").visible = false;
                itemInApp.getChildByName("NameNode").setColor(cc.color("#fde612"));
                itemInApp.getChildByName("iconLight").visible = true;

                thiz.naptienView.visible = false;
                thiz.chuyentienView.visible = false;
                thiz.doithuongView.visible = false;
                thiz.iapView.visible = true;
            });
        }
    },
    //================================================================================
    //================================================================================
    //================================ DOI THUONG=====================================
    //================================================================================
    //================================================================================
    _initDoiThuongView: function () {
        this.doithuongView = new ccui.Widget();
        this.doithuongView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height * 0.85));
        this.doithuongView.y = -cc.winSize.height / 2 + this.iapView.height / 2 + 30;
        this.doithuongView.visible = false;
        this.addChild(this.doithuongView);
        // var colorLayer = new cc.LayerColor(cc.color(0, 100, 0, 100), this.doithuongView.width, this.doithuongView.height);
        // this.doithuongView.addChild(colorLayer);

        //    Item Vina
        var itemVina = this._initItemInNode(0, MultiLanguage.getTextByKey("VINA_CARD"));
        // itemVina.setAnchorPoint(cc.p(0, 0));
        itemVina.scale = 0.8;
        itemVina.setPosition(this.doithuongView.width / 2, this.doithuongView.height - itemVina.height / 2);
        itemVina.setTouchEnabled(true);
        this.itemVina = itemVina;
        this.doithuongView.addChild(itemVina);

        //    Item Viettel
        var itemViettel = this._initItemInNode(0, MultiLanguage.getTextByKey("VIETTEL_CARD"));
        // itemViettel.setAnchorPoint(cc.p(0, 0));
        itemViettel.scale = 0.8;
        itemViettel.setPosition(itemVina.x - itemViettel.width * 0.8, itemVina.y);
        itemViettel.setTouchEnabled(true);
        itemViettel.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
        itemViettel.getChildByName("iconLight").visible = true;
        this.itemViettel = itemViettel;
        this.doithuongView.addChild(itemViettel);

        //    Item Mobile
        var _typeMobi = 1;
        var itemMobi = this._initItemInNode(0, MultiLanguage.getTextByKey("MOBI_CARD"));
        itemMobi.scale = 0.8;
        // itemMobi.setAnchorPoint(cc.p(0, 0));
        itemMobi.setPosition(itemVina.x + itemMobi.width * 0.8, itemVina.y);
        itemMobi.setTouchEnabled(true);
        this.itemMobi = itemMobi;
        this.doithuongView.addChild(itemMobi);

        this._typeMobi = _typeMobi;
        var thiz = this;

        itemViettel.addClickEventListener(function () {
            // cc.log("itemViettel Click");
            itemVina.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemVina.getChildByName("iconLight").visible = false;
            itemViettel.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            itemViettel.getChildByName("iconLight").visible = true;
            itemMobi.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemMobi.getChildByName("iconLight").visible = false;
            _typeMobi = 1;
            thiz._typeMobi = _typeMobi;
            thiz._showBuyCardDataWhenChangeTab(thiz.listBuyCard.viettelCard);
        });

        itemVina.addClickEventListener(function () {
            // cc.log("itemVina Click");
            itemVina.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            itemVina.getChildByName("iconLight").visible = true;
            itemViettel.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemViettel.getChildByName("iconLight").visible = false;
            itemMobi.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemMobi.getChildByName("iconLight").visible = false;
            _typeMobi = 2;
            thiz._typeMobi = _typeMobi;
            thiz._showBuyCardDataWhenChangeTab(thiz.listBuyCard.vinaCard);
        });

        itemMobi.addClickEventListener(function () {
            // cc.log("itemMobi Click");
            itemVina.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemVina.getChildByName("iconLight").visible = false;
            itemViettel.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemViettel.getChildByName("iconLight").visible = false;
            itemMobi.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            itemMobi.getChildByName("iconLight").visible = true;
            _typeMobi = 3;
            thiz._typeMobi = _typeMobi;
            thiz._showBuyCardDataWhenChangeTab(thiz.listBuyCard.mobiCard);
        });

    },
    _itemDoiThuong: function (data) {
        var node = new ccui.Widget();
        this.nodeItem = node;
        node.setName("_itemDoiThuong");
        node.setContentSize(cc.size(200, 250));
        // var bgItem = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // bgItem.setPreferredSize(cc.size(node.width, node.width * 0.8));
        // bgItem.setAnchorPoint(0.5, 1);
        // bgItem.setName("bgItem");
        // bgItem.setPosition(node.width / 2, node.height);
        // node.addChild(bgItem);

        // this._loadImageProvider(node, bgItem, data.urlImage);

        var sprite = new cc.Sprite("res/Home/" + data.provider.toLowerCase() + ".png");
        sprite.setName("imageProvider");
        sprite.x = node.width / 2;
        sprite.y = node.height / 2;
        // sprite.scale = 0.6;
        node.addChild(sprite);

        var lb_Gold = new cc.LabelTTF(cc.Global.NumberFormat1(data.price) + " Tiền", "Arial", 25);
        lb_Gold.setAnchorPoint(cc.p(0, 1));
        lb_Gold.setName("lb_Gold");
        lb_Gold.setColor(cc.color(255, 255, 255));
        lb_Gold.setPosition(sprite.x - sprite.width / 2 + 10, sprite.y - sprite.height - 5);
        node.addChild(lb_Gold);
        this.lb_Gold = lb_Gold;

        var doiThuongBtn = this._initItemInNode(1, "ĐỔI THẺ " + cc.Global.NumberFormat2(data.gamecardAmountID));
        doiThuongBtn.scale = node.width / doiThuongBtn.width;
        doiThuongBtn.setAnchorPoint(cc.p(0.5, 1));
        doiThuongBtn.setPosition(sprite.x, lb_Gold.y - lb_Gold.height);
        doiThuongBtn.setTouchEnabled(true);
        node.addChild(doiThuongBtn);

        var thiz = this;

        doiThuongBtn.addClickEventListener(function () {
            thiz._controller.sendBuyCard(thiz._convertProviderByType(thiz._typeMobi), data.gamecardAmountID);
        });

        return node;
    },
    _showListBuyCardWithInDex: function (index) {
        if (index === 0) {//VIETTEL
            this.itemVina.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemVina.getChildByName("iconLight").visible = false;
            this.itemViettel.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            this.itemViettel.getChildByName("iconLight").visible = true;
            this.itemMobi.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemMobi.getChildByName("iconLight").visible = false;
            this._typeMobi = 1;
            // this._showBuyCardDataWhenChangeTab(this.listBuyCard.viettelCard);
        } else if (index === 1) {//VINA
            this.itemVina.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            this.itemVina.getChildByName("iconLight").visible = true;
            this.itemViettel.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemViettel.getChildByName("iconLight").visible = false;
            this.itemMobi.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemMobi.getChildByName("iconLight").visible = false;
            this._typeMobi = 2;
            // this._showBuyCardDataWhenChangeTab(this.listBuyCard.vinaCard);
        } else {
            this.itemVina.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemVina.getChildByName("iconLight").visible = false;
            this.itemViettel.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            this.itemViettel.getChildByName("iconLight").visible = false;
            this.itemMobi.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            this.itemMobi.getChildByName("iconLight").visible = true;
            this._typeMobi = 3;
            // this._showBuyCardDataWhenChangeTab(this.listBuyCard.mobiCard);
        }
    },
    _loadImageProvider: function (node, background, url) {
        TextureDownloader.load(url, function (tex) {
            cc.spriteFrameCache.addSpriteFrames(url, tex);
            var sprite = new cc.Sprite(tex);
            sprite.setName("imageProvider");
            sprite.x = background.width / 2;
            sprite.y = background.height / 2 + 90;
            sprite.scale = 0.6;
            node.addChild(sprite);
        });
    },
    _convertProviderByType: function (type) {
        var _provider = "";
        switch (type) {
            case 1:
                _provider = "VIETTEL";
                break;
            case 2:
                _provider = "VINAPHONE";
                break;
            case 3:
                _provider = "MOBIFONE";
                break;
        }
        return _provider;
    },
    _onGetListBuyCard: function (result) {
        var length = result.length;
        this.listBuyCard = {};
        this.listBuyCard.vinaCard = [];
        this.listBuyCard.mobiCard = [];
        this.listBuyCard.viettelCard = [];
        for (var i = 0; i < length; i++) {
            var dataListCard = {};
            dataListCard.seqId = result[i]["1"];
            dataListCard.gamecardAmountID = result[i]["2"];
            dataListCard.price = result[i]["3"];
            dataListCard.tax = result[i]["4"];
            dataListCard.provider = result[i]["5"];
            dataListCard.enable = result[i]["6"];
            dataListCard.urlImage = result[i]["8"];
            switch (dataListCard.provider) {
                case "VIETTEL":
                    this.listBuyCard.viettelCard.push(dataListCard);
                    break;
                case "VINAPHONE":
                    this.listBuyCard.vinaCard.push(dataListCard);
                    break;
                case "MOBIFONE":
                    this.listBuyCard.mobiCard.push(dataListCard);
                    break;
            }
        }

        this._showBuyCardDataWhenChangeTab(this.listBuyCard.viettelCard);
    },

    _showBuyCardDataWhenChangeTab: function (data) {
        if (this.nodeItem)
            this.doithuongView.removeNode(this.nodeItem, true);

        for (var i = 0; i < data.length; i++) {
            var _itemDoiThuong = this._itemDoiThuong(data[i]);
            if (i < 3) {
                _itemDoiThuong.setAnchorPoint(0.5, 0);
                _itemDoiThuong.setPosition(this.doithuongView.width / 2 + (i - 1) * _itemDoiThuong.width * 1.5, _itemDoiThuong.height + 20);
            } else {
                _itemDoiThuong.setAnchorPoint(0.5, 0);
                _itemDoiThuong.setPosition(this.doithuongView.width / 2 + (i - 4) * _itemDoiThuong.width * 1.5, 10);
            }
            this.doithuongView.addChild(_itemDoiThuong);
        }
    },
    _onBuyCardResponse: function (data) {
        // PlayerMe.gold = data["coin"];
        // if (cc.sys.os === cc.sys.OS_ANDROID) {
        //     jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logEventFirebase", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "add_payment_info", "Đổi success", "Đổi success");
        // }
        // else if (cc.sys.os === cc.sys.OS_IOS)
        //     jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Đổi success", "Đổi success");

        GlobalEvent.getInstance().postEvent("assetChange", data["coin"]);
        var dialog = new HomeNotifyPopup();
        dialog.showNotification("Bạn đã đổi thành công thẻ " + this._convertProviderByType(this._typeMobi).toUpperCase() + " mệnh giá " + data["amount"]
            + ".\nSố serial: " + data["cardSerial"] + "\nMã thẻ: " + data["cardCode"] + "\nHãy vào lịch sử giao dịch để lấy mã thẻ.");

        var thiz = this;
        // if (!cc.sys.isNative) {
        //     ga('create', 'UA-115654005-1', 'auto');
        //     ga(function (tracker) {
        //         tracker.send('event', 'Đổi thưởng ' + thiz._convertProviderByType(thiz._typeMobi), 'Buy Success ' + data["amount"], 'Đổi thẻ thành công: ' + PlayerMe.username);
        //     });
        // }
    },
    //=== ShowError ===
    _showErrorDoiThuong: function (code) {
        var message = "";
        switch (code) {
            case -2101:
                message = MultiLanguage.getTextByKey("BUYCARD_USER_NOT_FOUND");
                break;
            case -2102:
                message = MultiLanguage.getTextByKey("BUYCARD_COIN_NOT_ENOUGH");
                break;
            case -2103:
                message = MultiLanguage.getTextByKey("BUYCARD_USER_NOT_VERIFY");
                break;
            case -2104:
                message = MultiLanguage.getTextByKey("BUYCARD_REACH_MAX");
                break;
            case -2105:
                message = MultiLanguage.getTextByKey("BUYCARD_SYSTEM_BUSY");
                break;
            case -2106:
                message = MultiLanguage.getTextByKey("BUYCARD_PURCHASE_NOT_ENOUGH");
                break;
            case -2107:
                message = MultiLanguage.getTextByKey("BUYCARD_OUT_STOCK");
                break;
        }
        var dialog = new HomeNotifyPopup();
        dialog.showNotification(MultiLanguage.getTextByKey(message));
        var thiz = this;
        if (!cc.sys.isNative) {
            ga('create', 'UA-115654005-1', 'auto');
            ga(function (tracker) {
                tracker.send('event', 'Đổi thưởng ' + thiz._convertProviderByType(thiz._typeMobi), message, 'Đổi lỗi: ' + PlayerMe.username);
            });
        }
    },
    //================================================================================
    //================================================================================
    //============================== CHUYEN TIEN===================================
    //================================================================================
    //================================================================================
    _initChuyenTienView: function () {
        this.chuyentienView = new ccui.Widget();
        this.chuyentienView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height * 0.8));
        this.chuyentienView.y = -cc.winSize.height / 2 + this.iapView.height / 2 + 30;
        this.chuyentienView.visible = false;
        this.addChild(this.chuyentienView);

        var line = new cc.Sprite("#seperate_line_baomat.png");
        // line.setName("iconLight");
        line.scaleX = 1.5;
        line.scaleY = 2;
        line.setPosition(this.chuyentienView.width / 2 - 30, this.chuyentienView.height / 2);
        this.chuyentienView.addChild(line);


        //=============INPUT ZONE
        var _spacing = 85;

        //===============Send To Account
        var senToBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        senToBg.setPreferredSize(cc.size(500, 75));
        senToBg.setPosition(senToBg.width / 2 + 60, this.chuyentienView.height - senToBg.height / 2);
        this.chuyentienView.addChild(senToBg);

        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {
            senToBg.setPositionX(senToBg.width / 2 - 40);
        }

        var senToTF = new MultiLanguage.createNewUITextField("SEND_TO_TYPE", cc.size(480, 75),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        senToTF.setTextColor(cc.color(255, 255, 255));
        senToTF.setPlaceHolderColor(cc.color(145, 143, 144));
        senToTF.setPosition(senToBg.x, senToBg.y);
        this.senToTF = senToTF;
        this.chuyentienView.addChild(senToTF);

        //===============Re Send To Account
        var senToBg2 = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        senToBg2.setPreferredSize(cc.size(500, 75));
        senToBg2.setPosition(senToBg.x, senToBg.y - _spacing);
        this.chuyentienView.addChild(senToBg2);

        var senToTF2 = new MultiLanguage.createNewUITextField("RE_SEND_TO_TYPE", cc.size(480, 75),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        senToTF2.setTextColor(cc.color(255, 255, 255));
        senToTF2.setPlaceHolderColor(cc.color(145, 143, 144));
        senToTF2.setPosition(senToBg2.x, senToBg2.y);
        this.senToTF2 = senToTF2;
        this.chuyentienView.addChild(senToTF2);

        //===============OTP CODE
        var otpBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        otpBg.setPreferredSize(cc.size(500, 75));
        otpBg.setPosition(senToBg2.x, senToBg2.y - _spacing);
        this.chuyentienView.addChild(otpBg);

        var otpTF = new MultiLanguage.createNewUITextField("OTP_TYPE_HERE", cc.size(480, 75),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        otpTF.setTextColor(cc.color(255, 255, 255));
        otpTF.setPlaceHolderColor(cc.color(145, 143, 144));
        otpTF.setPosition(otpBg.x, otpBg.y);
        this.otpTF = otpTF;
        this.chuyentienView.addChild(otpTF);

        //===============MONEY
        var moneyBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        moneyBg.setPreferredSize(cc.size(500, 75));
        moneyBg.setPosition(otpBg.x, otpBg.y - _spacing);
        this.chuyentienView.addChild(moneyBg);

        var moneyTF = new MultiLanguage.createNewUITextField("MONEY_SEND_TYPE", cc.size(480, 75),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        moneyTF.setMaxLength(26);
        moneyTF.setTextColor(cc.color(255, 255, 255));
        moneyTF.setPlaceHolderColor(cc.color(145, 143, 144));
        moneyTF.setPosition(moneyBg.x, moneyBg.y);
        this.moneyTF = moneyTF;
        this.chuyentienView.addChild(moneyTF);

        //===============LABEL PERCENT FEE
        var lb_fee1 = MultiLanguage.createLabelTTFFont("TRANSFER_FEE", cc.res.font.Myriad_Pro_Regular, 28);
        lb_fee1.setAnchorPoint(0, 0.5);
        // lb_fee1.setFontFillColor(cc.color(255,255,89));
        lb_fee1.setPosition(moneyBg.x - moneyBg.width / 2, moneyBg.y - _spacing + 20);
        this.chuyentienView.addChild(lb_fee1);

        var lb_sendFee = MultiLanguage.createLabelTTFFont(": 2% ", cc.res.font.Myriad_Pro_Regular, 28);
        lb_sendFee.setAnchorPoint(0, 0.5);
        lb_sendFee.setFontFillColor(cc.color(255, 255, 89));
        lb_sendFee.setPosition(lb_fee1.x + lb_fee1.width, lb_fee1.y);
        this.chuyentienView.addChild(lb_sendFee);


        //===============LABEL MONEY FEE
        var lb_fee2 = MultiLanguage.createLabelTTFFont("AMOUNT_DEDUCTED", cc.res.font.Myriad_Pro_Regular, 28);
        lb_fee2.setAnchorPoint(0, 0.5);
        // lb_fee.setFontFillColor(cc.color(255,255,89));
        lb_fee2.setPosition(lb_fee1.x, lb_fee1.y - _spacing + 50);
        this.chuyentienView.addChild(lb_fee2);

        var lb_moneyFee = MultiLanguage.createLabelTTFFont("0", cc.res.font.Myriad_Pro_Regular, 28);
        lb_moneyFee.setAnchorPoint(0, 0.5);
        lb_moneyFee.setFontFillColor(cc.color(255, 255, 89));
        lb_moneyFee.setPosition(lb_fee2.x + lb_fee2.width, lb_fee2.y);
        this.lb_moneyFee = lb_moneyFee;
        this.chuyentienView.addChild(lb_moneyFee);
        var thiz = this;
        this.moneyTF.setTextChangeListener(function (type, text) {
            if (type === newui.TextField.INSERT_TEXT || type === newui.TextField.DELETE_TEXT) {
                thiz._setMoneyValue(text);
            }
        });

        //=============== CaptCha ==========
        var captchaBgChuyenTien = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        captchaBgChuyenTien.setAnchorPoint(0, 0.5);
        captchaBgChuyenTien.setPreferredSize(cc.size(250, 75));
        captchaBgChuyenTien.setPosition(lb_fee2.x, lb_fee2.y - _spacing + 30);
        this.chuyentienView.addChild(captchaBgChuyenTien);

        var captchaTFChuyenTien = new MultiLanguage.createNewUITextField("CAPTCHA_TYPE_HERE", cc.size(250, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        captchaTFChuyenTien.setTextColor(cc.color(255, 255, 255));
        captchaTFChuyenTien.setPlaceHolderColor(cc.color(145, 143, 144));

        captchaTFChuyenTien.setPosition(captchaBgChuyenTien.x + captchaBgChuyenTien.width / 2, captchaBgChuyenTien.y);
        this.chuyentienView.addChild(captchaTFChuyenTien);
        this.captchaRegChuyenTien = captchaTFChuyenTien;

        var btnRefreshCaptchaChuyenTien = new ccui.Button("icon_refesh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnRefreshCaptchaChuyenTien.scale = 0.68;
        btnRefreshCaptchaChuyenTien.setName("btnRefesh");
        btnRefreshCaptchaChuyenTien.setPosition(lb_fee2.x + lb_fee2.width + 320, captchaBgChuyenTien.y);
        this.chuyentienView.addChild(btnRefreshCaptchaChuyenTien);

        btnRefreshCaptchaChuyenTien.addClickEventListener(function () {
            thiz.getCaptchaChuyenTien();
        });

        //=============== INFO
        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 28);
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(moneyBg.x, captchaBgChuyenTien.y - _spacing + 30);
        this.chuyentienView.addChild(lb_info);
        this.lb_infoChuyenTien = lb_info;
        //=============== BUTTON CHUYEN KHOAN

        var sendToBtn = this._initItemInNode(1, MultiLanguage.getTextByKey("OK_BUTTON"));
        sendToBtn.setPosition(lb_info.x, lb_info.y - _spacing + 30);
        sendToBtn.setTouchEnabled(true);
        this.chuyentienView.addChild(sendToBtn);

        //======================
        //====================== INFO ZONE
        //======================

        //    Item Store
        var itemStore = this._initItemInNode(0, MultiLanguage.getTextByKey("AGENT_LIST"));
        itemStore.scale = 0.7;
        itemStore.setPosition(this.chuyentienView.width / 2 + itemStore.width * 0.75, this.chuyentienView.height - itemStore.height * 0.25);
        itemStore.setTouchEnabled(true);
        itemStore.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
        itemStore.getChildByName("iconLight").visible = true;
        this.chuyentienView.addChild(itemStore);

        //====================== INFO NOTE
        //    Item Note
        var itemNote = this._initItemInNode(0, MultiLanguage.getTextByKey("REGULATION"));
        itemNote.getChildByName("NameNode").setColor(cc.color(255, 255, 255, 255));
        itemNote.scale = 0.7;
        itemNote.setPosition(itemStore.x + itemStore.width * 0.75, itemStore.y);
        itemNote.setTouchEnabled(true);
        this.chuyentienView.addChild(itemNote);

        //Note Content
        var viewNoteContent = new ccui.Widget();
        viewNoteContent.setContentSize(cc.size(560, 350));
        viewNoteContent.setAnchorPoint(cc.p(0.5, 1));
        viewNoteContent.setPosition(this.chuyentienView.width - viewNoteContent.width / 2 - 50, itemStore.y - itemStore.height / 2);
        viewNoteContent.visible = false;
        this.chuyentienView.addChild(viewNoteContent);

        var bgItem = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(viewNoteContent.width, viewNoteContent.height));
        bgItem.setPosition(viewNoteContent.width / 2, viewNoteContent.height / 2);
        viewNoteContent.addChild(bgItem);

        // var content = "Quy định đối với việc chuyển Tiền:" +
        //     "\n- Phí chuyển Tiền 2% mỗi giao dịch." +
        //     "\n- Giá trị chuyển Tiền tối thiểu phải là bội số của 1.000, \nvà tối thiểu là 10.000 Tiền." +
        //     "\n- Hệ thống không chịu trách nhiệm với việc chuyển sai tài khoản.\n" +
        //     "\nĐể nhận mã OTP:" +
        //     "\n- Nhắn tin OTP gửi 8xxx." +
        //     "\n- Tin nhắn có giá trị 500 Đồng.";
        var contentLabel = new cc.LabelTTF(MultiLanguage.getTextByKey("TRANSFER_REGULATION"), cc.res.font.Myriad_Pro_Regular, 23, cc.size(540, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        contentLabel.setAnchorPoint(0.5, 1);
        if (!cc.sys.isNative)
            contentLabel.setLineHeight(30);
        contentLabel.setPosition(viewNoteContent.width / 2, viewNoteContent.height - 20);
        viewNoteContent.addChild(contentLabel);

        //====================== INFO DAILY
        var viewListDaiLy = new ccui.Widget();
        viewListDaiLy.setContentSize(cc.size(620, 500));
        viewListDaiLy.setAnchorPoint(cc.p(1, 1));
        viewListDaiLy.setPosition(this.chuyentienView.width - 20, itemStore.y - itemStore.height / 2);
        this.chuyentienView.addChild(viewListDaiLy);
        this.viewListDaiLy = viewListDaiLy;

        if (cc.winSize.height / cc.winSize.width === 4 / 3 || cc.winSize.height / cc.winSize.width === 3 / 4) {
            viewNoteContent.setPositionX(this.chuyentienView.width - viewNoteContent.width / 2 + 85);
            viewListDaiLy.setPositionX(this.chuyentienView.width + 150);
        }

        // var colorLayer = new cc.LayerColor(cc.color(0, 100, 0, 100), this.viewListDaiLy.width, this.viewListDaiLy.height);
        // this.viewListDaiLy.addChild(colorLayer);

        this._initHeaderDaily();

        var scrollViewDaily = new newui.TableView(cc.size(620, 400), 1);
        scrollViewDaily.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollViewDaily.setScrollBarEnabled(false);
        scrollViewDaily.setTouchEnabled(true);
        scrollViewDaily.setBounceEnabled(true);
        scrollViewDaily.setAnchorPoint(cc.p(0.5, 1));
        scrollViewDaily.setPosition(this.viewListDaiLy.width / 2, this.viewListDaiLy.height - 60);
        this.viewListDaiLy.addChild(scrollViewDaily, 1);

        // var container = this._createItemDaiLy();
        // scrollViewDaily.pushItem(container);


        var thiz = this;
        itemStore.addClickEventListener(function () {
            // cc.log("itemStore Click");
            itemStore.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            itemStore.getChildByName("iconLight").visible = true;
            itemNote.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemNote.getChildByName("iconLight").visible = false;

            viewNoteContent.visible = false;
            thiz.viewListDaiLy.visible = true;
        });

        itemNote.addClickEventListener(function () {
            // cc.log("itemNote Click");
            itemStore.getChildByName("NameNode").setColor(cc.color(255, 255, 255));
            itemStore.getChildByName("iconLight").visible = false;
            itemNote.getChildByName("NameNode").setColor(cc.color(252, 194, 81));
            itemNote.getChildByName("iconLight").visible = true;

            thiz.viewListDaiLy.visible = false;
            viewNoteContent.visible = true;
        });

        sendToBtn.addClickEventListener(function () {
            sendToBtn.setScale(1.05);
            setTimeout(function () {
                sendToBtn.setScale(1);
            }, 100);
            var captchaText = captchaTFChuyenTien.getText();
            cc.Global.sendVerifyCaptcha(cc.Global.captchaData.token, captchaText, function () {
                if (thiz.checkBeforeSubmitChuyenTien(senToTF.getText(), senToTF2.getText(), otpTF.getText(), moneyTF.getText(), captchaTFChuyenTien.getText())) {
                    thiz._controller.sendTranfer(senToTF.getText(), parseFloat(moneyTF.getText()), otpTF.getText());
                } else {
                    thiz.getCaptchaChuyenTien();
                }
            });
        });
    },
    _setMoneyValue: function (value) {
        this.lb_moneyFee.setString(cc.Global.NumberFormat1(Math.floor(value * 1.02)));
    },
    _initHeaderDaily: function () {
        var container = this._createEntryBarDaily(true);
        var headerSize = 20;
        var daily = new cc.LabelTTF("Đại Lý", cc.res.font.Myriad_Pro_Regular, headerSize);
        daily.setColor(new cc.Color(60, 60, 60));
        // daily.setPosition(40,30);
        var _cell1 = container.getChildByName("cell1");
        daily.setPosition(_cell1.x + _cell1.width / 2, 30);
        container.addChild(daily);

        var taikhoan = new cc.LabelTTF("Tài Khoản", cc.res.font.Myriad_Pro_Regular, headerSize);
        taikhoan.setColor(new cc.Color(60, 60, 60));
        // taikhoan.setPosition(553, 30);
        var _cell2 = container.getChildByName("cell2");
        taikhoan.setPosition(_cell2.x + _cell2.width / 2, 30);
        container.addChild(taikhoan);

        var sodienthoai = new cc.LabelTTF("Số điện thoại", cc.res.font.Myriad_Pro_Regular, headerSize);
        sodienthoai.setColor(new cc.Color(60, 60, 60));
        // sodienthoai.setPosition(853, 30);
        var _cell3 = container.getChildByName("cell3");
        sodienthoai.setPosition(_cell3.x + _cell3.width / 2, 30);
        container.addChild(sodienthoai);

        var khuvuc = new cc.LabelTTF("Khu Vực", cc.res.font.Myriad_Pro_Regular, headerSize);
        khuvuc.setColor(new cc.Color(60, 60, 60));
        // trietkhau.setPosition(553, 30);
        var _cell4 = container.getChildByName("cell4");
        khuvuc.setPosition(_cell4.x + _cell4.width / 2, 30);
        container.addChild(khuvuc);

        var facebook = new cc.LabelTTF("Facebook", cc.res.font.Myriad_Pro_Regular, headerSize);
        facebook.setColor(new cc.Color(60, 60, 60));
        // tongtien.setPosition(853, 30);
        var _cell5 = container.getChildByName("cell5");
        facebook.setPosition(_cell5.x + _cell5.width / 2, 30);
        container.addChild(facebook);

        container.setPosition(this.viewListDaiLy.width / 2, this.viewListDaiLy.height - 30);
        this.viewListDaiLy.addChild(container);
    },
    _createEntryBarDaily: function (isDark) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(620, 57));
        var opacity = 255;//Math.floor(isDark ? (255 * 0.6) : (255 * 0.3));
        var color = cc.color("#d7cecf");


        var cell1 = new cc.LayerColor(color, 120, res.height);
        cell1.setPosition(0, 0);
        cell1.setName("cell1");
        cell1.setOpacity(opacity);
        res.addChild(cell1);

        var cell2 = new cc.LayerColor(color, 100, res.height);
        cell2.setPosition(cell1.x + cell1.width, 0);
        cell2.setName("cell2");
        cell2.setOpacity(opacity);
        res.addChild(cell2);

        var cell3 = new cc.LayerColor(color, 150, res.height);
        cell3.setPosition(cell2.x + cell2.width, 0);
        cell3.setName("cell3");
        cell3.setOpacity(opacity);
        res.addChild(cell3);

        var cell4 = new cc.LayerColor(color, 100, res.height);
        cell4.setPosition(cell3.x + cell3.width, 0);
        cell4.setName("cell4");
        cell4.setOpacity(opacity);
        res.addChild(cell4);

        var cell5 = new cc.LayerColor(color, 150, res.height);
        cell5.setPosition(cell4.x + cell4.width, 0);
        cell5.setName("cell5");
        cell5.setOpacity(opacity);
        res.addChild(cell5);

        return res;
    },
    _createItemDaiLy: function (items, _i) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(620, 57));
        var color = cc.color("#d7cecf");
        var cell = new cc.LayerColor(color, 620, 57);
        res.addChild(cell);
        if (_i % 2 === 0) {
            cell.setOpacity(50);
        } else {
            cell.setOpacity(100);
        }
        var font = cc.res.font.Myriad_Pro_Regular;
        var fontSize = 18;
        // var _name = new cc.LabelTTF(items.name, font, fontSize);
        var _name = new cc.LabelTTF("KIM NGÂN", font, fontSize);
        _name.setPosition(60, res.height / 2);
        res.addChild(_name);

        // var _account = new cc.LabelTTF(items.account, font, fontSize);
        var _account = new cc.LabelTTF("dailykimngan", font, fontSize);
        _account.setAnchorPoint(cc.p(0.5, 0.5));
        _account.setPosition(170, res.height / 2);
        res.addChild(_account);

        // var _phoneNum = new cc.LabelTTF(items.phoneNum, font, fontSize);
        var _phoneNum = new cc.LabelTTF("01266696986", font, fontSize);
        _phoneNum.setAnchorPoint(cc.p(0.5, 0.5));
        _phoneNum.setPosition(295, res.height / 2);
        res.addChild(_phoneNum);

        // var _local = new cc.LabelTTF(items.local, font, fontSize);
        var _local = new cc.LabelTTF("HN", font, fontSize);
        _local.setAnchorPoint(cc.p(0.5, 0.5));
        _local.setPosition(420, res.height / 2);
        res.addChild(_local);

        // var _facebook = new cc.LabelTTF(items.facebook, font, fontSize);
        var _facebook = new ccui.Button("", "", "", ccui.Widget.PLIST_TEXTURE);
        _facebook.setTitleText("FACEBOOK");
        _facebook.setAnchorPoint(cc.p(0.5, 0.5));
        // _facebook.setTouchEnabled(true);
        _facebook.setPosition(550, res.height / 2);
        res.addChild(_facebook);

        _facebook.addClickEventListener(function () {
            if (!cc.sys.isNative) window.open("https://www.facebook.com/dailykimngan");
        });

        return res;
    },
    ivtTimeChuyenTien: -1,
    getCaptchaChuyenTien: function () {
        cc.Global.bGetCaptcha = false;
        cc.Global.getUrlCaptcha();
        clearInterval(this.ivtTimeChuyenTien);
        if (this.chuyentienView.getChildByName("sprCaptcha"))
            this.chuyentienView.getChildByName("sprCaptcha").removeFromParent();
        var thiz = this;
        this.ivtTimeChuyenTien = setInterval(function () {
            if (cc.Global.bGetCaptcha) {
                var url = cc.Global.captchaData.urlCaptcha;
                TextureDownloader.load(url, function (tex) {
                    cc.spriteFrameCache.addSpriteFrames(url, tex);
                    var sprite = new cc.Sprite(tex);
                    sprite.setName("sprCaptcha");
                    sprite.x = thiz.captchaRegChuyenTien.x + 220;
                    sprite.y = thiz.captchaRegChuyenTien.y;
                    sprite.scale = 60 / sprite.height;
                    thiz.chuyentienView.addChild(sprite);
                });
                clearInterval(thiz.ivtTimeChuyenTien);
            }
        }, 100);
    },
    checkBeforeSubmitChuyenTien: function (toUser, reToUser, OTP, money, captcha) {
        var validation = {
            isNotEmpty: function (str) {
                var pattern = /\S+/;
                return pattern.test(str);  // returns a boolean
            },
            isNumber: function (str) {
                var pattern = /^\d+$/;
                return pattern.test(str);  // returns a boolean
            }
        };

        var _money = parseFloat(money);
        var thiz = this;

        if (!validation.isNotEmpty(toUser)) {
            this.lb_infoChuyenTien.setString(MultiLanguage.getTextByKey("TRANS_USER_NOT_EMPTY"));
            return false;
        } else if (!validation.isNotEmpty(reToUser)) {
            this.lb_infoChuyenTien.setString(MultiLanguage.getTextByKey("TRANS_RE_USER_NOT_EMPTY"));
            return false;
        } else if (!validation.isNotEmpty(OTP)) {
            this.lb_infoChuyenTien.setString(MultiLanguage.getTextByKey("TRANS_OTP_NOT_EMPTY"));
            return false;
        } else if (!validation.isNotEmpty(money)) {
            this.lb_infoChuyenTien.setString(MultiLanguage.getTextByKey("TRANS_MONEY_NOT_EMPTY"));
            return false;
        } else if (!validation.isNotEmpty(captcha)) {
            this.lb_infoChuyenTien.setString(MultiLanguage.getTextByKey("TRANS_CAPTCHA_NOT_EMPTY"));
            return false;
        } else if (!validation.isNumber(money)) {
            this.lb_infoChuyenTien.setString(MultiLanguage.getTextByKey("TRANS_MONEY_INVALID"));
            return false;
        } else if (_money <= 10000 || _money > PlayerMe.gold) {
            this.lb_infoChuyenTien.setString(MultiLanguage.getTextByKey("TRANS_MONEY_BIGGER"));
            return false;
        } else if (toUser !== reToUser) {
            this.lb_infoChuyenTien.setString(MultiLanguage.getTextByKey("TRANS_USER_DIFF"));
            return false;
        } else if (cc.Global.isVerify === false) {
            this.lb_infoChuyenTien.setString(MultiLanguage.getTextByKey("TRANS_CAPTCHA_INVALID"));
            thiz.captchaRegChuyenTien.setText("");

            return false;
        }
        return true;
    },
    _onGetTransferResutlSuccess: function (coin) {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logEventFirebase", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "add_payment_info", "Chuyển Tiền", "Chuyển Tiền");
        }
        else if (cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Chuyển Tiền", "Chuyển Tiền");

        this.clearTextAfterSubmit();
        var dialog = new HomeNotifyPopup();
        dialog.showNotification(MultiLanguage.getTextByKey("Giao dịch thành công!"));
        GlobalEvent.getInstance().postEvent("assetChange", coin);

        var thiz = this;
        if (!cc.sys.isNative) {
            ga('create', 'UA-115654005-1', 'auto');
            ga(function (tracker) {
                tracker.send('event', 'Chuyển khoản', 'Thành công: ' + coin, 'Chuyển từ tài khoản: ' + PlayerMe.username + ' đến tài khoản: ' + thiz.senToTF.getText());
            });
        }
    },
    clearTextAfterSubmit: function () {
        this.senToTF.setText("");
        this.senToTF2.setText("");
        this.otpTF.setText("");
        this.moneyTF.setText("");
        this.captchaRegChuyenTien.setText("");
    },
    //=== ShowError ===
    _showErrorChuyenTien: function (code) {
        var message = "";
        switch (code) {
            case -1901:
                message = MultiLanguage.getTextByKey("TRANS_SENDER_NOT_FOUND");
                break;
            case -1902:
                message = MultiLanguage.getTextByKey("TRANS_PHONE_NOT_VERIFY");
                break;
            case -1903:
                message = MultiLanguage.getTextByKey("TRANS_RECEIVER_NOT_FOUND");
                break;
            case -1904:
                message = MultiLanguage.getTextByKey("TRANS_WRONG_OTP");
                break;
            case -1905:
                message = MultiLanguage.getTextByKey("TRANS_MONEY_NOT_ENOUGH");
                break;
            case -1906:
                message = MultiLanguage.getTextByKey("TRANS_AMOUNT_INVALID");
                break;
            case -1907:
                message = MultiLanguage.getTextByKey("TRANS_AMOUNT_TO_BIG");
                break;
            case -1908:
                message = MultiLanguage.getTextByKey("TRANS_BETTING_NOT_ENOUGH");
                break;
            case -1909:
                message = MultiLanguage.getTextByKey("TRANS_WIN_NOT_ENOUGH");
                break;
        }
        this.lb_infoChuyenTien.setString(message);
        this.getCaptchaChuyenTien();
        // if (!cc.sys.isNative) {
        //     ga('create', 'UA-115654005-1', 'auto');
        //     ga(function (tracker) {
        //         tracker.send('event', 'Chuyển khoản lỗi', message, 'Tài khoản: ' + PlayerMe.username);
        //     });
        // }
    },
    //================================================================================
    //================================================================================
    //==============================NAP THE VIEW======================================
    //================================================================================
    //================================================================================
    _initNapTienView: function () {
        this.naptienView = new ccui.Widget();
        this.naptienView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height * 0.8));
        this.naptienView.y = -cc.winSize.height / 2 + this.iapView.height / 2 + 30;
        // this.naptienView.visible = false;
        this.addChild(this.naptienView);

        var line = new cc.Sprite("#seperate_line_baomat.png");
        // line.setName("iconLight");
        line.scaleX = 1.5;
        line.scaleY = 2;
        line.setPosition(this.naptienView.width / 2, this.naptienView.height / 2);
        this.naptienView.addChild(line);

        //    INPUT ZONE
        var btnNhaMang = this._itemNhaMang();
        btnNhaMang.setPosition(btnNhaMang.width / 2 + 60, this.naptienView.height - btnNhaMang.height);
        btnNhaMang.setTouchEnabled(true);

        this.naptienView.addChild(btnNhaMang);

        var _spacing = 90;

        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {
            btnNhaMang.setPositionX(btnNhaMang.width / 2 - 50);
        }


        // //===============Seri
        var seriBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        seriBg.setPreferredSize(cc.size(500, 80));
        seriBg.setPosition(btnNhaMang.x, btnNhaMang.y - _spacing);
        this.naptienView.addChild(seriBg);

        var seriTF = new MultiLanguage.createNewUITextField("SERI_NUMBER_TYPE", cc.size(480, 80),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        seriTF.setTextColor(cc.color(255, 255, 255));
        seriTF.setPlaceHolderColor(cc.color(145, 143, 144));
        seriTF.setPosition(seriBg.x, seriBg.y);
        this.seriTFNapTien = seriTF;
        this.naptienView.addChild(seriTF);

        // //===============CardNumber
        var numberBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        numberBg.setPreferredSize(cc.size(500, 80));
        numberBg.setPosition(seriBg.x, seriBg.y - _spacing);
        this.naptienView.addChild(numberBg);

        var numberTF = new MultiLanguage.createNewUITextField("CODE_NUMBER_TYPE", cc.size(480, 80),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        numberTF.setTextColor(cc.color(255, 255, 255));
        numberTF.setPlaceHolderColor(cc.color(145, 143, 144));
        numberTF.setPosition(numberBg.x, numberBg.y);
        this.numberTFNapTien = numberTF;
        this.naptienView.addChild(numberTF);

        var menhgiatheBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        menhgiatheBg.setPreferredSize(cc.size(500, 80));
        menhgiatheBg.setPosition(numberBg.x, numberBg.y - _spacing);
        this.naptienView.addChild(menhgiatheBg);

        var menhgiatheTF = new MultiLanguage.createNewUITextField("CODE_MENHGIATHE_TYPE", cc.size(480, 80),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        menhgiatheTF.setTextColor(cc.color("#ffffff"));
        menhgiatheTF.setPlaceHolderColor(cc.color("#918f90"));
        menhgiatheTF.setPosition(menhgiatheBg.x, menhgiatheBg.y);
        this.menhgiatheTFNapTien = menhgiatheTF;
        this.naptienView.addChild(menhgiatheTF);

        var captchaBg = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        captchaBg.setPreferredSize(cc.size(250, 80));
        captchaBg.setPosition(menhgiatheBg.x - menhgiatheBg.width / 2 + captchaBg.width / 2, menhgiatheBg.y - _spacing);
        this.naptienView.addChild(captchaBg);

        var captchaTFNapTien = new MultiLanguage.createNewUITextField("CAPTCHA_TYPE_HERE", cc.size(250, 48),
            cc.res.font.Myriad_Pro_Regular, 35, cc.res.font.Myriad_Pro_Regular, 35);
        captchaTFNapTien.setTextColor(cc.color(255, 255, 255));
        captchaTFNapTien.setPlaceHolderColor(cc.color(145, 143, 144));

        captchaTFNapTien.setPosition(captchaBg.x, captchaBg.y);
        this.naptienView.addChild(captchaTFNapTien);
        this.captchaGiftcodeTF = captchaTFNapTien;


        var btnRefreshCaptchaNapTien = new ccui.Button("icon_refesh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnRefreshCaptchaNapTien.scale = 0.68;
        btnRefreshCaptchaNapTien.setName("btnRefeshNapTien");
        // btnRefreshCaptchaNapTien.setZoomScale(1.5);
        btnRefreshCaptchaNapTien.setPosition(captchaTFNapTien.x + captchaTFNapTien.width + 100, captchaBg.y);
        this.naptienView.addChild(btnRefreshCaptchaNapTien, 2);
        var thiz = this;
        btnRefreshCaptchaNapTien.addClickEventListener(function () {
            thiz.getCaptchaNapTien();
        });

        //=============== INFO
        // var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 28);
        // lb_info.setFontFillColor(cc.color(255, 255, 89));
        // lb_info.setPosition(numberBg.x, captchaBg.y - _spacing);
        // this.naptienView.addChild(lb_info);
        // this.lb_infoNaptien = lb_info;

        //=============== BUTTON

        var naptheBtn = this._initItemInNode(1, MultiLanguage.getTextByKey("OK_BUTTON"));
        // baoMatBtn.setAnchorPoint(cc.p(0, 0));
        naptheBtn.setPosition(numberBg.x, captchaBg.y - _spacing);
        naptheBtn.setTouchEnabled(true);
        this.naptienView.addChild(naptheBtn);

        var viewNetworks = new ccui.Widget();
        viewNetworks.setContentSize(cc.size(500, 300));
        viewNetworks.setAnchorPoint(cc.p(0.5, 1));
        viewNetworks.setPosition(btnNhaMang.x, btnNhaMang.y - btnNhaMang.height / 2);
        viewNetworks.visible = false;
        this.naptienView.addChild(viewNetworks);
        var bgItem = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(viewNetworks.width, viewNetworks.height));
        bgItem.setPosition(viewNetworks.width / 2, viewNetworks.height / 2);
        viewNetworks.addChild(bgItem);

        var thizz = this;
        for (var i1 = 0; i1 < 3; i1++) {
            var cell = new ccui.Widget();
            cell.setContentSize(cc.size(500, 57));
            cell.setAnchorPoint(cc.p(0.5, 1));
            viewNetworks.addChild(cell);

            // if (i1 == 0) cell.setName("Thẻ Viettel");
            if (i1 === 0) cell.setName(MultiLanguage.getTextByKey("VIETTEL_CARD"));
            else if (i1 === 1) cell.setName(MultiLanguage.getTextByKey("VINA_CARD"));
            else if (i1 === 2) cell.setName(MultiLanguage.getTextByKey("MOBI_CARD"));
            cell.setTouchEnabled(true);

            //-------
            var color = cc.color("#d7cecf");
            var _bg = new cc.LayerColor(color, 495, 57);
            _bg.x = 2;
            if (i1 % 2 === 0) {
                _bg.setOpacity(50);
            } else {
                _bg.setOpacity(100);
            }
            //-------
            var label = new cc.LabelTTF(cell.getName(), cc.res.font.Myriad_Pro_Regular, 30);
            label.setColor(cc.color(255, 255, 255));
            label.setPosition(cell.width / 2, cell.height / 2);
            cell.addChild(label);

            cell.setPosition(viewNetworks.width / 2, viewNetworks.height - cell.height * i1 - 5);
            cell.addChild(_bg);

        }
        viewNetworks.getChildByName(MultiLanguage.getTextByKey("VIETTEL_CARD")).addClickEventListener(function () {
            btnNhaMang.getChildByName("NameNode").setString(MultiLanguage.getTextByKey("VIETTEL_CARD"));
            viewNetworks.visible = false;
            thizz._convertProvider(0);
            thizz._onChangeProviderScrollView(thizz.listCard.viettelCard);
        });
        viewNetworks.getChildByName(MultiLanguage.getTextByKey("VINA_CARD")).addClickEventListener(function () {
            btnNhaMang.getChildByName("NameNode").setString(MultiLanguage.getTextByKey("VINA_CARD"));
            viewNetworks.visible = false;
            thizz._convertProvider(1);
            thizz._onChangeProviderScrollView(thizz.listCard.vinaCard);
        });
        viewNetworks.getChildByName(MultiLanguage.getTextByKey("MOBI_CARD")).addClickEventListener(function () {
            btnNhaMang.getChildByName("NameNode").setString(MultiLanguage.getTextByKey("MOBI_CARD"));
            viewNetworks.visible = false;
            thizz._convertProvider(2);
            thizz._onChangeProviderScrollView(thizz.listCard.mobiCard);
        });
        btnNhaMang.addClickEventListener(function () {
            viewNetworks.visible = !viewNetworks.visible;
        });
        //=============== LIST NAP TIEN
        this._initHeaderNapTien();

        naptheBtn.addClickEventListener(function () {
            naptheBtn.setScale(1.05);
            setTimeout(function () {
                naptheBtn.setScale(1);
            }, 100);
            var seri = seriTF.getText();
            var number = numberTF.getText();
            var captcha = captchaTFNapTien.getText();
            var amount = menhgiatheTF.getText();
            cc.Global.sendVerifyCaptcha(cc.Global.captchaData.token, captcha, function () {
                if (thizz.checkBeforeSubmit(seri, number, captcha, amount)) {
                    thizz._controller.sendCardTopUp(thizz._provider, seri, number, parseInt(amount));
                } else {
                    thiz.getCaptchaNapTien();
                }
            });
        });
    },
    _initHeaderNapTien: function () {
        var container = this._createEntryBar(true);

        var menhgia = new cc.LabelTTF(MultiLanguage.getTextByKey("CARD_VALUE"), cc.res.font.Myriad_Pro_Regular, 22);
        menhgia.setColor(new cc.Color(60, 60, 60, 255));
        // menhgia.setPosition(40,30);
        var _cell1 = container.getChildByName("cell1");
        menhgia.setPosition(_cell1.x + _cell1.width / 2, 30);
        container.addChild(menhgia);

        var chietkhau = new cc.LabelTTF(MultiLanguage.getTextByKey("DISCOUNT"), cc.res.font.Myriad_Pro_Regular, 22);
        chietkhau.setColor(new cc.Color(60, 60, 60, 255));
        // chietkhau.setPosition(553, 30);
        var _cell2 = container.getChildByName("cell2");
        chietkhau.setPosition(_cell2.x + _cell2.width / 2, 30);
        container.addChild(chietkhau);

        var tongtien = new cc.LabelTTF(MultiLanguage.getTextByKey("CARD_TOTAL_VALUE"), cc.res.font.Myriad_Pro_Regular, 22);
        tongtien.setColor(new cc.Color(60, 60, 60, 255));
        // tongtien.setPosition(853, 30);
        var _cell3 = container.getChildByName("cell3");
        tongtien.setPosition(_cell3.x + _cell3.width / 2, 30);
        container.addChild(tongtien);

        container.setPosition(this.naptienView.width * 0.75, this.naptienView.height - 70);
        this.naptienView.addChild(container);

        if (cc.winSize.height / cc.winSize.width === 4 / 3 || cc.winSize.height / cc.winSize.width === 3 / 4) {
            container.setPositionX(this.naptienView.width * 0.75 + 70)
        }

    },
    _itemNhaMang: function () {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(500, 80));
        var bgItem = new ccui.Scale9Sprite("bg_input_field.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(node.width, node.height));
        bgItem.setName("bgItem");
        bgItem.setPosition(node.width / 2, node.height / 2);
        node.addChild(bgItem);

        var label = new cc.LabelTTF(MultiLanguage.getTextByKey("VIETTEL_CARD"), cc.res.font.Myriad_Pro_Regular, 30);
        label.setAnchorPoint(cc.p(0, 0.5));
        label.setName("NameNode");
        label.setColor(cc.color(255, 255, 255));
        label.setPosition(20, node.height / 2);
        node.addChild(label);

        // var borderItem = new cc.Sprite("#icon_scroldown.png");
        // borderItem.setName("iconLight");
        // borderItem.setPosition(node.width - borderItem.width, node.height / 2);
        // node.addChild(borderItem);
        //===Set provider default VIETTEL
        this._provider = "VIETTEL";
        this._convertProvider(0);


        return node;
    },
    ivtTime1: -1,
    getCaptchaNapTien: function () {
        cc.Global.bGetCaptcha = false;
        cc.Global.getUrlCaptcha();
        clearInterval(this.ivtTime1);
        if (this.naptienView.getChildByName("sprCaptcha"))
            this.naptienView.getChildByName("sprCaptcha").removeFromParent();
        var thiz = this;
        this.ivtTime1 = setInterval(function () {
            if (cc.Global.bGetCaptcha) {
                cc.log("captchadata: " + JSON.stringify(cc.Global.captchaData));
                var url = cc.Global.captchaData.urlCaptcha;
                TextureDownloader.load(url, function (tex) {
                    cc.spriteFrameCache.addSpriteFrames(url, tex);

                    var sprite = new cc.Sprite(tex);
                    sprite.setName("sprCaptcha");
                    sprite.x = thiz.captchaGiftcodeTF.x + 220;
                    sprite.y = thiz.captchaGiftcodeTF.y;
                    sprite.scale = 60 / sprite.height;
                    thiz.naptienView.addChild(sprite);
                });
                clearInterval(thiz.ivtTime1);
            }
        }, 100);
    },
    _onGetListCardView: function (data) {
        var length = data.length;
        this.listCard = {};
        this.listCard.vinaCard = [];
        this.listCard.mobiCard = [];
        this.listCard.viettelCard = [];
        for (var i = 0; i < length; i++) {
            var dataListCard = {};
            dataListCard.productID = data[i]["1"];
            dataListCard.gameID = data[i]["2"];
            dataListCard.provider = data[i]["3"];
            dataListCard.imageUrl = data[i]["4"];
            dataListCard.price = data[i]["5"];
            dataListCard.discount = data[i]["6"];
            dataListCard.money = data[i]["7"];
            dataListCard.enable = data[i]["8"];
            switch (data[i]["3"]) {
                case "VIETTEL":
                    this.listCard.viettelCard.push(dataListCard);
                    break;
                case "VINAPHONE":
                    this.listCard.vinaCard.push(dataListCard);
                    break;
                case "MOBIFONE":
                    this.listCard.mobiCard.push(dataListCard);
                    break;
            }
        }

        var scrollViewNapThe = new newui.TableView(cc.size(this.naptienView.width * 0.75, 400), 1);
        scrollViewNapThe.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollViewNapThe.setScrollBarEnabled(false);
        scrollViewNapThe.setTouchEnabled(true);
        scrollViewNapThe.setBounceEnabled(true);
        scrollViewNapThe.setAnchorPoint(cc.p(0.5, 0.5));
        scrollViewNapThe.setPosition((this.naptienView.width * 0.75), this.naptienView.height - 300);
        this.scrollViewNapThe = scrollViewNapThe;
        this.naptienView.addChild(scrollViewNapThe, 1);
        this._onChangeProviderScrollView(this.listCard.viettelCard);

        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {
            scrollViewNapThe.setPositionX(this.naptienView.width * 0.75 + 70)
        }
    },

    _onChangeProviderScrollView: function (data) {
        if (data.length > 0) {
            this.scrollViewNapThe.removeAllItems();
            for (var j = 0; j < data.length; j++) {
                var container = this._createItemEntry(data[j], j);
                this.scrollViewNapThe.pushItem(container);
            }
        } else {
            this.scrollViewNapThe.removeAllItems();
        }
    },

    //==== Check xem nhap dung seri va cardnumber chưa =====
    //===========
    checkBeforeSubmit: function (seri, cardNumber, captcha, amount) {
        var validation = {
            isNotEmpty: function (str) {
                var pattern = /\S+/;
                return pattern.test(str);  // returns a boolean
            },
            isNumber: function (str) {
                var pattern = /^\d+$/;
                return pattern.test(str);  // returns a boolean
            }
        };

        var thiz = this;
        if (!validation.isNotEmpty(seri)) {
            // this.lb_infoNaptien.setString(MultiLanguage.getTextByKey("CASHTOPUP_SERI_NOT_EMPTY"));
            this.showErrorPopUp(MultiLanguage.getTextByKey("CASHTOPUP_SERI_NOT_EMPTY"), 1000);
            return false;
        } else if (!validation.isNotEmpty(cardNumber)) {
            // this.lb_infoNaptien.setString(MultiLanguage.getTextByKey("CASHTOPUP_CARD_NUMBER_NOT_EMPTY"));
            this.showErrorPopUp(MultiLanguage.getTextByKey("CASHTOPUP_CARD_NUMBER_NOT_EMPTY"), 1000);
            return false;
        } else if (!validation.isNotEmpty(captcha)) {
            // this.lb_infoNaptien.setString(MultiLanguage.getTextByKey("CASHTOPUP_CAPTCHA_NOT_EMPTY"));
            this.showErrorPopUp(MultiLanguage.getTextByKey("CASHTOPUP_CAPTCHA_NOT_EMPTY"), 1000);
            return false;
        } else if (!validation.isNumber(seri)) {
            // this.lb_infoNaptien.setString(MultiLanguage.getTextByKey("CASHTOPUP_SERI_INVALID"));
            this.showErrorPopUp(MultiLanguage.getTextByKey("CASHTOPUP_SERI_INVALID"), 1000);
            return false;
        } else if (!validation.isNumber(cardNumber)) {
            // this.lb_infoNaptien.setString(MultiLanguage.getTextByKey("CASHTOPUP_CARD_NUMBER_INVALID"));
            this.showErrorPopUp(MultiLanguage.getTextByKey("CASHTOPUP_CARD_NUMBER_INVALID"), 1000);
            return false;
        } else if (!validation.isNotEmpty(amount)) {
            // this.lb_infoNaptien.setString(MultiLanguage.getTextByKey("CASHTOPUP_CARD_AMOUNT_NOT_EMPTY"));
            this.showErrorPopUp(MultiLanguage.getTextByKey("CASHTOPUP_CARD_AMOUNT_NOT_EMPTY"), 1000);
            return false;
        } else if (!validation.isNumber(amount)) {
            // this.lb_infoNaptien.setString(MultiLanguage.getTextByKey("CASHTOPUP_CARD_AMOUNT_INVALID"));
            this.showErrorPopUp(MultiLanguage.getTextByKey("CASHTOPUP_CARD_AMOUNT_INVALID"), 1000);
            return false;
        } else if (cc.Global.isVerify === false) {
            // this.lb_infoNaptien.setString(MultiLanguage.getTextByKey("CASHTOPUP_CAPTCHA_INVALID"));
            this.showErrorPopUp(MultiLanguage.getTextByKey("CASHTOPUP_CAPTCHA_INVALID"), 1000);
            thiz.captchaGiftcodeTF.setText("");

            return false;
        }
        return true;
    },
    //=== ShowError ===
    _showError: function (code) {
        var message = "";
        switch (code) {
            case -2009:
                message = MultiLanguage.getTextByKey("CASHTOPUP_SYSTEM_BUSY");
                break;
            case -2008:
                message = MultiLanguage.getTextByKey("CASHTOPUP_SYSTEM_ERROR");
                break;
            case -2004:
                message = MultiLanguage.getTextByKey("CASHTOPUP_CARD_USER_OR_NOT_EXIST");
                break;
            case -2003:
                message = MultiLanguage.getTextByKey("CASHTOPUP_CARD_EXPIRE");
                break;
            case -2002:
                message = MultiLanguage.getTextByKey("CASHTOPUP_PIN_OR_SERIAL_INCORRECT");
                break;
            case -2001:
                message = MultiLanguage.getTextByKey("CASHTOPUP_USER_NOT_FOUND");
                break;
        }
        // this.lb_infoNaptien.setString(message);
        this.showErrorPopUp(message, 1000);
        this.getCaptchaNapTien();
        // var thiz = this;
        // if (!cc.sys.isNative) {
        //     ga('create', 'UA-115654005-1', 'auto');
        //     ga(function (tracker) {
        //         tracker.send('event', 'Nạp thẻ ' + thiz._provider, message + ' Mã lỗi: ' + code, 'Tài khoản: ' + PlayerMe.username);
        //     });
        // }
    },

    showErrorPopUp: function (mess, time_auto_close) {
        var d = new HomeNotifyPopup();
        d.showNotification(mess);
        setTimeout(function () {
            d.hide();
        }, time_auto_close);
    },
    //+++++ Update User Money ++++
    _updateUserMoneyWhenTopUpSuccess: function (res) {
        // if (cc.sys.os === cc.sys.OS_ANDROID) {
        //     jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logEventFirebase", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "add_payment_info", "Nạp success", "Nạp success");
        // }
        // else if (cc.sys.os === cc.sys.OS_IOS)
        //     jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Nạp success", "Nạp success");
        // this.lb_infoNaptien.setString("Bạn đã nạp Tiền thành công.");
        // GlobalEvent.getInstance().postEvent("assetChange", coin);
        // var thiz = this;
        // if (!cc.sys.isNative) {
        //     ga('create', 'UA-115654005-1', 'auto');
        //     ga(function (tracker) {
        //         tracker.send('event', 'Nạp thẻ ' + thiz._provider, 'Nạp thành công ' + coin, 'Tài khoản đã nạp: ' + PlayerMe.username);
        //     });
        // }
        if (res.errorCode === 0)
            this.showErrorPopUp(MultiLanguage.getTextByKey("TOPUP_SUCCESS"), 10000);
    },

    clearTextNapTien: function () {
        this.seriTFNapTien.setText("");
        this.numberTFNapTien.setText("");
        this.captchaGiftcodeTF.setText("");
    },
    //================================================================================
    //================================================================================
    _convertProvider: function (provider) {
        var thiz = this;
        switch (provider) {
            case 0:
                thiz._provider = "VIETTEL";
                break;
            case 1:
                thiz._provider = "VINAPHONE";
                break;
            case 2:
                thiz._provider = "MOBIFONE";
                break;
        }
        return this._provider;
    },
    _createItemEntry: function (items, _i) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(550, 57));
        var color = cc.color("#d7cecf");
        var cell = new cc.LayerColor(color, 550, 57);
        res.addChild(cell);
        if (_i % 2 == 0) {
            cell.setOpacity(50);
        } else {
            cell.setOpacity(100);
        }

        var font = cc.res.font.Myriad_Pro_Regular;
        var _value = new cc.LabelTTF(cc.Global.NumberFormat1(items.price), font, 24);
        _value.setPosition(100, res.height / 2);
        res.addChild(_value);

        var _discount = new cc.LabelTTF((items.discount * 100) + "%", font, 24);
        _discount.setAnchorPoint(cc.p(0.5, 0.5));
        _discount.setPosition(280, res.height / 2);
        res.addChild(_discount);

        var _total = new cc.LabelTTF(cc.Global.NumberFormat1(items.money), font, 24);
        _total.setAnchorPoint(cc.p(0.5, 0.5));
        _total.setPosition(450, res.height / 2);
        res.addChild(_total);
        return res;
    },
    _createEntryBar: function (isDark) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(550, 57));
        var opacity = 255;//Math.floor(isDark ? (255 * 0.6) : (255 * 0.3));
        var color = cc.color("#d7cecf");


        var cell1 = new cc.LayerColor(color, 200, res.height);
        cell1.setPosition(0, 0);
        cell1.setName("cell1");
        cell1.setOpacity(opacity);
        res.addChild(cell1);

        var cell2 = new cc.LayerColor(color, 150, res.height);
        cell2.setPosition(cell1.x + cell1.width, 0);
        cell2.setName("cell2");
        cell2.setOpacity(opacity);
        res.addChild(cell2);

        var cell3 = new cc.LayerColor(color, 200, res.height);
        cell3.setPosition(cell2.x + cell2.width, 0);
        cell3.setName("cell3");
        cell3.setOpacity(opacity);
        res.addChild(cell3);

        return res;
    },
    _initItemInNode: function (typeItem, text) {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(300, 100));
        // var opacity = Math.floor(255);
        var bgItem = new ccui.Scale9Sprite("home_btn_chuyentien.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgItem.setPreferredSize(cc.size(node.width, node.height));
        bgItem.setName("bgItem");
        // bgItem.scale = 1.75;
        bgItem.setPosition(node.width / 2, node.height / 2);
        node.addChild(bgItem);

        var _curText = "";
        if (text === "Nạp Tiền") {
            _curText = "RECHARGE_TITLE";
        }
        else if (text === "Đổi Tiền") {
            _curText = "DEPOSIT_MONEY_TITLE";
        }
        else if (text === "Chuyển Tiền") {
            _curText = "TRANSFER_MONEY";
        }
        else {
            _curText = text;
        }

        var label = new cc.LabelTTF(_curText === text ? text : MultiLanguage.getTextByKey(_curText), cc.res.font.Arial_Bold, 35, cc.p(500, 200), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        // label.setAnchorPoint(cc.p(0, 0));
        label.setName("NameNode");
        label.setColor(cc.color("#fde612"));
        label.setPosition(node.width / 2, node.height / 2);
        node.addChild(label);

        var borderItem = new cc.Sprite();
        borderItem.scaleY = 2;
        borderItem.setName("iconLight");
        borderItem.setPosition(node.width / 2, label.y - 20);
        node.addChild(borderItem);

        label.setColor(cc.color(0, 0, 0));
        borderItem.visible = false;

        if (typeItem === 0) {
            // borderItem.visible = true;
            bgItem.visible = false;
        }
        else if (typeItem === 1) {
            label.setFontSize(30);
            bgItem.setPreferredSize(cc.size(node.width, label.height * 2));
        } else if (typeItem === 2) {
            label.setFontSize(30);
            bgItem.setPreferredSize(cc.size(label.width * 1.5, node.height));
        }

        return node;
    },
    //================================================================================
    //================================================================================
    //==================================IAP VIEW======================================
    //================================================================================
    //================================================================================
    _initIAPView: function () {
        this.iapView = new ccui.Widget();
        this.iapView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height * 0.8));
        this.iapView.y = -cc.winSize.height / 2 + this.iapView.height / 2 + 30;
        this.iapView.visible = false;
        this.addChild(this.iapView);

        /*Android
         Name: Gói A
         Description: Gói A
         ID: loc.club.1
         Name: Gói B
         Description: Gói B
         ID: loc.club.10
         Name: Gói C
         Description: Gói C
         ID: loc.club.100*/
        // this._getListIAPCallback(true, _arrIAP);
    },
    _initItemIAP: function (isSuccess, result) {
        // [{"1":"Gói cơ bản A","2":"loc.club.1","3":22000,"4":"VND","5":22000,"6":"coin"},
        // {"1":"Gói cơ bản C","2":"loc.club.100","3":2200000,"4":"VND","5":2200000,"6":"coin"},
        // {"3":0,"5":0}]
        if (isSuccess) {
            var tableView = new newui.TableView(cc.size(1060, 350), 1);
            tableView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
            tableView.setBounceEnabled(true);
            tableView.setAnchorPoint(cc.p(0.5, 0.5));
            // tableView.setPosition(0, -50);
            tableView.setPosition(this.iapView.width / 2, this.iapView.height / 2);
            this.iapView.addChild(tableView);
            tableView.removeAllItems();
            for (var i = 0; i < result.length; i++) {
                var item = this._initItem(result[i]);
                tableView.pushItem(item);
            }
        }
        this.setLoading(false);
    },
    _initItem: function (item) {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(270, 315));

        var bgItem = new cc.Sprite("#home_dialog_bg_item_nap_tien.png");
        bgItem.setPosition(bgItem.width / 2, bgItem.height / 2);
        node.addChild(bgItem);

        var iconBg = new cc.Sprite("#home_dialog_bg_nap_tien.png");
        iconBg.setPosition(bgItem.width / 2, bgItem.height - iconBg.height / 2);
        bgItem.addChild(iconBg);

        var description = new cc.LabelTTF(item["1"], cc.res.font.Myriad_Pro_Regular, 25);
        description.setPosition(bgItem.width / 2, bgItem.height / 2 - 25);
        bgItem.addChild(description);

        var bgMoney = new cc.Sprite("#home_dialog_bg_money.png");
        bgMoney.setPosition(bgItem.width / 2, description.y - 35);
        bgItem.addChild(bgMoney);

        var iconMoney = new cc.Sprite("#home_dialog_icon_money.png");
        iconMoney.setPosition(25, bgMoney.height / 2 - 3);
        bgMoney.addChild(iconMoney);

        var moneyShow = new cc.LabelTTF(item["5"] + item["6"], cc.res.font.Myriad_Pro_Regular, 25);
        moneyShow.setPosition(bgMoney.width / 2, bgMoney.height / 2 - 5);
        moneyShow.enableStroke(cc.color("#ff9600"), 2);
        bgMoney.addChild(moneyShow);


        var btnBuy = new ccui.Button("btn_confirm.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnBuy.setPosition(bgItem.width / 2, btnBuy.height / 2);
        btnBuy.setTouchEnabled(true);
        bgItem.addChild(btnBuy);

        var lbBuyNow = MultiLanguage.createLabelTTFFont("BUY_NOW_ITEM", cc.res.font.Myriad_Pro_Regular, 22);
        lbBuyNow.setPosition(btnBuy.width / 2, btnBuy.height / 2 + 17);
        lbBuyNow.color = cc.color("#000000");
        btnBuy.addChild(lbBuyNow);

        var lbPrice = new cc.LabelTTF(item["3"] + item["4"], cc.res.font.Myriad_Pro_Regular, 22);
        lbPrice.setPosition(btnBuy.width / 2, btnBuy.height / 2 - 3);
        lbPrice.color = cc.color("#000000");
        btnBuy.addChild(lbPrice);

        btnBuy.addClickEventListener(function () {
            cc.log("buy Item: " + JSON.stringify(item));
            cc.log("userId: " + PlayerMe.SFS.userId);
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "getIAP", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", item["2"], "loc.portal.com", PlayerMe.SFS.userId);
            } else if (cc.sys.os === cc.sys.OS_IOS)
                jsb.reflection.callStaticMethod("AppController", "inappPurchare:andAppId:andUid:", item["2"].toString(), "camap", PlayerMe.SFS.userId);

        });
        return node;
    }
});
