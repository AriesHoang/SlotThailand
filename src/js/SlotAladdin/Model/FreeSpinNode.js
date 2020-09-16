var SlotAladdin = SlotAladdin || {};

(function () {
    SlotAladdin.FreeSpinNode = cc.Node.extend({
        ctor: function () {
            this._super();

            var bar = new ccui.Scale9Sprite("slotaladdin_free_spin_bar.png");
            bar.setPreferredSize(cc.size(500, 100));
            this.addChild(bar);

            // var label = new cc.Sprite("#slotaladdin_free_spin_bar.png");
            var label = new cc.LabelBMFont("REMAIN FREESPIN ", cc.SlotAladdinRes.font.PopupFont);
            label.setPosition(-35,5);
            this.addChild(label);

            var countLabel = new cc.LabelBMFont("", cc.SlotAladdinRes.font.PopupFont);
            countLabel.setScale(1.15);
            countLabel.setPosition(100, 5);
            this.addChild(countLabel);

            this.countLabel = countLabel;
        },

        setCount: function (value) {
            value = value + "";
            var initialLength = value.length;
            for (var i = 0; i < 3 - initialLength; i++)
                value = "" + value;

            this.countLabel.setString(value);
        }
    });
})();
