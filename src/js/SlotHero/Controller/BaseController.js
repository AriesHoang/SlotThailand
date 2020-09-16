var SlotHero = SlotHero || {};

(function () {
    SlotHero.BaseController = cc.Class.extend({
        ctor: function (view) {
            this.initWithView(view)
        },

        initWithView: function (view) {
            this._view = view;
        },

        releaseController: function () {
            this._view = null;
            SlotHero.SlotClient.getInstance().removeListener(this);
        }
    });
})();
