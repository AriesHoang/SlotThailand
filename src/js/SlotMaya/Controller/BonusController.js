var SlotMaya = SlotMaya || {};

(function () {
    var BaseController = SlotMaya.BaseController;
    var SlotClient = SlotMaya.SlotClient;

    SlotMaya.BonusController = BaseController.extend({
        ctor: function (view, betId, isSandbox) {
            this._super.apply(this, arguments);
            SlotClient.getInstance().addExtensionListener("17", this._onJoinBonusGame, this);
            SlotClient.getInstance().addExtensionListener("27", this._onJoinBonusGame, this);
            this.sendJoinRoomRequest(betId, isSandbox);
        },

        _onJoinBonusGame: function (cmd, data) {
            data = data["p"];
            var result = {};
            result.initialMultiplier = data["1"];
            result.totalWin = data["2"];
            result.bonuses = [];
            result.cooldown = Math.floor(data["4"] / 1000);
            result.totalAmount = 0;
            result.totalMultiplier = result.initialMultiplier;
            var itemArray = data["3"];
            for (var i = 0; i < itemArray.length; i++) {
                var entry = {};
                entry.multiplier = itemArray[i]["1"];
                entry.gold = itemArray[i]["2"];
                var type = itemArray[i]["3"];
                entry.bonusResult = itemArray[i]["4"];


                // if (entry.gold > 0 && entry.bonusResult.length === 0) {
                //     entry.type = "gold";
                //     result.totalAmount += entry.gold;
                // }
                // else if (entry.multiplier !== 1) {
                //     entry.type = "multiply";
                //     result.totalMultiplier += entry.multiplier;
                // }
                // else {
                //     entry.type = "bonus";
                //     result.totalAmount += entry.gold;
                // }
                if (type === 1) {
                    entry.type = "gold";
                    result.totalAmount += entry.gold;
                } else if (type === 2) {
                    entry.type = "bonus";
                    result.totalAmount += entry.gold;
                }
                else if (type === 3) {
                    entry.type = "multiply";
                    result.totalMultiplier += entry.multiplier;
                }

                result.bonuses.push(entry);
            }
            this._view.setupBonusGame(result);
        },

        sendJoinRoomRequest: function (betId, isSandbox) {
            var cmd = isSandbox ? "27" : "17";
            SlotClient.getInstance().sendExtensionRequestCurrentRoom(cmd, {1: betId});
        },

        sendEndgameRequest: function (isSandbox) {
            var cmd = isSandbox ? "28" : "18";
            SlotClient.getInstance().sendExtensionRequestCurrentRoom(cmd, null);
        }
    });
})();
