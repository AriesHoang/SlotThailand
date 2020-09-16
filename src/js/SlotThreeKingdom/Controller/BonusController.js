var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    var BaseController = SlotThreeKingdom.BaseController;

    SlotThreeKingdom.BonusController = BaseController.extend({
        ctor: function (view, betId, isSandbox) {
            this._super.apply(this, arguments);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("17", this._onJoinBonusGame, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("27", this._onJoinBonusGame, this);
            this.sendJoinRoomRequest(betId, isSandbox);
        },

        _onJoinBonusGame: function (cmd, data) {
            cc.log(JSON.stringify(data));
            data = data["p"];
            var result = {};
            result.resultMultiplier = data["1"];
            result.totalWin = data["2"];
            result.bonuses = data["ct1"];
            result.cooldown = Math.floor(data["4"] / 1000);
            result.multiplers = data["ct2"];
            this._view.setupBonusGame(result);
        },

        sendJoinRoomRequest: function (betId, isSandbox) {
            var cmd = isSandbox ? "27" : "17";
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom(cmd, {1: betId});
        },

        sendEndgameRequest: function (isSandbox) {
            var cmd = isSandbox ? "28" : "18";
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom(cmd, null);
        }
    });
})();
