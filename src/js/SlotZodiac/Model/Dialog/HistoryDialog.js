var SlotZodiac = SlotZodiac || {};

(function () {
    var Dialog = SlotZodiac.Dialog;
    var HistoryController = SlotZodiac.HistoryController;

    SlotZodiac.HistoryDialog = Dialog.extend({
        ctor: function () {
            this._super.call(this, 1280, 691);

            var bg_history = new cc.Sprite("res/SlotZodiac/slotmaya_dialog_bg.png");
            bg_history.setPosition(this.width / 2, this.height / 2 + 80);
            // bg_history.setScale(0.9);
            // bg_history.setScale(1, 1.03);
            this.addChild(bg_history);

            var resultList = new newui.TableView(cc.size(1280, 460), 1);
            resultList.setPosition(this.width / 2 - 20, this.height / 2 - 120);
            resultList.setAnchorPoint(cc.p(0.5, 0.5));
            resultList.setDirection(ccui.ScrollView.DIR_VERTICAL);
            resultList.setTouchEnabled(true);
            resultList.setScrollBarEnabled(false);
            resultList.setBounceEnabled(true);
            this.resultList = resultList;

            var detailList = new newui.TableView(cc.size(1250, 460), 1);
            detailList.setPosition(resultList.getPosition());
            detailList.setAnchorPoint(cc.p(0.5, 0.5));
            detailList.setDirection(ccui.ScrollView.DIR_VERTICAL);
            detailList.setTouchEnabled(true);
            detailList.setScrollBarEnabled(false);
            detailList.setBounceEnabled(true);
            this.detailList = detailList;

            var mainLayer = new cc.Node();
            this.addChild(mainLayer);
            this.mainLayer = mainLayer;

            var detailLayer = new cc.Node();
            this.addChild(detailLayer);
            detailLayer.visible = false;
            this.detailLayer = detailLayer;

            this.mainLayer.addChild(resultList);
            this.detailLayer.addChild(detailList);

            this.initHeader();
            this.initDetailHeader();
            this.initPage();
            this.setLogo();
        },

        initBackground: function () {

        },
        setLogo: function () {
            var logotitle = new cc.Sprite("#slotmaya_history_title.png");
            logotitle.setPosition(this.width / 2, this.height - 120);
            this.addChild(logotitle);
        },

        initPage: function () {
            this._currentPage = 0;
            this._pendingPage = this._currentPage;

            var prevBtn = new ccui.Button("slotmaya_arrow.png", "", "", ccui.Widget.PLIST_TEXTURE);
            prevBtn.setPosition(-185, 309);
            this.mainLayer.addChild(prevBtn);

            var nextBtn = new ccui.Button("slotmaya_arrow.png", "", "", ccui.Widget.PLIST_TEXTURE);
            nextBtn.setFlippedX(true);
            nextBtn.setPosition(1500, prevBtn.y);
            this.mainLayer.addChild(nextBtn);

            var thiz = this;
            prevBtn.addClickEventListener(function () {
                if (thiz._currentPage !== thiz._pendingPage)
                    return;

                thiz._pendingPage = thiz._currentPage - 1;
                if (thiz._pendingPage < 0) {
                    thiz._pendingPage = thiz._currentPage;
                    return;
                }

                thiz._controller.sendRequestData(thiz._pendingPage);
            });

            nextBtn.addClickEventListener(function () {
                if (thiz._currentPage !== thiz._pendingPage)
                    return;

                thiz._pendingPage = thiz._currentPage + 1;
                thiz._controller.sendRequestData(thiz._pendingPage);
            });
        },

        initHeader: function () {
            var scale = 1;
            // var phien = new cc.LabelBMFont("PHIÊN", cc.SlotZodiacRes.font.Gentona_White);
            var phien = new cc.LabelTTF("SESSION", "Arial", 30);
            phien.enableStroke(cc.color("#310064"), 2);
            // phien.setScale(scale);
            phien.setPosition(90, 500);
            this.mainLayer.addChild(phien);

            // var thoigian = new cc.LabelBMFont("THỜI GIAN", cc.SlotZodiacRes.font.Gentona_White);
            var thoigian = new cc.LabelTTF("TIME", "Arial", 30);
            thoigian.setPosition(250, phien.y);
            thoigian.enableStroke(cc.color("#310064"), 2);
            // thoigian.setScale(scale);
            this.mainLayer.addChild(thoigian);

            // var betLine = new cc.LabelBMFont("SỐ DÒNG ĐẶT", cc.SlotZodiacRes.font.Gentona_White);
            var betLine = new cc.LabelTTF("LINES", "Arial", 30);
            betLine.setPosition(480, phien.y);
            betLine.enableStroke(cc.color("#310064"), 2);
            // betLine.setScale(scale);
            this.mainLayer.addChild(betLine);

            // var betLevel = new cc.LabelBMFont("MỨC CƯỢC", cc.SlotZodiacRes.font.Gentona_White);
            var betLevel = new cc.LabelTTF("BET", "Arial", 30);
            betLevel.setPosition(710, phien.y);
            betLevel.enableStroke(cc.color("#310064"), 2);
            // betLevel.setScale(scale);
            this.mainLayer.addChild(betLevel);

            // var rewardLine = new cc.LabelBMFont("SỐ DÒNG ĂN", cc.SlotZodiacRes.font.Gentona_White);
            var rewardLine = new cc.LabelTTF("PAY LINE", "Arial", 30);
            rewardLine.setPosition(920, phien.y);
            rewardLine.enableStroke(cc.color("#310064"), 2);
            // rewardLine.setScale(scale);
            this.mainLayer.addChild(rewardLine);

            // var reward = new cc.LabelBMFont("NHẬN", cc.SlotZodiacRes.font.Gentona_White);
            var reward = new cc.LabelTTF("WIN", "Arial", 30);
            reward.setPosition(1080, phien.y);
            reward.enableStroke(cc.color("#310064"), 2);
            // reward.setScale(scale);
            this.mainLayer.addChild(reward);
        },

        initDetailHeader: function () {
            // var betLineDetail = new cc.LabelBMFont("DÒNG ĐẶT", cc.SlotZodiacRes.font.Gentona_White);
            var betLineDetail = new cc.LabelTTF("LINES", "Arial", 30);
            betLineDetail.setPosition(375, 500);
            betLineDetail.enableStroke(cc.color("#310064"), 2);
            this.detailLayer.addChild(betLineDetail);

            // var rewardDetail = new cc.LabelBMFont("THẮNG", cc.SlotZodiacRes.font.Gentona_White);
            var rewardDetail = new cc.LabelTTF("WIN", "Arial", 30);
            rewardDetail.setPosition(820, betLineDetail.y);
            rewardDetail.enableStroke(cc.color("#310064"), 2);
            this.detailLayer.addChild(rewardDetail);

            var backBtn = new ccui.Button("slotmaya_button_back.png", "", "", ccui.Widget.PLIST_TEXTURE);
            backBtn.setPosition(70, 570);
            // backBtn.setScale(0.8);
            this.detailLayer.addChild(backBtn);

            var thiz = this;
            backBtn.addClickEventListener(function () {
                thiz.detailLayer.visible = false;
                thiz.mainLayer.visible = true;
            });
        },

        initController: function () {
            this._controller = new HistoryController(this);
        },

        showResult: function (result) {
            if (!result || (!result.length)) {
                this._pendingPage = this._currentPage;
                return;
            }
            this._currentPage = this._pendingPage;
            this.resultList.removeAllItems();
            var delay = 0;
            var scale = 1;
            for (var i = 0; i < result.length; i++) {
                var entry = result[i];

                var container = new ccui.Widget();
                container.setContentSize(cc.size(this.resultList.width, 90));

                // var session = new cc.LabelBMFont("#" + entry["session"] + "", cc.SlotZodiacRes.font.Gentona_White);
                var session = new cc.LabelTTF("#" + entry["session"] + "", "Arial", 26);
                session.setPosition(70, container.height / 2);
                session.setScale(scale);
                container.addChild(session);

                // var time = new cc.LabelBMFont(entry["time"] + "", cc.SlotZodiacRes.font.Gentona_White, 160, cc.TEXT_ALIGNMENT_CENTER);
                var time = new cc.LabelTTF(entry["time"] + "", "Arial", 26, cc.size(150, 60), cc.TEXT_ALIGNMENT_CENTER);
                time.setPosition(220, container.height / 2);
                time.setScale(scale);
                container.addChild(time);

                // var betCount = new cc.LabelBMFont(entry["betCount"] + "", cc.SlotZodiacRes.font.Gentona_White);
                var betCount = new cc.LabelTTF(entry["betCount"] + "", "Arial", 26);
                betCount.setPosition(450, container.height / 2);
                betCount.setScale(scale);
                container.addChild(betCount);

                // var betLevel = new cc.LabelBMFont(cc.GlobalSlotZodiac.FormatGold(entry["betLevel"]) + "", cc.SlotZodiacRes.font.Gentona_White);
                var betLevel = new cc.LabelTTF(cc.GlobalSlotZodiac.FormatGold(entry["betLevel"]) + "", "Arial", 26);
                betLevel.setPosition(700, container.height / 2);
                betLevel.setScale(scale);
                container.addChild(betLevel);

                // var rewardLine = new cc.LabelBMFont(entry["rewardLine"] + "", cc.SlotZodiacRes.font.Gentona_White);
                var rewardLine = new cc.LabelTTF(entry["rewardLine"] + "", "Arial", 26);
                rewardLine.setPosition(900, container.height / 2);
                rewardLine.setScale(scale);
                container.addChild(rewardLine);

                // var reward = new cc.LabelBMFont(cc.GlobalSlotZodiac.FormatGold(entry["reward"]) + "", cc.SlotZodiacRes.font.Gentona_White);
                var reward = new cc.LabelTTF(cc.GlobalSlotZodiac.FormatGold(entry["reward"]) + "", "Arial", 26);
                reward.setPosition(1070, container.height / 2);
                reward.setScale(scale);
                container.addChild(reward);

                var xemBtn = new ccui.Button("slotmaya_button_xem.png", "", "", ccui.Widget.PLIST_TEXTURE);
                xemBtn.setPosition(1200, container.height / 2);
                xemBtn.setScale(scale);
                container.addChild(xemBtn);

                // var separateLine = new cc.Sprite("#slotkhaihoi_separate_line.png");
                // separateLine.setPosition(container.width / 2, 0);
                // separateLine.visible = (i + 1) < result.length;
                // container.addChild(separateLine);


                // compatible with table view
                var wrapNode = new cc.Node();
                wrapNode.setContentSize(container.getContentSize());
                container.setAnchorPoint(cc.p(0.5, 0.5));
                container.setPosition(wrapNode.width / 2, wrapNode.height / 2);
                wrapNode.addChild(container);

                this.resultList.pushItem(wrapNode);
                container.setScaleY(0);

                var delayAction = new cc.DelayTime(delay);
                var scaleAction = new cc.ScaleTo(0.3, 1, 1);
                container.runAction(new cc.Sequence(delayAction, scaleAction));
                delay += 0.1;

                this.implementItemClick(xemBtn, entry["session"]);
            }
        },

        showDetail: function (details) {
            this.mainLayer.visible = false;
            this.detailLayer.visible = true;
            this.detailList.removeAllItems();
            var delay = 0;
            var scale = 1;
            for (var i = 0; i < details.length; i++) {
                var entry = details[i];

                var container = new ccui.Widget();
                container.setContentSize(cc.size(this.resultList.width, 90));

                // var betLine = new cc.LabelBMFont(entry["line"] + "", cc.SlotZodiacRes.font.Gentona_White);
                var betLine = new cc.LabelTTF(entry["line"] + "", "Arial", 26);
                betLine.setPosition(365, container.height / 2);
                betLine.setScale(scale);
                container.addChild(betLine);

                // var reward = new cc.LabelBMFont(cc.GlobalSlotZodiac.FormatGold(entry["reward"]) + "", cc.SlotZodiacRes.font.Gentona_White);
                var reward = new cc.LabelTTF(cc.GlobalSlotZodiac.FormatGold(entry["reward"]) + "", "Arial", 26);
                reward.setPosition(810, container.height / 2);
                reward.setScale(scale);
                container.addChild(reward);

                // var separateLine = new cc.Sprite("#slotkhaihoi_separate_line.png");
                // separateLine.setPosition(container.width / 2, 0);
                // separateLine.visible = (i + 1) < details.length;
                // container.addChild(separateLine);

                // compatible with table view
                var wrapNode = new cc.Node();
                wrapNode.setContentSize(container.getContentSize());
                container.setAnchorPoint(cc.p(0.5, 0.5));
                container.setPosition(wrapNode.width / 2, wrapNode.height / 2);
                wrapNode.addChild(container);

                this.detailList.pushItem(wrapNode);
                container.setScaleY(0);

                var delayAction = new cc.DelayTime(delay);
                var scaleAction = new cc.ScaleTo(0.3, 1, 1);
                container.runAction(new cc.Sequence(delayAction, scaleAction));
                delay += 0.1;
            }

        },

        onEnter: function () {
            this._super.apply(this, arguments);
        },

        showSessionDetail: function (session) {
            this._controller.sendRequestDetail(session);
        },

        implementItemClick: function (target, session) {
            var thiz = this;
            target.addClickEventListener(function () {
                thiz.showSessionDetail(session);
            });
        },
    });
})();
