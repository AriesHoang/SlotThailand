var HomeVipPolicyDialog = BackButtonDialog.extend({
    ctor: function (listData) {
        this._super();

        // var bg = new cc.Sprite("#home_dialog_bg_texture_light_only.png");
        var bg = new cc.Sprite();
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

        this._fillData(listData);
        this._initLabels();
    },
    _initLabels: function () {
        var title = MultiLanguage.createLabelTTFFont("POLICY_TITLE", cc.res.font.Myriad_Pro_Regular, 64);
        title.enableStroke(cc.color("#00d8ff"), 2);
        title.setPosition(0, 190);
        this.addChild(title);

        var label1 = MultiLanguage.createLabelTTFFont("POLICY_DESC", cc.res.font.Myriad_Pro_Bold, 30);
        label1.enableStroke(cc.color("#ff0000"), 2);
        label1.setFontFillColor(cc.color("#ffffff"));
        label1.setPosition(0, 277);
        this.addChild(label1);

        // var label2 = MultiLanguage.createLabelTTFFont("POLICY_GUIDE", cc.res.font.Myriad_Pro_Regular, 24);
        // label2.enableShadow(cc.color("#00d8ff"), cc.size(2, 2), 0);
        // label2.setPosition(0, -304);
        // this.addChild(label2);
    },
    _fillData: function (listData) {
        var iconVip = new cc.Sprite("#home_icon_vip_title.png");
        iconVip.setPosition(-200, 205);
        this.addChild(iconVip);
        var dataCount = listData.length;

        var mapRoles = {};

        for (var i = 0; i < dataCount; i++) {
            mapRoles[i] = listData[i]["Roles"].length;
        }

        var max = Object.keys(mapRoles).reduce(function (a, b) {
            return mapRoles[a] > mapRoles[b] ? a : b
        });

        var countMaxItem = mapRoles[max];
        this.maxItem = countMaxItem;
        var roles = listData[max]["Roles"];

        for (var i = 0; i < countMaxItem; i++) {
            var itemTitle = this._initTitle(i % 2, roles[i]["RoleName"], 382);
            itemTitle.setAnchorPoint(0.5, 0.5);
            itemTitle.setPosition(-334, 50 - 30 * i);
            this.addChild(itemTitle);
        }

        //Items
        var tableView = new newui.TableView(cc.size(675, 680), 1);
        tableView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        tableView.setBounceEnabled(true);
        tableView.setAnchorPoint(0.5, 0.5);
        tableView.setPosition(tableView.height / 2 - 143, -93);
        this.addChild(tableView);

        tableView.removeAllItems();

        for (var i = 0; i < dataCount; i++) {
            var item = this._initItem(listData[i]);
            tableView.pushItem(item);
        }
    },
    _initTitle: function (isDark, title, width, height) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(width, 35));
        var opacity = Math.floor(isDark ? (255 * 0.6) : (255 * 0.3));

        var itemBg = new ccui.Scale9Sprite("home_dialog_bg_money.png", cc.rect(40, 0, 2, 30));
        itemBg.setPreferredSize(cc.size(width, 29));
        itemBg.setPosition(res.width / 2, res.height / 2);
        itemBg.setOpacity(opacity);
        res.addChild(itemBg);

        var title = new cc.LabelTTF(title, cc.res.font.Myriad_Pro_Regular, 18);
        title.setAnchorPoint(0, 0.5);
        title.setPosition(10, itemBg.height / 2 - 3);
        itemBg.addChild(title);

        return res;
    },
    _initItem: function (item) {
        var node = new ccui.Widget();
        node.setContentSize(cc.size(270, 315));

        var currentLevel = PlayerMe.vipLevel;

        var bgEffect = new cc.Sprite("#home_dialog_current_vip_effect_policy.png");
        bgEffect.setAnchorPoint(0.5, 0.5);
        bgEffect.setPosition(160, 350);
        bgEffect.setOpacity((currentLevel == item["Level"]) ? 255 : 0);
        node.addChild(bgEffect);

        var thiz = this;
        TextureDownloader.load(item["IconUrl"], function (tex) {
            cc.spriteFrameCache.addSpriteFrames(item["IconUrl"], tex);
            var iconVip = new cc.Sprite(tex);
            iconVip.setAnchorPoint(0.5, 0.5);
            iconVip.setPosition(40, 360);
            iconVip.setContentSize(60, 100);
            iconVip.setScale(60 / iconVip.width);
            node.addChild(iconVip);
            thiz.iconVip = iconVip;
        });

        var effectVip = new cc.Sprite("#home_current_vip_active.png");
        effectVip.setAnchorPoint(0.5, 0.5);
        effectVip.setPosition(this.iconVip.x, this.iconVip.y - 18);
        effectVip.setScale(.2);
        node.addChild(effectVip, 2);

        var bgCheck = new cc.Sprite("#home_dialog_btn_checkbox.png");
        bgCheck.setAnchorPoint(0.5, 0.5);
        bgCheck.setPosition(this.iconVip.x + 20, this.iconVip.y - 25);
        node.addChild(bgCheck);

        var check = new cc.Sprite("#home_dialog_btn_checkbox_selected.png");
        check.setPosition(40, 25);
        bgCheck.addChild(check);


        bgCheck.setOpacity((currentLevel == item["Level"]) ? 255 : 0);
        check.setOpacity((currentLevel == item["Level"]) ? 255 : 0);

        var itemTitle = new cc.LabelTTF(item["DisplayName"], cc.res.font.Myriad_Pro_Regular, 22, cc.size(180, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        itemTitle.setAnchorPoint(0.5, 0.5);
        itemTitle.enableStroke(cc.color("#ff9600"), 2);
        itemTitle.setPosition(bgEffect.x, bgEffect.y);
        node.addChild(itemTitle);

        var count = item["Roles"].length;

        for (var j = 0; j < this.maxItem; j++) {
            var itemDrawBg = this._drawLineBg(j % 2, 270);
            itemDrawBg.setAnchorPoint(0.5, 0.5);
            itemDrawBg.setPosition(135, 300 - 30 * j);
            node.addChild(itemDrawBg);
        }

        for (var i = 0; i < count; i++) {
            var value = item["Roles"][i]["Value"];
            var itemTitle = this._initTitleItem(i % 2, value, 270);
            itemTitle.setAnchorPoint(0.5, 0.5);
            itemTitle.setPosition(135, 300 - 30 * i);
            node.addChild(itemTitle);

            var itemCheck = new cc.Sprite("#home_vip_policy_tick.png");
            itemCheck.setAnchorPoint(0.5, 0.5);
            itemCheck.setPosition(245, 300 - 30 * i);
            itemCheck.setOpacity((value.toLowerCase() == "có" || value.toLowerCase() == "yes") ? 255 : 30);
            node.addChild(itemCheck);
        }
        return node;
    },
    _drawLineBg: function (isDark, width) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(width, 35));
        var opacity = Math.floor(isDark ? (255 * 0.6) : (255 * 0.3));

        var itemBg = new ccui.Scale9Sprite("home_dialog_bg_money.png", cc.rect(40, 0, 2, 30));
        itemBg.setPreferredSize(cc.size(width, 29));
        itemBg.setAnchorPoint(0, 0.5);
        itemBg.setPosition(2, res.height / 2);
        itemBg.setOpacity(opacity);
        res.addChild(itemBg);

        return res;
    },
    _initTitleItem: function (isDark, title, width) {
        var res = new ccui.Widget();
        res.setContentSize(cc.size(width, 35));

        var title = new cc.LabelTTF(title, cc.res.font.Myriad_Pro_Regular, 18);
        title.setAnchorPoint(0, 0.5);
        title.setPosition(10, res.height / 2 - 3);
        res.addChild(title);

        return res;
    }


});