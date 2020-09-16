var HomeHistoryController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);

        SmartfoxClient.getInstance().addExtensionListener("2115", this._onGetHistoryRespone, this);
    },
    _onGetHistoryRespone: function (cmd, data) {
        var data = data["p"];
        cc.log("_onGetHistoryRespone: " + JSON.stringify(data));
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];
        res.page = data["3"];
        res.pageCount = data["4"];
        res.transactionList = data["5"];
        if (res.errorCode !== 0)
            this._view._onGetResponeError(res.errorMessage);
        else
            this._view._onGetResponseSuccess(res.page, res.pageCount, res.transactionList);
    },
    sendGetHistory: function (skip, quantity, type) {
        skip = skip || 0;
        quantity = quantity || 10;
        type = type || "play";
        var sendObj = {
            1: skip,
            2: quantity,
            3: type
        };
        cc.log("sendGetItemRequest: " + JSON.stringify(sendObj));
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2115", sendObj);
    }
});
