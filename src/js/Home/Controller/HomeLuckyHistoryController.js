var HomeLuckyHistoryController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);
        SmartfoxClient.getInstance().addExtensionListener("225", this._onGetHistoryItems, this);
    },
    _onGetHistoryItems: function (cmd, data) {
        var res = data["p"]["1"];
        var items = [];
        for (var i = 0; i < res.length; ++i) {
            var entry = {};
            entry.session = res[i]["0"];
            entry.leftResult = res[i]["1"];
            entry.rightResult = res[i]["2"];
            entry.time = res[i]["3"];
            entry.description = res[i]["4"];

            items.push(entry);
        }

        this._view.initItems(items);
    },
    sendGetHistoryItemRequest: function (skip, quantity) {
        skip = skip || 0;
        quantity = quantity || 10;
        var sendObj = {
            1: skip,
            2: quantity
        };
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("225", sendObj);
    }
});