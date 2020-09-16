var SlotMaya = SlotMaya || {};

(function () {
    var HistoryController = SlotMaya.HistoryController;
    var SlotClient = SlotMaya.SlotClient;

    SlotMaya.RankingController = HistoryController.extend({
        ctor: function () {
            this._super.apply(this, arguments);
            SlotClient.getInstance().addExtensionListener("10", this.onDataReceived, this);
            this.sendRequestData(0);
        },

        sendRequestData: function (page) {
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("10", {1: page * 10, 2: 10});
        },

        onDataReceived: function (cmd, data) {
            data = data["p"];
            cc.log(data);
            var allItems = data["1"];
            var result = [];
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                var entry = {};
                entry["session"] = item["0"];
                entry["username"] = item["1"];
                entry["betLevel"] = item["2"];
                entry["totalBet"] = item["3"];
                entry["totalReward"] = item["4"];
                entry["totalJackpot"] = item["5"];
                entry["time"] = item["6"].replace(" ", "\n");
                result.push(entry);
            }

            this._view.showResult(result);
        }
    });
})();
