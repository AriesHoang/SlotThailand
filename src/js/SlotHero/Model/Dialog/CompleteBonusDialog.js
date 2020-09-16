var SlotHero = SlotHero || {};

(function () {
    var Dialog = SlotHero.Dialog;

    SlotHero.CompleteBonusDialog = Dialog.extend({
        ctor: function (reward, multiplier, exitCallback, width, height) {
            width = width || cc.winSize.width;
            height = height || cc.winSize.height;
            this._super.call(this, width, height);

            var rewardPanel = new cc.Sprite("#slothero_bonus_complete_panel.png");
            rewardPanel.setPosition(this.width / 2, this.height / 2 + 50);
            this.addChild(rewardPanel);

            var totalBonusLabel = new cc.LabelBMFont("0", cc.SlotHeroRes.font.Bonus_Result);
            totalBonusLabel.setScale(0.9);
            totalBonusLabel.setPosition(rewardPanel.x, rewardPanel.y - 52);
            var baseReward = Math.floor(reward / multiplier);
            totalBonusLabel.setString(cc.GlobalSlotHero.FormatGold(baseReward) + " X" + multiplier + " \n\t= " + cc.GlobalSlotHero.FormatGold(reward));
            this.addChild(totalBonusLabel);

            var exitBtn = new ccui.Button("slotwomenagent_bonus_btn_thoat.png", "slotwomenagent_bonus_btn_thoat.png", "", ccui.Widget.PLIST_TEXTURE);
            exitBtn.setPosition(this.width / 2, this.height / 2 - 210);
            this.addChild(exitBtn);

            // var thoat = new cc.Sprite("#slotwomenagent_bonus_txt_thoat.png");
            // thoat.setPosition(exitBtn.getPosition());
            // this.addChild(thoat,1);

            this._exitCallback = exitCallback;
            var thiz = this;
            exitBtn.addClickEventListener(function () {
                thiz.hide();
            });
            this.setTitle("");
            this.runAction(new cc.Sequence(new cc.DelayTime(3),new cc.CallFunc(function () {
                thiz.hide();
            })));
        },

        onEnter: function () {
            cc.Node.prototype.onEnter.call(this);
        },

        initBackground: function () {

        },

        initButton: function () {

        },

        hide: function () {
            this._super();
            if (typeof (this._exitCallback) === "function") {
                this._exitCallback();
            }
        }
    });
})();
