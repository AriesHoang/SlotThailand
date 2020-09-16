var SlotZodiac = SlotZodiac || {};

(function () {
    var SlotClient = SlotZodiac.SlotClient;

    SlotZodiac.BaseController = cc.Class.extend({
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
