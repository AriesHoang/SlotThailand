var HomeLuckyHelpDialog = BackButtonDialog.extend({
    ctor: function (content) {
        this._super();

        var bg = new cc.Sprite("#home_dialog_bg_blank.png");
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);
        this._initLabels(content);
    },
    _initLabels: function (content) {
        var title = MultiLanguage.createLabelTTFFont("HELP_LUCKY_TITLE", cc.res.font.Myriad_Pro_Regular, 64);
        title.enableStroke(cc.color("#00d8ff"), 2);
        title.setPosition(0, 197);
        this.addChild(title);

        var tableView = new newui.TableView(cc.size(1050, 380), 1);
        tableView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        tableView.setBounceEnabled(true);
        tableView.setAnchorPoint(cc.p(0.5, 0.5));
        tableView.setPosition(20, -20);
        this.addChild(tableView);

        var lbContent = new cc.LabelTTF(content, cc.res.font.Myriad_Pro_Regular, 30, cc.size(1050, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        lbContent.setAnchorPoint(cc.p(0.5, 1));
        tableView.pushItem(lbContent);
    },

});