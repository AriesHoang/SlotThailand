var SlotZodiac = SlotZodiac || {};

(function () {
    var Dialog = SlotZodiac.Dialog;
    var RewardDialog = SlotZodiac.RewardDialog;

    SlotZodiac.CompleteFreeSpinDialog = Dialog.extend({
        ctor: function (turnCount, reward, width, height) {
            width = width || 1315;
            height = height || 703;
            this._super.call(this, width, height);

            this.initLabels(turnCount, reward);
        },

        initBackground: function () {
            RewardDialog.prototype.initBackground.call(this);
        },

        initLabels: function (turnCount, reward) {
            // var label = new cc.LabelBMFont("CONGRATULATION!", cc.SlotZodiacRes.font.UVN_DungDan_Freespin_35);
            var label = new cc.Sprite("#slotmaya_congratulation_title.png");
            // label.setScale(1.5);
            label.setPosition(655, 546);
            this.addChild(label);

            // label = new cc.LabelBMFont("YOU'VE DONE", cc.SlotZodiacRes.font.Roboto_Bold_FreeSpin_Result_30);
            var youDone = new cc.Sprite("#slotmaya_youvedone_title.png");
            youDone.setPosition(655, 466);
            this.addChild(youDone);

            // label = new cc.LabelBMFont("FREE SPIN", cc.SlotZodiacRes.font.Roboto_Bold_FreeSpin_Result_30);
            var fs = new cc.Sprite("#slotmaya_freespin_title.png");
            fs.setPosition(655, 350);
            this.addChild(fs);

            // label = new cc.LabelBMFont("TOTAL WIN", cc.SlotZodiacRes.font.Roboto_Bold_Stoke_Bonus_30);
            var totalwin = new cc.Sprite("#slotmaya_totalwin_title.png");
            totalwin.setPosition(655, 290);
            this.addChild(totalwin);

            // label = new cc.LabelBMFont("PRESS TO CONTINUE", cc.SlotZodiacRes.font.UVN_DungDan_Gardient_35);
            var presstocontinue = new cc.Sprite("#slotmaya_presscontinue_title.png");
            // presstocontinue.setScale(1.5);
            presstocontinue.setPosition(655, 67);
            this.addChild(presstocontinue);

            label = new cc.LabelBMFont(turnCount + "", cc.SlotZodiacRes.font.Roboto_bold_number_freespin);
            label.setScale(0.75);
            label.setPosition(655, 380);
            this.addChild(label);

            label = new cc.LabelBMFont(cc.GlobalSlotZodiac.FormatGold(reward), cc.SlotZodiacRes.font.Roboto_bold_number_freespin, 600, cc.TEXT_ALIGNMENT_CENTER);
            label.setPosition(655, 150);
            // label.setScale(0.75);
            this.addChild(label);
        },

        setExitCallback: function (fn) {
            this._exitCallback = fn;
        },

        onEnter: function () {
            SlotZodiac.CompleteBonusDialog.prototype.onEnter.call(this);
        },

        onExit: function () {
            this._super();
            if (this._exitCallback)
                this._exitCallback();
        }
    });
})();
