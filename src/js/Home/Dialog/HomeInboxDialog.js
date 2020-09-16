var HomeFixCheckbox = ccui.Button.extend({
    ctor: function (normalTex, crossTex, texType) {
        if (!crossTex || (crossTex.length === 0)) {
            crossTex = normalTex;
        }
        this.normalTex = normalTex;
        this.texType = texType;
        this._super(normalTex, "", "", texType);
        this.setZoomScale(0);
        this._selected = false;
        var thiz = this;
        this.addClickEventListener(function () {
            thiz.setSelected(!thiz._selected);
        });

        if (texType === ccui.Widget.PLIST_TEXTURE) {
            crossTex = "#" + crossTex;
        }

        var crossSprite = new cc.Sprite(crossTex);
        crossSprite.setPosition(this.width / 2, this.height / 2);
        crossSprite.visible = false;
        this.addChild(crossSprite);
        this.crossSprite = crossSprite;
    },

    setSelected: function (isSelected) {
        this._selected = isSelected;
        this.crossSprite.visible = isSelected;
    },

    isSelected: function () {
        return !!this._selected;
    }
});

var HomeInboxDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        this._alphaColor = 0;

        var bgnew = new ccui.ImageView("bg_popup.png", ccui.Widget.PLIST_TEXTURE);
        bgnew.ignoreContentAdaptWithSize(false);
        bgnew.setScale9Enabled(true);
        bgnew.setContentSize(cc.winSize.width, cc.winSize.height);
        //bgnew.setOpacity(200);
        // this.addChild(bgnew);

        this.mTouch = cc.rect(0, 0, 0, 0);

        this._initLabels();
        this._initHeader();
        this._allItems = [];

        var scrollView = new newui.TableView(cc.size(1120, 410), 1);
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setScrollBarEnabled(false);
        scrollView.setTouchEnabled(true);
        scrollView.setBounceEnabled(true);
        scrollView.setAnchorPoint(cc.p(0.5, 0.5));
        scrollView.setPosition(-16, -70);
        this.addChild(scrollView, 1);

        this.scrollView = scrollView;
        this._pageIndex = 0;

        var thiz = this;
        cc.Global.implementInfiniteScroll(this.scrollView, function () {
            // thiz._pageIndex = thiz._pageIndex + 1;
            // thiz._controller.sendGetItemRequest(thiz._pageIndex * 10);
        });

        this.initController();
        this._controller.sendGetItemRequest();
        // this.setLoading(true);
        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {
            scrollView.setScale(cc.winSize.screenScale);
            scrollView.setPosition(-16, -20);
        }
    },
    initController: function () {
        this._controller = new HomeInboxDialogController(this);
    },

    _initLabels: function () {
        var title = new cc.LabelTTF("HỘP THƯ", cc.res.font.Myriad_Pro_Regular, 40);
        title.enableStroke(cc.color("#073abe"), 2);
        title.setPosition(0, cc.winSize.height / 2 - title.height / 2 - 50);
        this.addChild(title);

    },

    _initHeader: function () {
        var container = this._createEntryBar(true);

        var stt = new cc.LabelTTF("STT", cc.res.font.Myriad_Pro_Regular, 22);
        stt.setColor(new cc.Color(60, 60, 60, 255));
        stt.setPosition(40, 30);
        container.addChild(stt);

        var sender = new cc.LabelTTF("Người gửi", cc.res.font.Myriad_Pro_Regular, 22);
        sender.setColor(new cc.Color(60, 60, 60, 255));
        sender.setPosition(210, 30);
        container.addChild(sender);

        var title = new cc.LabelTTF("Tiêu đề", cc.res.font.Myriad_Pro_Regular, 22);
        title.setColor(new cc.Color(60, 60, 60, 255));
        title.setPosition(553, 30);
        container.addChild(title);

        var date = new cc.LabelTTF("Ngày", cc.res.font.Myriad_Pro_Regular, 22);
        date.setColor(new cc.Color(60, 60, 60, 255));
        date.setPosition(853, 30);
        container.addChild(date);


        container.setPosition(-16, 163);
        this.addChild(container);

        var deleteBtn = new ccui.Button("home_dialog_btn_delete.png", "", "", ccui.Widget.PLIST_TEXTURE);
        deleteBtn.scale = 0.68;
        deleteBtn.setPosition(469, 163);
        this.addChild(deleteBtn);

        var thiz = this;
        deleteBtn.addClickEventListener(function () {
            thiz.deleteButtonHandler();
        });
        if (cc.winSize.height / cc.winSize.width === 4 / 3
            || cc.winSize.height / cc.winSize.width === 3 / 4) {
            container.setScale(cc.winSize.screenScale);
            deleteBtn.setPosition(330, 163);
        }
    },

    pushItems: function (result) {
        this.setLoading(false);
        if (this._pageIndex === 0) {
            this.scrollView.removeAllItems();
            this._allItems = [];
        }
        for (var i = 0; i < result.length; i++) {
            var container = this._createInboxEntry(this._allItems.length % 2, this._allItems.length + 1, result[i], i);
            this.scrollView.pushItem(container);
            this._allItems.push(container);
        }

    },

    // _setHighlightedIndex: function (index) {
    //     if (!this._allItems[index])
    //         return;
    // },

    _createEntryBar: function (isDark) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(1120, 57));
        // //  var color = cc.color(isDark ? "#6e1b54" : "#032559");
        // var opacity = 255;//Math.floor(isDark ? (255 * 0.6) : (255 * 0.3));
        // var color = cc.color("#d7cecf");
        //
        // var cell = new cc.LayerColor(color, 88, res.height);
        // cell.setPosition(0, 0);
        // cell.setOpacity(opacity);
        // res.addChild(cell);
        //
        // cell = new cc.LayerColor(color, 249, res.height);
        // cell.setPosition(88, 0);
        // cell.setOpacity(opacity);
        // res.addChild(cell);
        //
        // cell = new cc.LayerColor(color, 354, res.height);
        // cell.setPosition(337, 0);
        // cell.setOpacity(opacity);
        // res.addChild(cell);
        //
        // cell = new cc.LayerColor(color, 230, res.height);
        // cell.setPosition(691, 0);
        // cell.setOpacity(opacity);
        // res.addChild(cell);
        //
        // cell = new cc.LayerColor(color, 190, res.height);
        // cell.setPosition(921, 0);
        // cell.setOpacity(opacity);
        // res.addChild(cell);

        var header = new ccui.Scale9Sprite("home_inbox_header.png", "", "", ccui.Widget.PLIST_TEXTURE);
        header.setPreferredSize(cc.size(1120, 57));
        header.setPosition(cc.winSize.width / 2 - 85, 25);
        res.addChild(header);

        return res;
    },

    _createInboxEntry: function (isDark, stt, entry, i) {
        var thiz = this;
        //var res = this._createEntryBar(isDark);
        var res = new ccui.Widget();
        res.setContentSize(cc.size(1120, 57));
        // if (i % 2 === 0) {
        //     var color = cc.color("#d7cecf");
        // var cell = new cc.LayerColor(color, 1111, 57);
        var cell = new ccui.Scale9Sprite(isDark ? "home_inbox_light_bg.png" : "home_inbox_dark_bg.png", "", "", ccui.Widget.PLIST_TEXTURE);
        cell.setPreferredSize(cc.size(1120, 57));
        cell.setPosition(cc.winSize.width / 2 - 85, 25);
        // cell.setOpacity(50);
        res.addChild(cell);
        // }

        res.entry = entry;
        var font = cc.res.font.Myriad_Pro_Bold;

        var label = new cc.LabelTTF(stt, font, 24);
        label.setPosition(30, res.height / 2);
        res.addChild(label);

        var name = new cc.LabelTTF(entry.sender, font, 24);
        name.setAnchorPoint(cc.p(0.5, 0.5));
        name.setPosition(210, res.height / 2);
        res.addChild(name);

        var titleLabel = new cc.LabelTTF(entry.title, font, 24);
        titleLabel.setAnchorPoint(cc.p(0.5, 0.5));
        titleLabel.setPosition(550, res.height / 2);
        res.addChild(titleLabel);

        var readBtn = new ccui.Widget();
        readBtn.setContentSize(cc.size(371, res.height - 14));
        readBtn.setPosition(570, res.height / 2);
        readBtn.setTouchEnabled(true);
        res.addChild(readBtn);

        readBtn.addClickEventListener(function () {
            thiz._onClickEntry(res);
        });

        var dateLabel = new cc.LabelTTF(entry.sentTime, font, 24);
        dateLabel.setPosition(856, res.height / 2);
        res.addChild(dateLabel);

        var readIcon = new cc.Sprite("#home_dialog_read_icon.png");
        readIcon.setPosition(411, res.height / 2);
        res.addChild(readIcon);

        var checkbox = new HomeFixCheckbox("home_dialog_btn_checkbox.png", "home_dialog_btn_checkbox_selected.png", ccui.Widget.PLIST_TEXTURE);
        checkbox.scale = 0.68;
        checkbox.setPosition(1039, res.height / 2);
        res.addChild(checkbox);
        res.checkbox = checkbox;

        res.setRead = function (readStatus) {
            var newFont = readStatus ? cc.res.font.Myriad_Pro_Regular : cc.res.font.Myriad_Pro_Bold;
            label.setFontName(newFont);
            name.setFontName(newFont);
            titleLabel.setFontName(newFont);
            dateLabel.setFontName(newFont);
            readIcon.visible = readStatus;
        };

        res.setRead(entry.readStatus);
        return res;
    },

    deleteButtonHandler: function () {
        var deleteArr = [];
        for (var i = 0; i < this._allItems.length; i++) {
            var container = this._allItems[i];
            if (container.checkbox.isSelected())
                deleteArr.push(container.entry.id);
        }

        if (deleteArr.length) {
            this._controller.sendDeleteMailRequest(deleteArr);
        }
    },

    _onClickEntry: function (item) {
        item.setRead(true);
        cc.log(item.entry.content);
        this._controller.sendReadMailEvent(item.entry.id);
        // for (var i = 0; i < this._allItems.length; i++) {
        //     if (this._allItems[i] === item) {
        //         this._setHighlightedIndex(i);
        //         break;
        //     }
        // }
        var dialog = new HomeInboxDetailDialog(item.entry.title, item.entry.content);
        dialog.inboxDialog = this;
        // dialog.showWithAnimationScale();
        dialog.show();
        this.visible = false;
    },

    showDeleteSuccess: function (deletedItem) {
        var index = 0;
        while (index < this._allItems.length) {
            var container = this._allItems[index];
            if (deletedItem.indexOf(container.entry.id) !== -1) {
                this.scrollView.removeItem(index);
                this._allItems.splice(index, 1);
            } else {
                index++;
            }
        }
        this._pageIndex = 0;
        this._controller.sendGetItemRequest();

        // var dialog = new HomeInboxDetailDialog(MultiLanguage.getTextByKey("NOTIFICATION"), MultiLanguage.getTextByKey("MAIL_DEL") + deletedItem.length + " email");
        // dialog.showWithAnimationScale();
    }
});