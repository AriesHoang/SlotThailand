var HomeRankingDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite();
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

        this._initLabels();
        this._initHeader();

        var scrollView = new ccui.ListView();
        scrollView.setContentSize(1060, 320);
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setScrollBarEnabled(false);
        scrollView.setTouchEnabled(true);
        scrollView.setBounceEnabled(true);
        scrollView.setAnchorPoint(cc.p(0.5, 0.5));
        scrollView.setPosition(-16, -72);
        this.addChild(scrollView, 1);

        this.scrollView = scrollView;

        this.initController();
        this._controller.sendRankingInfoRequest();

        var coinMap = {};
        coinMap['icon_coins_1'] = '#home_dialog_coin_icon_0.png';
        coinMap['icon_coins_2'] = '#home_dialog_coin_icon_1.png';
        coinMap['icon_coins_6'] = '#home_dialog_coin_icon_2.png';

        this.coinMap = coinMap;
        this.setLoading(true);
    },

    initController: function () {
        this._controller = new HomeRankingDialogController(this);
    },

    _initLabels: function () {
        var title = MultiLanguage.createLabelTTFFont("HALL_OF_FAME_BUTTON_TITLE", cc.res.font.Myriad_Pro_Regular, 64);
        title.enableStroke(cc.color("#00d8ff"), 2);
        title.setPosition(0, 197);
        this.addChild(title);
    },

    _initHeader: function () {
        var color = cc.color(0, 0, 0, 102);
        var bg = new cc.LayerColor(color, 129, 34);
        bg.setPosition(-520, 91);
        this.addChild(bg);

        bg = new cc.LayerColor(color, 539, 34);
        bg.setPosition(-386, 91);
        this.addChild(bg);

        bg = new cc.LayerColor(color, 353, 34);
        bg.setPosition(161, 91);
        this.addChild(bg);

        var STT = MultiLanguage.createLabelTTFFont("STT", cc.res.font.Myriad_Pro_Bold, 24);
        STT.setPosition(-465, 105);
        this.addChild(STT);

        var timeLabel = MultiLanguage.createLabelTTFFont("TIME", cc.res.font.Myriad_Pro_Bold, 24);
        timeLabel.setPosition(-112, 105);
        this.addChild(timeLabel);

        var wealthLabel = MultiLanguage.createLabelTTFFont("KING_COIN", cc.res.font.Myriad_Pro_Bold, 24);
        wealthLabel.setPosition(360, 105);
        this.addChild(wealthLabel);

        // var clockIcon = new cc.Sprite("#home_dialog_clock_icon.png");
        // clockIcon.setPosition(-192, 109);
        // this.addChild(clockIcon);

        var chestIcon = new cc.Sprite("#home_dialog_chest_icon.png");
        chestIcon.setPosition(285, 108);
        this.addChild(chestIcon);
    },

    _createEntryBar: function (isDark) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(1060, 60));
        var color = cc.color("#000794");
        var opacity = Math.floor(isDark ? (255 * 0.4) : (255 * 0.2));

        var cell = new cc.LayerColor(color, 129, res.height - 5);
        cell.setPosition(27, 0);
        cell.setOpacity(opacity);
        res.addChild(cell);

        cell = new cc.LayerColor(color, 540, res.height - 5);
        cell.setPosition(161, 0);
        cell.setOpacity(opacity);
        res.addChild(cell);

        cell = new cc.LayerColor(color, 353, res.height - 5);
        cell.setPosition(707, 0);
        cell.setOpacity(opacity);
        res.addChild(cell);

        return res;
    },

    _createInboxEntry: function (isDark, stt, name, coinType, coinValue) {
        var res = this._createEntryBar(isDark);

        var sttLabel = new cc.LabelTTF(stt, cc.res.font.Myriad_Pro_Regular, 24);
        sttLabel.setPosition(84, 28);
        res.addChild(sttLabel);
        res.sttLabel = sttLabel;

        var nameLabel = new cc.LabelTTF(name, cc.res.font.Myriad_Pro_Regular, 24);
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(236, 28);
        res.addChild(nameLabel);
        res.nameLabel = nameLabel;

        var sprCoin = this._getMoneyIcon(coinValue);

        var coinIcon = new cc.Sprite(sprCoin);
        coinIcon.setPosition(777, 28);
        res.addChild(coinIcon);

        var coinLabel = new cc.LabelTTF(cc.Global.NumberFormat1(coinValue), cc.res.font.Myriad_Pro_Regular, 24);
        coinLabel.setAnchorPoint(cc.p(0.0, 0.5));
        coinLabel.setPosition(832, 28);
        res.addChild(coinLabel);
        res.coinLabel = coinLabel;

        var highlightIndicator = new cc.Node();
        res.addChild(highlightIndicator);

        var border = new ccui.Scale9Sprite("home_dialog_select_bar.png", cc.rect(20, 20, 2, 2));
        border.setPreferredSize(cc.size(1040, 73));
        border.setPosition(543, 30);
        highlightIndicator.addChild(border);

        var arrow = new cc.Sprite("#home_dialog_select_arrow.png");
        arrow.setPosition(arrow.width / 2, res.height / 2);
        highlightIndicator.addChild(arrow);

        res.highlightIndicator = highlightIndicator;
        res.highlightIndicator.visible = false;

        res.setSelected = (function (isSelected) {
            this.highlightIndicator.visible = isSelected;
            this.sttLabel.enableStroke(cc.color("#ff9600"), isSelected ? 2 : 0);
            this.nameLabel.enableStroke(cc.color("#ff9600"), isSelected ? 2 : 0);
            this.coinLabel.enableStroke(cc.color("#ff9600"), isSelected ? 2 : 0);
        }).bind(res);

        return res;
    },
    _getMoneyIcon: function (coin) {
        var sprCoin = "";
        var arrConfig = cc.Global.moneyConfig;
        if (!arrConfig)
            return;
        for (var i = 0; i < arrConfig.length; i++) {
            if (arrConfig[i].Max < 0) {
                arrConfig[i].Max = Number.MAX_VALUE;
            }
            if (coin >= arrConfig[i].Min && coin <= arrConfig[i].Max) {
                sprCoin = arrConfig[i].IconUrl;
            }
        }

        return this.coinMap[sprCoin];
    },
    initItems: function (itemData) {
        this._allItems = [];
        this.scrollView.removeAllItems();
        for (var i = 0; i < itemData.length; i++) {
            var container = this._createInboxEntry(i % 2, i + 1, itemData[i].username, i % 3, itemData[i].coin);
            this.scrollView.pushBackCustomItem(container);
            this._allItems.push(container);
        }

        //this._setHighlightedIndex(0);
        this.setLoading(false);
    },

    _setHighlightedIndex: function (index) {
        if (!this._allItems[index])
            return;

        if (!isNaN(this._highlightedIndex))
            this._allItems[this._highlightedIndex].setSelected(false);

        this._allItems[index].setSelected(true);
        this._highlightedIndex = index;
    }
});