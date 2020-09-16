var SlotMaya = SlotMaya || {};

(function () {
    var SlotClient = SlotMaya.SlotClient;

    SlotMaya.BaseController = cc.Class.extend({
        ctor: function (view) {
            this.initWithView(view)
        },

        initWithView: function (view) {
            this._view = view;
        },

        releaseController: function () {
            this._view = null;
            SlotClient.getInstance().removeListener(this);
        }
    });
})();
