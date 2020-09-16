var SlotAladdin = SlotAladdin || {};

(function () {
    var HistoryDialog = SlotAladdin.HistoryDialog;
    var RankingController = SlotAladdin.RankingController;
    SlotAladdin.RankingDialog = HistoryDialog.extend({
        ctor: function () {
            var width = 1178;
            var height = 658;
            this._super.call(this, width, height);

            this.initFilters();
            this.initDetailHeader();
            this.detailList.setPosition(this.detailList.x, this.height / 2 - 35);
            // this.setTitle(MultiLanguage.getTextByKey("RANKING_TITLE"));
            this.setLogo();
        },


        setLogo: function () {
            var title = new cc.Sprite("#slotaladdin_topwinner_title.png");
            title.setAnchorPoint(cc.p(0.5, 0.5));
            title.setPosition(this.width / 2, this.height - 45);
            this.addChild(title);
        },

        initResultList: function () {
            var resultList = new newui.TableView(cc.size(1017, 450), 1);
            resultList.setPosition(654, this.height / 2 - 35);
            resultList.setAnchorPoint(cc.p(0.5, 0.5));
            resultList.setDirection(ccui.ScrollView.DIR_VERTICAL);
            resultList.setTouchEnabled(true);
            resultList.setScrollBarEnabled(false);
            resultList.setBounceEnabled(true);
            this.resultList = resultList;
            this.mainLayer.addChild(resultList);

            var thiz = this;
            cc.Global.implementInfiniteScroll(resultList, function () {
                thiz._controller.sendRequestData(thiz._pageIndex, thiz._currentFilter.filterId);
            });
        },

        initHeader: function () {
            var headerBg = new cc.Sprite("");
            headerBg.setAnchorPoint(cc.p(0.5, 0.5));
            headerBg.setPosition(590, 555);
            this.mainLayer.addChild(headerBg);

            var time = new cc.Sprite("#slotaladdin_time_title.png");
            time.setPosition(267, 560);
            this.mainLayer.addChild(time);

            var phong = new cc.Sprite("#slotaladdin_room_title.png");
            phong.setPosition(452, time.y);
            this.mainLayer.addChild(phong);

            var account = new cc.Sprite("#slotaladdin_account_title.png");
            account.setPosition(651, time.y);
            this.mainLayer.addChild(account);

            var jackpot = new cc.Sprite("#slotaladdin_jackpots_title.png");
            jackpot.setPosition(829, time.y);
            this.mainLayer.addChild(jackpot);

            var sodongan = new cc.Sprite("#slotaladdin_win_title.png");
            sodongan.setPosition(977, time.y);
            this.mainLayer.addChild(sodongan);

            // var lineDoc = new cc.DrawNode();
            // this.mainLayer.addChild(lineDoc);
            // lineDoc.drawSegment(cc.p(357, 514), cc.p(357, 48), 2, cc.color(124, 87, 34, 140));
            // lineDoc.drawSegment(cc.p(547, 514), cc.p(547, 48), 2, cc.color(124, 87, 34, 140));
            // lineDoc.drawSegment(cc.p(743, 514), cc.p(743, 48), 2, cc.color(124, 87, 34, 140));
            // lineDoc.drawSegment(cc.p(899, 514), cc.p(899, 48), 2, cc.color(124, 87, 34, 140));
            // lineDoc.drawSegment(cc.p(1045, 514), cc.p(1045, 48), 2, cc.color(124, 87, 34, 140));
        },

        initDetailHeader: function () {
            var headerBg = new cc.Sprite("#slotwomenagent_history_dialog_header.png");
            headerBg.setPosition(580, 555);
            this.detailLayer.addChild(headerBg);

            var betLineDetail = new cc.Sprite("#slotaladdin_betline_title.png");
            betLineDetail.setPosition(296, 555);
            this.detailLayer.addChild(betLineDetail);

            var rewardDetail = new cc.Sprite("#slotaladdin_win_title.png");
            rewardDetail.setPosition(850, betLineDetail.y);
            this.detailLayer.addChild(rewardDetail);

            var backBtn = new ccui.Button("slotaladdin_button_back.png", "slotaladdin_button_back.png", "", ccui.Widget.PLIST_TEXTURE);
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

        initPage: function () {

        },

        initButton: function () {
            this._super.apply(this, arguments);

            this.closeBtn.setPosition(this.width - 24, this.height - 22);
        },

        initFilters: function () {
            this._filterGroup = [];
            this._currentFilter = null;

            // jackpot filter
            var jackpotFilterBtn = new ccui.Button("slotwomenagent_filter_normal.png", "", "", ccui.Widget.PLIST_TEXTURE);
            jackpotFilterBtn.setZoomScale(0);
            jackpotFilterBtn.filterId = 1;
            jackpotFilterBtn.setPosition(50, 557);
            this.mainLayer.addChild(jackpotFilterBtn);

            var jackpotText = new cc.Sprite("#slotwomenagent_filter_jackpot.png");
            jackpotText.setPosition(jackpotFilterBtn.width / 2, jackpotFilterBtn.height / 2);
            jackpotFilterBtn.addChild(jackpotText);

            // thang lon filter
            var bigWinFilterBtn = new ccui.Button("slotwomenagent_filter_normal.png", "", "", ccui.Widget.PLIST_TEXTURE);
            bigWinFilterBtn.setZoomScale(0);
            bigWinFilterBtn.filterId = 2;
            bigWinFilterBtn.setPosition(50, 481);
            this.mainLayer.addChild(bigWinFilterBtn);

            var bigWinText = new cc.Sprite("#slotwomenagent_filter_thanglon.png");
            bigWinText.setPosition(bigWinFilterBtn.width / 2, bigWinFilterBtn.height / 2);
            bigWinFilterBtn.addChild(bigWinText);

            // other filter
            var otherFilterBtn = new ccui.Button("slotwomenagent_filter_normal.png", "", "", ccui.Widget.PLIST_TEXTURE);
            otherFilterBtn.setZoomScale(0);
            otherFilterBtn.filterId = 3;
            otherFilterBtn.setPosition(50, 403);
            this.mainLayer.addChild(otherFilterBtn);

            var otherText = new cc.Sprite("#slotwomenagent_filter_khac.png");
            otherText.setPosition(otherFilterBtn.width / 2, otherFilterBtn.height / 2);
            otherFilterBtn.addChild(otherText);

            var thiz = this;
            this._filterGroup = [jackpotFilterBtn, bigWinFilterBtn, otherFilterBtn];
            jackpotFilterBtn.addClickEventListener(function () {
                thiz.selectFilter(0);
            });

            bigWinFilterBtn.addClickEventListener(function () {
                thiz.selectFilter(1);
            });

            otherFilterBtn.addClickEventListener(function () {
                thiz.selectFilter(2);
            });
        },

        onEnter: function () {
            this._super();
            this.selectFilter(0);
        },

        selectFilter: function (filterIndex) {
            var filter = this._filterGroup[filterIndex];

            if (filter === this._currentFilter) {
                // deselect
                this._currentFilter.loadTextureNormal("slotwomenagent_filter_normal.png", ccui.Widget.PLIST_TEXTURE);
                this._currentFilter = null;
                this._controller.sendRequestData(0, 0);
                return;
            }

            if (this._currentFilter)
                this._currentFilter.loadTextureNormal("slotwomenagent_filter_normal.png", ccui.Widget.PLIST_TEXTURE);

            this._pageIndex = 0;
            this.resultList.removeAllItems();
            this._allItems = [];

            this._currentFilter = filter;
            filter.loadTextureNormal("slotwomenagent_filter_selected.png", ccui.Widget.PLIST_TEXTURE);
            this._controller.sendRequestData(0, filter.filterId);
        },

        showResult: function (result) {
            if (!result || (!result.length)) {
                return;
            }
            this._allItems = this._allItems || [];

            if (this._pageIndex === 0) {
                this.resultList.removeAllItems();
                this._allItems = [];
            }
            for (var i = 0; i < result.length; i++) {
                var res = {};
                res.session = result[i]["session"];
                res.username = result[i]["username"];
                res.betLevel = result[i]["betLevel"];
                res.totalBet = result[i]["totalBet"];
                res.totalReward = result[i]["totalReward"];
                res.totalJackpot = result[i]["totalJackpot"];
                res.time = result[i]["time"];
                this._allItems.push(res);
            }
            this.initResultItem(this._allItems);
            this._pageIndex++;
        },

        initResultItem: function (result) {
            var thiz = this;
            var delay = 0;
            this.resultList.removeAllItems();
            for (var i = 0; i < result.length; i++) {
                var entry = result[i];

                var container = new ccui.Widget();
                container.setContentSize(cc.size(this.resultList.width, 67));

                var time = new cc.LabelBMFont(entry.time + "", cc.SlotAladdinRes.font.PopupFont);
                time.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
                time.setPosition(100, 37);
                container.addChild(time);

                var account = new cc.LabelBMFont(entry.username, cc.SlotAladdinRes.font.PopupFont);
                account.setPosition(309, time.y);
                container.addChild(account);

                var room = new cc.LabelBMFont(cc.GlobalSlotAladdin.FormatGold(entry.betLevel), cc.SlotAladdinRes.font.PopupFont);
                room.setPosition(492, time.y);
                container.addChild(room);

                var reward = new cc.LabelBMFont(cc.GlobalSlotAladdin.FormatGold(entry.totalReward), cc.SlotAladdinRes.font.PopupFont);
                reward.setPosition(673, time.y);
                container.addChild(reward);

                var filterIndex = this._filterGroup.indexOf(this._currentFilter);
                var str = "";
                if (filterIndex === 0)
                    str = MultiLanguage.getTextByKey("JACKPOTWIN_TITLE");
                if (filterIndex === 1)
                    str = MultiLanguage.getTextByKey("BIGWIN_TITLE");
                else if (filterIndex === 2)
                    str = MultiLanguage.getTextByKey("OTHERWIN_TITLE");

                var description = new cc.LabelBMFont(str, cc.SlotAladdinRes.font.PopupFont);
                description.setPosition(831, time.y);
                container.addChild(description);

                var xemBtn = new ccui.Button("slotaladdin_button_xem.png", "slotaladdin_button_xem.png", "", ccui.Widget.PLIST_TEXTURE);
                xemBtn.setZoomScale(0);
                xemBtn.setPosition(960, time.y);
                container.addChild(xemBtn);

                // var separateLine = new cc.DrawNode();
                // separateLine.visible = (i + 1) < result.length;
                // container.addChild(separateLine);
                // separateLine.drawSegment(cc.p(0, 0), cc.p(container.width, 0), 2, cc.color(124, 87, 34, 92));

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
                delay += 0.05;

                this.implementItemClick(xemBtn, entry["session"], entry["totalReward"]);
            }
        },
        initController: function () {
            this._controller = new RankingController(this);
        }
    });
})();
