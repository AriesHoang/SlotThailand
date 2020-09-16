if (cc.sys.isNative){
    cc.ActionNumber.prototype._ctor = function (targetValue, startValue, trailingStr) {
        this.init(targetValue, startValue, trailingStr);
    };
}