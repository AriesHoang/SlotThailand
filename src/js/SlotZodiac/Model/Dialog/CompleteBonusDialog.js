var SlotZodiac = SlotZodiac || {};

(function () {
    var Dialog = SlotZodiac.Dialog;

    SlotZodiac.CompleteBonusDialog = Dialog.extend({
        ctor: function (reward, multiplier, exitCallback, width, height) {
            width = width || 1408;
            height = height || 899;
            this._super.call(this, width, height);

            var bg_result = new cc.Sprite("#slotmaya_bonus_bg_result.png");
            // bg_result.setPreferredSize(cc.size(928, 1152));
            bg_result.setPosition(this.width / 2, this.height / 2);
            // bg_result.setPosition(674, 563);
            this.addChild(bg_result);

            var str = "";
            str += cc.GlobalSlotZodiac.FormatGold(reward);
            str += (" X" + multiplier);
            str += " = ";
            str += cc.GlobalSlotZodiac.FormatGold(reward * multiplier);

            var totalBonusLabel = new cc.LabelTTF(str, "Arial", 70);
            totalBonusLabel.setColor(cc.color("#e6f8ff"));
            totalBonusLabel.enableStroke(cc.color("#2f0150"), 4);
            totalBonusLabel.setPosition(this.width / 2, 421);
            this.addChild(totalBonusLabel);

            var exitBtn = new ccui.Button("slotmaya_bonus_button_thoat.png", "", "", ccui.Widget.PLIST_TEXTURE);
            exitBtn.setZoomScale(0);
            exitBtn.setPosition(this.width / 2, 120);
            this.addChild(exitBtn);


            this._exitCallback = exitCallback;
            var thiz = this;
            exitBtn.addClickEventListener(function () {
                thiz.hide();
            });
        },

        initBackground: function () {

        },

        initButton: function () {

        },
        onEnter: function () {
            cc.Node.prototype.onEnter.call(this);
            var thiz = this;

            var delay = new cc.DelayTime(3);
            var hideFunc = new cc.CallFunc(function () {
                thiz.hide();
            });
            this.runAction(new cc.Sequence(delay, hideFunc));
        },

        hide: function () {
            this._super();
            //this.stopAllActions();
            // console.log("HIDE");
            if (typeof (this._exitCallback) === "function") {
                this._exitCallback();
            }
        }
    });
})();
