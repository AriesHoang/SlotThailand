var SlotZodiac = SlotZodiac || {};
(function () {
    var HistoryDialog = SlotZodiac.HistoryDialog || cc.Class;
    var RankingController = SlotZodiac.RankingController;

    SlotZodiac.RankingDialog = HistoryDialog.extend({
        ctor: function () {
            this._super.apply(this, arguments);
        },

        setLogo: function () {
            var logotitle = new cc.Sprite("#slotmaya_top_title.png");
            logotitle.setPosition(this.width / 2, this.height - 120);
            this.addChild(logotitle);
        },

        initHeader: function () {
            var scale = 1;
            // var time = new cc.LabelBMFont("THỜI GIAN", cc.SlotZodiacRes.font.Gentona_White);
            var time = new cc.LabelTTF("TIME", "Arial", 30);
            time.enableStroke(cc.color("#310064"), 2);
            time.setPosition(130, 500);
            // time.setScale(scale);
            this.mainLayer.addChild(time);

            // var phong = new cc.LabelBMFont("PHÒNG", cc.SlotZodiacRes.font.Gentona_White);
            var phong = new cc.LabelTTF("ROOM", "Arial", 30);
            phong.setPosition(350, time.y);
            phong.enableStroke(cc.color("#310064"), 2);
            // phong.setScale(scale);
            this.mainLayer.addChild(phong);

            // var account = new cc.LabelBMFont("TÀI KHOẢN", cc.SlotZodiacRes.font.Gentona_White);
            var account = new cc.LabelTTF("ACCOUNT", "Arial", 30);
            account.setPosition(600, time.y);
            account.enableStroke(cc.color("#310064"), 2);
            // account.setScale(scale);
            this.mainLayer.addChild(account);

            // var jackpot = new cc.LabelBMFont("SỐ HŨ", cc.SlotZodiacRes.font.Gentona_White);
            var jackpot = new cc.LabelTTF("JACKPOTS", "Arial", 30);
            jackpot.setPosition(810, time.y);
            jackpot.enableStroke(cc.color("#310064"), 2);
            // jackpot.setScale(scale);
            this.mainLayer.addChild(jackpot);

            // var sodongan = new cc.LabelBMFont("THẮNG", cc.SlotZodiacRes.font.Gentona_White);
            var sodongan = new cc.LabelTTF("WIN", "Arial", 30);
            sodongan.setPosition(1010, time.y);
            sodongan.enableStroke(cc.color("#310064"), 2);
            // sodongan.setScale(scale);
            this.mainLayer.addChild(sodongan);
        },

        showResult: function (result) {
            if (!result || (!result.length)) {
                this._pendingPage = this._currentPage;
                return;
            }
            this._currentPage = this._pendingPage;
            this.resultList.removeAllItems();
            var thiz = this;
            var delay = 0;
            var scale = 1;
            for (var i = 0; i < result.length; i++) {
                var entry = result[i];

                var container = new ccui.Widget();
                container.setContentSize(cc.size(this.resultList.width, 90));

                // var bg = new ccui.Scale9Sprite("slotmaya_dialog-result-bg.png", cc.rect(1, 1, 1, 1));
                // bg.setPreferredSize(cc.size(container.getContentSize()));
                // bg.setPosition(container.width / 2, container.height / 2);
                // bg.visible = false;
                // container.addChild(bg);

                // var time = new cc.LabelBMFont(entry["time"] + "", cc.SlotZodiacRes.font.Gentona_White, 160, cc.TEXT_ALIGNMENT_CENTER);
                var time = new cc.LabelTTF(entry["time"] + "", "Arial", 26, cc.size(160, 60), cc.TEXT_ALIGNMENT_CENTER);
                time.setPosition(103, container.height / 2);
                // time.setScale(scale);
                container.addChild(time);

                // var room = new cc.LabelBMFont(cc.GlobalSlotZodiac.FormatGold(entry["betLevel"]) + "", cc.SlotZodiacRes.font.Gentona_White, 160, cc.TEXT_ALIGNMENT_CENTER);
                var room = new cc.LabelTTF(cc.GlobalSlotZodiac.FormatGold(entry["betLevel"]) + "", "Arial", 26, cc.size(160, 60), cc.TEXT_ALIGNMENT_CENTER);
                room.setPosition(340, container.height / 2);
                // room.setScale(scale);
                container.addChild(room);

                // var account = new cc.LabelBMFont(entry["username"] + "", cc.SlotZodiacRes.font.Gentona_White);
                var account = new cc.LabelTTF(entry["username"] + "", "Arial", 26);
                account.setPosition(580, container.height / 2);
                // account.setScale(scale);
                container.addChild(account);

                // var jackpot = new cc.LabelBMFont(entry["totalJackpot"] + "", cc.SlotZodiacRes.font.Gentona_White);
                var jackpot = new cc.LabelTTF(entry["totalJackpot"] + "", "Arial", 26);
                jackpot.setPosition(800, container.height / 2);
                // jackpot.setScale(scale);
                container.addChild(jackpot);

                // var reward = new cc.LabelBMFont(cc.GlobalSlotZodiac.FormatGold(entry["totalReward"]) + "", cc.SlotZodiacRes.font.Gentona_White);
                var reward = new cc.LabelTTF(cc.GlobalSlotZodiac.FormatGold(entry["totalReward"]) + "", "Arial", 26);
                reward.setPosition(1000, container.height / 2);
                // reward.setScale(scale);
                container.addChild(reward);

                var xemBtn = new ccui.Button("slotmaya_button_xem.png", "", "", ccui.Widget.PLIST_TEXTURE);
                xemBtn.setPosition(1170, container.height / 2);
                // xemBtn.setScale(scale);
                container.addChild(xemBtn);

                // var separateLine = new cc.Sprite("#slotmaya_separate_line.png");
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

                this.implementItemClick(xemBtn, entry["session"], entry["totalReward"]);
            }
        },

        initController: function () {
            this._controller = new RankingController(this);
        }
    });
})();
