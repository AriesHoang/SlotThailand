var SlotWomenAgent = SlotWomenAgent || {};

(function () {
    SlotWomenAgent.BaseController = cc.Class.extend({
        ctor: function (view) {
            this.initWithView(view)
        },

        initWithView: function (view) {
            this._view = view;
        },

        releaseController: function () {
            this._view = null;
            SlotWomenAgent.SlotClient.getInstance().removeListener(this);
        }
    });
})();
