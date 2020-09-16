var HomeLuckyHistoryDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite("#home_dialog_bg_blank.png");
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);
        this._initLabels();
        this._initHeader();

        var scrollView = new newui.TableView(cc.size(1032, 360),1);
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setScrollBarEnabled(false);
        scrollView.setTouchEnabled(true);
        scrollView.setBounceEnabled(true);
        scrollView.setAnchorPoint(cc.p(0.5, 0.5));
        scrollView.setPosition(0, -40);
        this.addChild(scrollView, 1);

        this.scrollView = scrollView;
        this._pageIndex = 0;

        var thiz = this;
        cc.Global.implementInfiniteScroll.call(this, this.scrollView, function () {
            thiz._pageIndex = thiz._pageIndex + 1;
            thiz._controller.sendGetHistoryItemRequest(thiz._pageIndex * 10);
        });

        this.initController();
        this._controller.sendGetHistoryItemRequest();

    },
    initController: function () {
        this._controller = new HomeLuckyHistoryController(this);
    },

    _initLabels: function () {
        var title = MultiLanguage.createLabelTTFFont("HISTORY_LUCKY_TITLE", cc.res.font.Myriad_Pro_Regular, 46);
        title.enableStroke(cc.color("#00d8ff"), 2);
        title.setPosition(0, 205);
        this.addChild(title);
    },
    _initHeader: function () {
        var container = this._createEntryBar(true);
        var fontBold = cc.res.font.Myriad_Pro_Bold;

        var sessionLabel = MultiLanguage.createLabelTTFFont("SESSION", fontBold, 18);
        sessionLabel.setPosition(90, 12);
        container.addChild(sessionLabel);

        var timeLabel = MultiLanguage.createLabelTTFFont("TIME", fontBold, 18);
        timeLabel.setPosition(276, 12);
        container.addChild(timeLabel);

        var leftLabel = MultiLanguage.createLabelTTFFont("LEFT_SPIN", fontBold, 18);
        leftLabel.setPosition(468, 12);
        container.addChild(leftLabel);

        var rightLabel = MultiLanguage.createLabelTTFFont("RIGHT_SPIN", fontBold, 18);
        rightLabel.setPosition(755, 12);
        container.addChild(rightLabel);

        var desLabel = MultiLanguage.createLabelTTFFont("DESCRIPTION", fontBold, 18);
        desLabel.setPosition(981, 12);
        container.addChild(desLabel);

        container.setPosition(0, 159);
        this.addChild(container);
    },
    initItems: function (res) {
        this._allItems = this._allItems || [];
        // this.scrollView.removeAllItems();
        for (var i = 0; i < res.length; i++) {
            var container = this._initItemHistory(i % 2, res[i]);
            this.scrollView.pushItem(container);
            this._allItems.push(container);
        }
    },
    _createEntryBar: function (isDark) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(1032, 41));
        var color = cc.color(isDark ? "#bef8ff" : "#032559");
        var opacity = Math.floor(isDark ? (255 * 0.5) : (255 * 0.2));

        var cell = new cc.LayerColor(color, 174, res.height - 8);
        cell.setPosition(0, 4);
        cell.setOpacity(opacity);
        res.addChild(cell);

        cell = new cc.LayerColor(color, 192, res.height - 8);
        cell.setPosition(178, 4);
        cell.setOpacity(opacity);
        res.addChild(cell);

        cell = new cc.LayerColor(color, 184, res.height - 8);
        cell.setPosition(374, 4);
        cell.setOpacity(opacity);
        res.addChild(cell);

        cell = new cc.LayerColor(color, 359, res.height - 8);
        cell.setPosition(562, 4);
        cell.setOpacity(opacity);
        res.addChild(cell);

        cell = new cc.LayerColor(color, 108, res.height - 8);
        cell.setPosition(926, 4);
        cell.setOpacity(opacity);
        res.addChild(cell);

        return res;
    },

    _initItemHistory: function (isDark, item) {
        var res = this._createEntryBar(isDark);
        //res.entry = entry;
        var font = cc.res.font.Myriad_Pro_Regular;

        var sessionLabel = new cc.LabelTTF("#" + item.session, font, 18);
        sessionLabel.setAnchorPoint(cc.p(0, 0.5));
        sessionLabel.setPosition(11, 12);
        res.addChild(sessionLabel);

        var timeLabel = new cc.LabelTTF(item.time, font, 18);
        timeLabel.setAnchorPoint(cc.p(0, 0.5));
        timeLabel.setPosition(190, 12);
        res.addChild(timeLabel);

        var leftResult = "";
        if (item.leftResult["2"] == "NOTHING")
            leftResult = MultiLanguage.getTextByKey("NOTHING");
        else
            leftResult = cc.Global.NumberFormat2(item.leftResult["1"]);

        var leftLabel = new cc.LabelTTF(leftResult, font, 18);
        leftLabel.setAnchorPoint(cc.p(0, 0.5));
        leftLabel.setPosition(390, 12);
        res.addChild(leftLabel);

        var rightResult = "";
        if (item.rightResult["2"] == "NOTHING")
            rightResult = MultiLanguage.getTextByKey("NOTHING");
        else if (item.rightResult["2"] == "FREE_TURN")
            rightResult = MultiLanguage.getTextByKey("FREE_TURN");
        else
            rightResult = cc.Global.NumberFormat2(MultiLanguage.getTextByKey("FREE") + " " + item.rightResult["3"] + " " + (item.rightResult["1"] < 10 ? "0" : "") + item.rightResult["1"] + MultiLanguage.getTextByKey("FREE_SPIN"));

        var rightLabel = new cc.LabelTTF(rightResult, font, 18);
        rightLabel.setAnchorPoint(cc.p(0, 0.5));
        rightLabel.setPosition(572, 12);
        res.addChild(rightLabel);

        var desLabel = new cc.LabelTTF(item.description, font, 18);
        desLabel.setAnchorPoint(cc.p(0, 0.5));
        desLabel.setPosition(932, 12);
        res.addChild(desLabel);

        return res;
    },
});