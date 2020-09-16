
var SlotZodiac = SlotZodiac || {};

(function () {
    var AllSlotObject = AllSlotObject || [
        "SymA",
        "Jackpot",
        "Bonus",
        "Scatter",
        "SymB",
        "SymC",
        "SymD"
    ];

    var SlotObject = cc.Sprite.extend({
        ctor: function (value, type) {
            type = type || 1;
            if (isNaN(value))
                this._super.apply(this, arguments);
            else
                this._super("#slotzodiac_" + AllSlotObject[value % 7] + ".png");

            this._type = type;
            this.setValue(value || 0);
        },

        getValue: function () {
            return this._value;
        },

        setValue: function (v) {
            if (isNaN(v)) return;
            v = v % 7;
            if (!AllSlotObject[v]) return;
            this._value = v;
            this.setSpriteFrame("slotzodiac_" + AllSlotObject[this._value] + ".png");
            //this.label.setString(v);
        },

        getType: function () {
            return this._type;
        },

        setType: function (type) {
            if (isNaN(type)) return;
            if ([1, 2, 3].indexOf(type) === -1)
                return;

            this._type = type;
            this.setSpriteFrame("slotzodiac_" + AllSlotObject[this._value] + ".png");
        }
    });

    //export getter/setter
    (function () {
        var proto = SlotObject.prototype;
        cc.defineGetterSetter(proto, "value", proto.getValue, proto.setValue);
    })();

    SlotZodiac.AllSlotObject = AllSlotObject;
    SlotZodiac.SlotObject = SlotObject;
})();
