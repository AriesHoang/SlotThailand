var SlotMaya = SlotMaya || {};

(function () {
    SlotMaya.FreeSpinNode = cc.Node.extend({
        ctor: function () {
            this._super();

            var bar = new cc.Sprite("#slotmaya_free_spin_bar.png");
            this.addChild(bar);

            var label = new cc.LabelBMFont("REMAINED FREESPIN ", cc.SlotMayaRes.font.UVN_ThangVu);
            label.setPosition(-24, 15);
            this.addChild(label);

            var countLabel = new cc.LabelBMFont("000", cc.SlotMayaRes.font.UVN_ThangVu);
            countLabel.setPosition(160, 15);
            this.addChild(countLabel);

            this.countLabel = countLabel;
        },

        setCount: function (value) {
            if (value < 0)
                value = 0;
            value = value + "";
            var initialLength = value.length;
            for (var i = 0; i < 3 - initialLength; i++)
                value = "0" + value;

            this.countLabel.setString(value);
        }
    });
})();
