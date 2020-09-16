var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    var Dialog = SlotThreeKingdom.Dialog;

    SlotThreeKingdom.CompleteBonusDialog = Dialog.extend({
        ctor: function (reward, multiplier, exitCallback, width, height) {
            width = width || cc.winSize.width;
            height = height || cc.winSize.height;
            this._super.call(this, width, height);

            var rewardPanel = new cc.Sprite("#slotthreekingdom_bonus_frame.png");
            rewardPanel.setPosition(this.width / 2, this.height / 2 + 50);
            this.addChild(rewardPanel);

            var congratulationTitle = new cc.Sprite("#slotthreekingdom_congratulation_title.png");
            congratulationTitle.setPosition(this.width / 2, this.height / 2 + 300);
            this.addChild(congratulationTitle);

            var yougotTitle = new cc.Sprite("#slotthreekingdom_yougot.png");
            yougotTitle.setPosition(this.width / 2, this.height / 2 + 220);
            this.addChild(yougotTitle);

            var totalBonusLabel = new cc.LabelBMFont("0", cc.SlotThreeKingdomRes.font.Bonus_Result);
            totalBonusLabel.setScale(0.9);
            totalBonusLabel.setPosition(rewardPanel.x, rewardPanel.y - 52);
            var baseReward = Math.floor(reward / multiplier);
            totalBonusLabel.setString(cc.GlobalSlotThreeKingdom.FormatGold(baseReward) + " X" + multiplier + " \n\t= " + cc.GlobalSlotThreeKingdom.FormatGold(reward));
            this.addChild(totalBonusLabel);

            var exitBtn = new ccui.Button("slothreekingdom_bonus_button_thoat.png", "slothreekingdom_bonus_button_thoat.png", "", ccui.Widget.PLIST_TEXTURE);
            exitBtn.setPosition(this.width / 2, this.height / 2 - 210);
            this.addChild(exitBtn);

            // var thoat = new cc.Sprite("#SlotThreeKingdom_bonus_txt_thoat.png");
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
