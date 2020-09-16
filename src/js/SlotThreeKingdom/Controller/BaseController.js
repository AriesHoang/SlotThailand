var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    SlotThreeKingdom.BaseController = cc.Class.extend({
        ctor: function (view) {
            this.initWithView(view)
        },

        initWithView: function (view) {
            this._view = view;
        },

        releaseController: function () {
            this._view = null;
            SlotThreeKingdom.SlotClient.getInstance().removeListener(this);
        }
    });
})();
