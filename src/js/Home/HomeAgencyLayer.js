var HomeAgencyLayer = HomeBoderLayer.extend({
    ctor: function () {
        this._super();

        this.bg.visible = false;
        this._rectTouch = cc.rect(0, 0, cc.winSize.width, cc.winSize.height);
        this._showPosition = cc.p(0, 0);
        this._hidePosition = cc.p(-cc.winSize.width, 0);

        var bgnew = new ccui.ImageView("bg_popup.png", ccui.Widget.PLIST_TEXTURE);
        bgnew.ignoreContentAdaptWithSize(false);
        bgnew.setScale9Enabled(true);
        bgnew.setContentSize(cc.winSize.width, cc.winSize.height);
        bgnew.x = cc.winSize.width / 2;
        bgnew.y = cc.winSize.height / 2;
        this.addChild(bgnew);

        var title = new cc.LabelTTF("ĐẠI LÝ", cc.res.font.Arial_Bold, 40);
        title.enableStroke(cc.color("073abe"), 2);
        title.setPosition(cc.winSize.width / 2, 660);
        this.addChild(title);

        var closeBt = new ccui.Button("home_dialog_button_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeBt.scale = 0.68;
        //signupBt.setZoomScale(0.0);
        closeBt.setPosition(cc.winSize.width - closeBt.width, 660);
        this.addChild(closeBt);

        var thiz = this;
        closeBt.addClickEventListener(function () {
            thiz.hide();
        });
        if (cc.Global.agencyData) {
            this.showListAgency(cc.Global.agencyData);
        } else {
            var arrDefault = [];
            for (var i = 0; i < 1; i++) {
                var itemDefault = {"AccountName": "Mr. X", "Address": "Hà Nội", "Mobile": "0126xxxxxxx"};
                arrDefault.push(itemDefault);
            }
            this.showListAgency(arrDefault);
        }
    },
    showListAgency: function (items) {
        // cc.log("cdebug :" + items.length);
        if (this.itemsList) {
            if (items.length > 4) this.itemsList.removeAllItems();
        } else {
            var itemList = new newui.TableView(cc.size(cc.winSize.width - 80, 500), 1);
            itemList.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
            itemList.setBounceEnabled(true);
            itemList.setAnchorPoint(cc.p(0.5, 0.5));
            itemList.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            itemList.setMargin(10, 10, 0, 0);

            this.addChild(itemList, 2);

            this.itemsList = itemList;
        }

        for (var i = 0; i < items.length; i++) {
            var item = this._initItem(items[i], i + 1);
            this.itemsList.pushItem(item);
        }
    },
    _initItem: function (item, index) {
        var node = new ccui.Widget();


        var bgItem = new cc.Sprite("#home_dialog_bg_daily.png");
        bgItem.setScale(.68);
        bgItem.setPosition(bgItem.width * bgItem.scale / 2, bgItem.height * bgItem.scale / 2 + 160);

        node.addChild(bgItem);

        node.setContentSize(cc.size(bgItem.width * bgItem.scale + 40, bgItem.height * bgItem.scaleY + 160));

        var moneyBt = new ccui.Button("home_dialog_button_chuyentien_daily.png", "", "", ccui.Widget.PLIST_TEXTURE);
        moneyBt.scale = 0.68;
        moneyBt.setPosition(bgItem.width / 2 - 60, moneyBt.height * moneyBt.scale / 2);
        node.addChild(moneyBt);

        var thiz = this;
        moneyBt.addClickEventListener(function () {
            thiz.hide();
            var dialog = new HomeChargeMoneyDialog();
            dialog._showViewIndex(2);
            dialog.show();
        });

        var faceBt = new ccui.Button("home_dialog_button_facebook_daily.png", "", "", ccui.Widget.PLIST_TEXTURE);
        faceBt.scale = 0.68;
        //signupBt.setZoomScale(0.0);
        faceBt.setPosition(bgItem.width / 2 - 60, moneyBt.y + moneyBt.height * moneyBt.scale / 2 + faceBt.height * faceBt.scale / 2 + 5);
        node.addChild(faceBt);

        faceBt.addClickEventListener(function () {
            // if (!cc.sys.isNative) window.open("https://www.facebook.com/dailykimngan");
            if (!cc.sys.isNative) window.open("https://www.facebook.com");
        });

        var lbAgencyName = new cc.LabelTTF("ĐẠI LÝ " + index, cc.res.font.Myriad_Pro_Bold, 25);
        lbAgencyName.setAnchorPoint(0, 0);
        // lbAgencyName.setColor(new cc.Color(30, 30, 30));
        lbAgencyName.setPosition(bgItem.width * bgItem.scale / 2 - lbAgencyName.width / 2, bgItem.y + bgItem.height * bgItem.scaleY / 2 - 45);
        node.addChild(lbAgencyName);


        var lbUserName = new cc.LabelTTF(item["AccountName"], cc.res.font.Myriad_Pro_Bold, 35);
        lbUserName.setAnchorPoint(0, 0);
        lbUserName.setPosition(lbAgencyName.x - 60, lbAgencyName.y - 50);
        node.addChild(lbUserName);

        var lbPlace = new cc.LabelTTF(item["Address"], cc.res.font.Myriad_Pro_Regular, 22);
        lbPlace.setAnchorPoint(0, 0);
        lbPlace.setPosition(lbUserName.x, lbAgencyName.y - 87);
        node.addChild(lbPlace);

        var lbPhone = new cc.LabelTTF(item["Mobile"], cc.res.font.Myriad_Pro_Regular, 22);

        lbPhone.setAnchorPoint(0, 0);
        lbPhone.setPosition(lbUserName.x, lbAgencyName.y - 117);
        node.addChild(lbPhone);

        return node;
    }
});