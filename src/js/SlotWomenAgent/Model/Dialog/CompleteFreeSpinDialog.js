var SlotWomenAgent = SlotWomenAgent || {};

(function () {
    var Dialog = SlotWomenAgent.Dialog;
    SlotWomenAgent.CompleteFreeSpinDialog = Dialog.extend({
        ctor: function (turnCount, reward) {
            this._super.apply(this, Array.prototype.slice.call(arguments, 2));

            // var bgLayer = new cc.LayerColor(cc.color(37, 9, 3, 255));
            // bgLayer.setContentSize(1060, 548);
            // bgLayer.setPosition(68, 48);
            // this.addChild(bgLayer);

            this.initGUI();
            this.setLogo();
            this.initLabels(turnCount, reward);
            var thiz = this;
            this.runAction(new cc.Sequence(new cc.DelayTime(3), new cc.CallFunc(function () {
                thiz.hide();
            })));
        },

        setLogo: function () {
            var title = new cc.Sprite("#slotwomentagent_congratulation_title.png");
            title.setAnchorPoint(cc.p(0.5, 0.5));
            title.setPosition(this.width / 2, this.height - 45);
            this.addChild(title);
        },

        initGUI: function () {
            var tip1 = new cc.Sprite("#slotwomentagent_done_title.png");
            tip1.setPosition(this.width / 2, 550);
            this.addChild(tip1);

            var tip2 = new cc.Sprite("#slotwomenagent_freespin_title.png");
            tip2.setPosition(tip1.x, 385);
            this.addChild(tip2);

            var tip3 = new cc.Sprite("#slotwomenagent_totalwin_title.png");
            tip3.setPosition(tip1.x, 250);
            this.addChild(tip3);
        },

        initLabels: function (turnCount, reward) {
            var turnCountLabel = new cc.LabelBMFont(turnCount, cc.SlotWomenAgentRes.font.Bonus_Result);
            turnCountLabel.setPosition(606, 470);
            this.addChild(turnCountLabel, 100);

            var rewardLabel = new cc.LabelBMFont(cc.GlobalSlotWomenAgent.FormatGold(reward), cc.SlotWomenAgentRes.font.Bonus_Result);
            rewardLabel.setPosition(606, 150);
            this.addChild(rewardLabel);
        },

        setExitCallback: function (fn) {
            this._exitCallback = fn;
        },

        onExit: function () {
            this._super();
            if (this._exitCallback)
                this._exitCallback();
        }
    });
})();
