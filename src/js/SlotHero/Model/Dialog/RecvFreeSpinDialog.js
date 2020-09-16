
var SlotHero = SlotHero || {};

(function () {
    var Dialog = SlotHero.Dialog;

    SlotHero.RecvFreeSpinDialog = Dialog.extend({
        ctor: function (amount, cap1, cap2, width, height) {
            amount = isNaN(amount) ? 1 : amount;
            amount += "";
            this._super.call(this, width, height);

            // var label1 = new cc.LabelBMFont(cap1 ? cap1 : "BẠN VỪA NHẬN ĐƯỢC", cc.SlotHeroRes.font.Bay_Buom_Text_Stroke);
            var label1 = new cc.LabelTTF(cap1 ? cap1 : "YOU'VE GOT", "Arial", 45);
            label1.setPosition(610, 570);
            label1.setScale(1.5);
            this.addChild(label1);

            // var label2 = new cc.LabelBMFont(cap2 ? cap2 : "LƯỢT QUAY MIỄN PHÍ", cc.SlotHeroRes.font.Bay_Buom_Text_Stroke);
            var label2 = new cc.LabelTTF(cap2 ? cap2 : "FREESPIN", "Arial", 45);
            label2.setPosition(610, 178);
            label2.setScale(1.5);
            this.addChild(label2);

            // var freeAmountLabel = new cc.LabelBMFont(amount, cc.SlotHeroRes.font.Bay_Buom_Stroke_White);
            var freeAmountLabel = new cc.LabelTTF(amount, "Arial", 40);
            freeAmountLabel.setPosition(610, 361);
            this.addChild(freeAmountLabel);

            this.setTitle("");
        },
    });
})();
