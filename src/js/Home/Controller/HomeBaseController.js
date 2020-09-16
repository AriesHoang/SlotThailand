var HomeBaseController = cc.Class.extend({
    ctor: function (view) {
        this._view = view;
    },

    release: function () {
        SmartfoxClient.getInstance().removeListener(this);
    }
});