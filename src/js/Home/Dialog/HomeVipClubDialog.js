var HomeVipClubDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        // var bg = new cc.Sprite("#home_dialog_bg_texture_light_only.png");
        var bg = new cc.Sprite();
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

        this._initLabels();

        if (cc.sys.isNative) {
            // KingIDSDK.getInstance().getListVipPoint(this._getListVipCallback, this);
        }
        this.setLoading(true);
    },
    _getListVipCallback: function (isSuccess, result) {
        if (isSuccess) {
            cc.log(result);
            var listData = result["data"];
            var currentLevel = PlayerMe.vipLevel;
            var count = listData.length;

            for (var i = 0; i < count; i++) {
                if (listData [i]["Level"] == currentLevel) {
                    if (i < (count - 1)) {
                        var next = listData [i + 1]["DisplayName"];
                        var strName = (next.length <= 21) ? next : next.substring(0, 19) + "..";
                        this._initGUIs(listData, listData [i]["IconUrl"], listData [i + 1]["IconUrl"], strName, listData[i]["MinPoint"], listData[i]["MaxPoint"]);
                    } else {
                        var next = listData [i]["DisplayName"];
                        var strName = (next.length <= 21) ? next : next.substring(0, 19) + "..";
                        this._initGUIs(listData, listData [i]["IconUrl"], listData [i]["IconUrl"], strName, listData[i]["MinPoint"], listData[i]["MaxPoint"]);
                    }
                }
            }
        }
        this.setLoading(false);
    },
    _initLabels: function () {
        var title = MultiLanguage.createLabelTTFFont("VIP_TITLE", cc.res.font.Myriad_Pro_Regular, 64);
        title.enableStroke(cc.color("#00d8ff"), 2);
        title.setPosition(0, 190);
        this.addChild(title);

        var label1 = MultiLanguage.createLabelTTFFont("VIPCLUB_DESCRIPTION", cc.res.font.Myriad_Pro_Bold, 30);
        label1.enableStroke(cc.color("#ff0000"), 2);
        label1.setFontFillColor(cc.color("#ffffff"));
        label1.setPosition(0, 277);
        this.addChild(label1);
    },
    _initGUIs: function (listData, currentIcon, nextIcon, nextName, minPoint, maxPoint) {
        var iconVip = new cc.Sprite("#home_icon_vip.png");
        iconVip.setPosition(-200, 205);
        this.addChild(iconVip);

        var bgCurrentVip = new ccui.Button("home_dialog_current_vip_effect.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgCurrentVip.setPosition(-145, 10);
        bgCurrentVip.setZoomScale(0);
        this.addChild(bgCurrentVip, 2);

        bgCurrentVip.addClickEventListener(function () {
            var dialog = new HomeVipPolicyDialog(listData);
            // dialog.showWithAnimationScale();
            dialog.show();
        });

        var thiz = this;
        TextureDownloader.load(currentIcon, function (tex) {
            cc.spriteFrameCache.addSpriteFrames(currentIcon, tex);

            var currentVip = new cc.Sprite(tex);
            currentVip.setPosition(bgCurrentVip.width / 2, bgCurrentVip.height / 2);
            currentVip.setContentSize(120, 208);
            currentVip.setScale(120 / currentVip.width);
            bgCurrentVip.addChild(currentVip);
        });

        var effCurrentVip = new cc.Sprite("#home_current_vip_active.png");
        effCurrentVip.setPosition(bgCurrentVip.width / 2, bgCurrentVip.height / 2 - 50);
        effCurrentVip.setScale(.6);
        bgCurrentVip.addChild(effCurrentVip, 2);

        TextureDownloader.load(nextIcon, function (tex) {
            cc.spriteFrameCache.addSpriteFrames(nextIcon, tex);
            cc.log("next icon:" + nextIcon);
            var nextVip = new cc.Sprite(tex);
            nextVip.setPosition(230, 10);
            nextVip.setContentSize(120, 208);
            nextVip.setScale(120 / nextVip.width);
            thiz.addChild(nextVip);
        });

        var effNextVip = new ccui.Button("home_next_vip_lock.png", "", "", ccui.Widget.PLIST_TEXTURE);
        effNextVip.setPosition(240, 10);
        this.addChild(effNextVip, 2);

        effNextVip.addClickEventListener(function () {
            var dialog = new HomeVipPolicyDialog(listData);
            // dialog.showWithAnimationScale();
            dialog.show();
        });

        var currentVipPoint = PlayerMe.vipPoint;
        var prgVip = new cc.ControlSlider("#home_bgProgressbarVip.png", "#home_force_ProgressbarVip.png", "");
        prgVip.setMaximumValue(maxPoint);
        prgVip.setMinimumValue(minPoint);
        prgVip.setEnabled(false);
        prgVip.setValue(currentVipPoint);
        prgVip.setPosition(0, -160);
        this.addChild(prgVip);

        var per = Math.floor(currentVipPoint * 100 / maxPoint) / 100;

        var lbPercent = new cc.LabelTTF(per + "%", cc.res.font.Myriad_Pro_Bold, 25);
        lbPercent.enableStroke(cc.color("#ffffff"), 2);
        lbPercent.setFontFillColor(cc.color("#000000"));
        lbPercent.setPosition(prgVip.width / 2, prgVip.height / 2);
        prgVip.addChild(lbPercent);

        var lbNameNextVip = new cc.LabelTTF(nextName, cc.res.font.Myriad_Pro_Regular, 25);
        lbNameNextVip.setAnchorPoint(1, .5);
        lbNameNextVip.enableStroke(cc.color("#ffffff"), 2);
        lbNameNextVip.setFontFillColor(cc.color("#000000"));
        lbNameNextVip.setPosition(prgVip.width - 20, prgVip.height / 2);
        prgVip.addChild(lbNameNextVip);

        var lbCurrentVipPoint = MultiLanguage.createLabelTTFFont("VIP_POINT", cc.res.font.Myriad_Pro_Bold, 25);
        lbCurrentVipPoint.enableStroke(cc.color("#ffffff"), 2);
        lbCurrentVipPoint.setFontFillColor(cc.color("#000000"));
        lbCurrentVipPoint.setPosition(-260, -210);
        this.addChild(lbCurrentVipPoint);

        var lbVipPoint = new cc.LabelTTF(currentVipPoint.toString(), cc.res.font.Myriad_Pro_Regular, 25);
        lbVipPoint.setAnchorPoint(1, .5);
        lbVipPoint.enableStroke(cc.color("#ffffff"), 2);
        lbVipPoint.setFontFillColor(cc.color("#000000"));
        lbVipPoint.setPosition(lbCurrentVipPoint.width + 30 + lbVipPoint.width / 2, lbCurrentVipPoint.height / 2);
        lbCurrentVipPoint.addChild(lbVipPoint);

    }
});