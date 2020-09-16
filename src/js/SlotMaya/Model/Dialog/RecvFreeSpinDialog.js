var SlotMaya = SlotMaya || {};
(function () {
    var Dialog = SlotMaya.Dialog;

    SlotMaya.RecvFreeSpinDialog = Dialog.extend({
        ctor: function (amount, cap1, cap2, width, height) {
            amount = isNaN(amount) ? 1 : amount;
            amount += "";
            this._super.call(this, width, height);

            var label1 = new cc.LabelBMFont(cap1 ? cap1 : "YOU'VE RECEIVED", cc.SlotMayaRes.font.Roboto_Bold_White);
            label1.setPosition(837, 570);
            label1.setScale(1.5);
            this.addChild(label1);

            var label2 = new cc.LabelBMFont(cap2 ? cap2 : "FREE SPIN", cc.SlotMayaRes.font.Roboto_Bold_White);
            label2.setPosition(835, 178);
            label2.setScale(1.5);
            this.addChild(label2);

            var bg = new ccui.Scale9Sprite("slotkhaihoi_dialog-content-border.png", cc.rect(30, 30, 2, 2));
            bg.setPreferredSize(cc.size(717, 191));
            bg.setPosition(842, 355);
            this.addChild(bg);

            var freeAmountLabel = new cc.LabelBMFont(amount, cc.SlotMayaRes.font.Roboto_Bold_White);
            freeAmountLabel.setPosition(843, 361);
            this.addChild(freeAmountLabel);

            this.setTitle("Lỗi");
        }
    });
})();
