var SlotWomenAgent = SlotWomenAgent || {};

(function () {
    var BaseController = SlotWomenAgent.BaseController;

    SlotWomenAgent.X2Controller = BaseController.extend({
        ctor: function () {
            this._super.apply(this, arguments);

            SlotWomenAgent.SlotClient.getInstance().addExtensionListener("46", this._onLoseDoubleGame, this);
            SlotWomenAgent.SlotClient.getInstance().addExtensionListener("47", this._onFinalResult, this);
            SlotWomenAgent.SlotClient.getInstance().addExtensionListener("48", this._onWinDoubleGame, this);
        },

        _onLoseDoubleGame: function (cmd, data) {
            this._view.showLostGame();
        },

        _onWinDoubleGame: function (cmd, data) {
            this._view.showWinGame(data["p"]["1"],data["p"]["3"]);
        },

        _onFinalResult: function (cmd, data) {

        },

        sendDoubleRequest: function (isContinue, slotNumber) {
            SlotWomenAgent.SlotClient.getInstance().sendExtensionRequestCurrentRoom("45", {1: !isContinue, 2: slotNumber});
        }
    });
})();
