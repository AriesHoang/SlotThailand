var SlotAladdin = SlotAladdin || {};

(function () {
    var Dialog = SlotAladdin.Dialog;

    SlotAladdin.ErrorDialog = Dialog.extend({
        ctor: function (msg, width, height) {
            this._super.call(this, width, height);

            // var label2 = new cc.LabelBMFont(msg, cc.SlotAladdinRes.font.Bay_Buom_Text_Stroke);
            var label2 = new cc.LabelTTF(msg, cc.SlotAladdinRes.font.UVNThangVu, 60);
            label2.setColor(cc.color("#ffffff"));
            label2.enableStroke(cc.color("#000000"), 2);
            label2.setPosition(610, 361);
            // label2.setScale(1.5);
            this.addChild(label2);
            this.setTitle("NOTICE");
        }
    });
})();
