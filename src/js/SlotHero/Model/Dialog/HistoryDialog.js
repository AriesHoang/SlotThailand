var SlotHero = SlotHero || {};

(function () {
    var Dialog = SlotHero.Dialog;
    var HistoryController = SlotHero.HistoryController;

    SlotHero.HistoryDialog = Dialog.extend({
        ctor: function () {
            this._super.apply(this, arguments);

            var detailList = new ccui.ListView();
            detailList.setContentSize(cc.size(1060, 450));
            detailList.setPosition(599, this.height / 2 - 35);
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

            this.detailLayer.addChild(detailList);

            this.initResultList();
            this.initHeader();
            this.initDetailHeader();
            this.initPage();
            // this.setTitle(MultiLanguage.getTextByKey("HISTORY_BUTTON_TITLE"));
            this.setLogo();
        },


        setLogo: function () {
            var title = new cc.Sprite("#slothero_history_title.png");
            title.setAnchorPoint(cc.p(0.5, 0.5));
            title.setPosition(this.width / 2, this.height - 45);
            this.addChild(title);
        },

        initResultList: function () {
            var resultList = new ccui.ListView();
            resultList.setContentSize(cc.size(1060, 450));
            resultList.setPosition(599, this.height / 2 - 35);
            resultList.setAnchorPoint(cc.p(0.5, 0.5));
            resultList.setDirection(ccui.ScrollView.DIR_VERTICAL);
            resultList.setTouchEnabled(true);
            resultList.setScrollBarEnabled(false);
            resultList.setBounceEnabled(true);
            this.resultList = resultList;
            this.mainLayer.addChild(resultList);
        },

        initPage: function () {
            this._currentPage = 0;
            this._pendingPage = this._currentPage;

            var prevBtn = new ccui.Button("slothero_arrow.png", "", "", ccui.Widget.PLIST_TEXTURE);
            prevBtn.setPosition(0, 308);
            this.mainLayer.addChild(prevBtn);

            var nextBtn = new ccui.Button("slothero_arrow.png", "", "", ccui.Widget.PLIST_TEXTURE);
            nextBtn.setFlippedX(true);
            nextBtn.setPosition(1230, prevBtn.y);
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
            // var headerBg = new cc.Sprite("#slothero_history_dialog_header.png");
            var headerBg = new cc.Sprite("");
            headerBg.setPosition(599, 565);
            this.mainLayer.addChild(headerBg);

            var phien = new cc.Sprite("#slothero_session_title.png");
            phien.setPosition(132, 565);
            this.mainLayer.addChild(phien);

            var thoigian = new cc.Sprite("#slothero_time_title.png");
            thoigian.setPosition(274, phien.y);
            this.mainLayer.addChild(thoigian);

            var betLine = new cc.Sprite("#slothero_betline_title.png");
            betLine.setPosition(460, phien.y);
            this.mainLayer.addChild(betLine);

            var betLevel = new cc.Sprite("#slothero_betvalue_title.png");
            betLevel.setPosition(643, phien.y);
            this.mainLayer.addChild(betLevel);

            var rewardLine = new cc.Sprite("#slothero_payline_title.png");
            rewardLine.setPosition(814, phien.y);
            this.mainLayer.addChild(rewardLine);

            var reward = new cc.Sprite("#slothero_win_title.png");
            reward.setPosition(972, phien.y);
            this.mainLayer.addChild(reward);

            // var lineDoc = new cc.DrawNode();
            // this.mainLayer.addChild(lineDoc);
            // lineDoc.drawSegment(cc.p(182, 530), cc.p(182, 60), 2, cc.color(124, 87, 34, 140));
            // lineDoc.drawSegment(cc.p(353, 530), cc.p(353, 60), 2, cc.color(124, 87, 34, 140));
            // lineDoc.drawSegment(cc.p(553, 530), cc.p(553, 60), 2, cc.color(124, 87, 34, 140));
            // lineDoc.drawSegment(cc.p(728, 530), cc.p(728, 60), 2, cc.color(124, 87, 34, 140));
            // lineDoc.drawSegment(cc.p(913, 530), cc.p(913, 60), 2, cc.color(124, 87, 34, 140));
        },

        initDetailHeader: function () {
            // var headerBg = new cc.Sprite("#slotwomenagent_history_dialog_header.png");
            var headerBg = new cc.Sprite("");
            headerBg.setPosition(599, 565);
            this.detailLayer.addChild(headerBg);

            var betLineDetail = new cc.Sprite("#slothero_betline_title.png");
            betLineDetail.setPosition(296, 565);
            this.detailLayer.addChild(betLineDetail);

            var rewardDetail = new cc.Sprite("#slothero_win_title.png");
            rewardDetail.setPosition(850, betLineDetail.y);
            this.detailLayer.addChild(rewardDetail);

            var backBtn = new ccui.Button("slothero_button_back.png", "slothero_button_back.png", "", ccui.Widget.PLIST_TEXTURE);
            backBtn.setPosition(71, this.height - 30);
            this.detailLayer.addChild(backBtn);

            var thiz = this;
            backBtn.addClickEventListener(function () {
                thiz.detailLayer.visible = false;
                thiz.mainLayer.visible = true;
            });

            // var lineDoc = new cc.DrawNode();
            // this.detailLayer.addChild(lineDoc);
            // lineDoc.drawSegment(cc.p(553, 530), cc.p(553, 60), 2, cc.color(124, 87, 34, 140));
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
            for (var i = 0; i < result.length; i++) {
                var entry = result[i];

                var container = new ccui.Widget();
                container.setContentSize(cc.size(this.resultList.width, 66));

                var session = new cc.LabelBMFont("#" + entry["session"] + "", cc.SlotHeroRes.font.PopupFont);
                session.setPosition(59, container.height / 2);
                container.addChild(session);

                var time = new cc.LabelBMFont(entry["time"] + "", cc.SlotHeroRes.font.PopupFont);
                time.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
                time.setPosition(200, session.y);
                container.addChild(time);

                var betCount = new cc.LabelBMFont(entry["betCount"] + "", cc.SlotHeroRes.font.PopupFont);
                betCount.setPosition(372, session.y);
                container.addChild(betCount);

                var betLevel = new cc.LabelBMFont(cc.GlobalSlotHero.FormatGold(entry["betLevel"]) + "", cc.SlotHeroRes.font.PopupFont);
                betLevel.setPosition(567, session.y);
                container.addChild(betLevel);

                var rewardLine = new cc.LabelBMFont(entry["rewardLine"] + "", cc.SlotHeroRes.font.PopupFont);
                rewardLine.setPosition(753, session.y);
                container.addChild(rewardLine);

                var reward = new cc.LabelBMFont(cc.GlobalSlotHero.FormatGold(entry["reward"]), cc.SlotHeroRes.font.PopupFont);
                reward.setPosition(899, session.y);
                container.addChild(reward);

                var xemBtn = new ccui.Button("slothero_button_xem.png", "slothero_button_xem.png", "", ccui.Widget.PLIST_TEXTURE);
                xemBtn.setPosition(1000, session.y);
                container.addChild(xemBtn);

                // var separateLine = new cc.DrawNode();
                // separateLine.visible = (i + 1) < result.length;
                // container.addChild(separateLine);
                // separateLine.drawSegment(cc.p(0, 0), cc.p(container.width, 0), 2, cc.color(124, 87, 34, 92));

                this.resultList.pushBackCustomItem(container);
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
            for (var i = 0; i < details.length; i++) {
                var entry = details[i];

                var container = new ccui.Widget();
                container.setContentSize(cc.size(this.resultList.width, 66));

                var betLine = new cc.LabelBMFont(entry["line"] + "", cc.SlotHeroRes.font.PopupFont);
                betLine.setPosition(230, container.height / 2);
                container.addChild(betLine);

                var reward = new cc.LabelBMFont(cc.GlobalSlotHero.FormatGold(entry["reward"]), cc.SlotHeroRes.font.PopupFont);
                reward.setPosition(770, container.height / 2);
                container.addChild(reward);

                // var separateLine = new cc.DrawNode();
                // separateLine.visible = (i + 1) < details.length;
                // container.addChild(separateLine);
                // separateLine.drawSegment(cc.p(0, 0), cc.p(container.width, 0), 2, cc.color(124, 87, 34, 92));

                this.detailList.pushBackCustomItem(container);
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
        }
    });
})();
