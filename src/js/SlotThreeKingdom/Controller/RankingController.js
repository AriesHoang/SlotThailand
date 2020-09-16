var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    var HistoryController = SlotThreeKingdom.HistoryController;
    var BaseController = SlotThreeKingdom.BaseController;

    SlotThreeKingdom.RankingController = HistoryController.extend({
        ctor: function () {
            BaseController.prototype.ctor.apply(this, arguments);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("10", this.onDataReceived, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("22", this.onDetailReceived, this);
            // this.sendRequestData(0);
        },

        sendRequestData: function (page, filter) {
            filter = filter || 0;
            var sendObj = {
                1: page * 10,
                2: 10,
                3: filter
            }
            // cc.log("sendRequestData: " + JSON.stringify(sendObj));
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom("10", sendObj);
        },

        onDataReceived: function (cmd, data) {
            // cc.log("onDataReceived: " + JSON.stringify(data));
            data = data["p"];
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
