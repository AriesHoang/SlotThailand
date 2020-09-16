var SlotAladdin = SlotAladdin || {};

(function () {
    SlotAladdin.BaseController = cc.Class.extend({
        ctor: function (view) {
            this.initWithView(view)
        },

        initWithView: function (view) {
            this._view = view;
        },

        releaseController: function () {
            this._view = null;
            SlotAladdin.SlotClient.getInstance().removeListener(this);
        }
    });
})();
