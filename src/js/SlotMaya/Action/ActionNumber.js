var cc = cc || {};

cc.ActionNumber = cc.ActionInterval.extend({
    _targetValue: null,
    _startValue: 0,
    _trailingStr: "",

    ctor: function (targetValue, startValue, trailingStr) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._startValue = startValue;
        this._targetValue = targetValue;
        this._trailingStr = trailingStr || "";
        this.initWithDuration(1);
    },

    update: function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target) {
            var value = Math.floor((this._targetValue - this._startValue) * dt + this._startValue);
            if (this.target.setString) {
                this.target.setString(cc.GlobalSlotKhaiHoi.FormatGold(value) + this._trailingStr);
            }
        }
    }
});