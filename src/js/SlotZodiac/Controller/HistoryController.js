var SlotZodiac = SlotZodiac || {};

(function () {
    var BaseController = SlotZodiac.BaseController;
    var SlotClient = SlotZodiac.SlotClient;

    SlotZodiac.HistoryController = BaseController.extend({
        ctor: function () {
            this._super.apply(this, arguments);
            SlotClient.getInstance().addExtensionListener("60", this.onDataReceived, this);
            SlotClient.getInstance().addExtensionListener("22", this.onDetailReceived, this);
            //SlotClient.getInstance().addExtensionListener("10", this.onDataReceived, this);
            this.sendRequestData(0);
        },

        sendRequestData: function (page) {
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("60", {1: page * 10, 2: 10});
        },

        sendRequestDetail: function (session) {
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("22", {1: session});
        },

        onDataReceived: function (cmd, data) {
            data = data["p"];
            var allItems = data["1"];
            var result = [];
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                var entry = {};
                var rewards = item["2"];

                entry["session"] = item["0"];
                entry["time"] = item["1"].replace(" ", "\n");
                entry["betCount"] = item["5"].length;
                entry["betLevel"] = item["3"];
                entry["rewardLine"] = item["6"].length || 0;

                var totalReward = item["9"];
                entry["reward"] = totalReward || 0;
                result.push(entry);
            }

            this._view.showResult(result);
        },

        onDetailReceived: function (cmd, data) {
            data = data["p"];
            var allItems = data["1"];
            var result = [];
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                result.push({
                    line: item["1"],
                    reward: item["2"]
                });
            }

            this._view.showDetail(result);
        }
    });
})();
