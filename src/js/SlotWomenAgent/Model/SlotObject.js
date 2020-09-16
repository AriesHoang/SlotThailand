var SlotWomenAgent = SlotWomenAgent || {};
(function () {
    var AllSlotObject = AllSlotObject || [
        "SymG",
        "Jackpot",
        "Wild",
        "Bonus",
        "Scatter",
        "SymA",
        "SymB",
        "SymC",
        "SymD",
        "SymE",
        "SymF"
    ];

    /**
     * @property value Slot value
     */
    var SlotObject = cc.Sprite.extend({
        ctor: function (value) {
            if (isNaN(value))
                this._super.apply(this, arguments);
            else
                this._super("#slotwomenagent_Sym_" + AllSlotObject[value % AllSlotObject.length] + ".png");

            //var label = new cc.LabelBMFont(value, cc.SlotWomenAgentRes.font.Arial_Stroke_Number_100);
            //label.setPosition(this.width / 2, this.height / 2);
            this.setValue(value || 0);
            ///this.addChild(this.label);
        },

        getValue: function () {
            return this._value;
        },

        setValue: function (v) {
            if (isNaN(v)) return;
            v = v % AllSlotObject.length;
            if (!AllSlotObject[v]) return;
            this._value = v;
            this.setSpriteFrame("slotwomenagent_Sym_" + AllSlotObject[this._value] + ".png");
            //this.label.setString(v);
        },

        getType: function () {

        },

        setType: function () {

        }
    });

//export getter/setter
    (function () {
        var proto = SlotObject.prototype;
        cc.defineGetterSetter(proto, "value", proto.getValue, proto.setValue);
    })();

    SlotWomenAgent.AllSlotObject = AllSlotObject;
    SlotWomenAgent.SlotObject = SlotObject;
})();
