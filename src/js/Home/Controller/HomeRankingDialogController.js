var HomeRankingDialogController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);

        SmartfoxClient.getInstance().addExtensionListener("180", this._onRankingInfo, this);
    },

    _onRankingInfo: function (cmd, data) {
        var res = [];
        data = data["p"]["1"];

        for (var i = 0; i < data.length; i++) {
            var entry = {
                username: data[i]["1"],
                coin: data[i]["5"]
            };
            res.push(entry);
        }

        this._view.initItems(res);
    },

    sendRankingInfoRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("180", null);
    }
});