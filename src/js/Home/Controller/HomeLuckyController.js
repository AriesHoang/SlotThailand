var HomeLuckyController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);
        SmartfoxClient.getInstance().addExtensionListener("221", this._onGetItems, this);
        SmartfoxClient.getInstance().addExtensionListener("223", this._onGetTimeBonus, this);
        SmartfoxClient.getInstance().addExtensionListener("226", this._onGetHelpData, this);
        SmartfoxClient.getInstance().addExtensionListener("222", this._onGetResultLucky, this);
        SmartfoxClient.getInstance().addExtensionListener("___err___", this._onGetFailResult, this);
    },
    _onGetFailResult:function () {
        this._view.showPopupFailResult();
    },
    _onGetItems: function (cmd, data) {
        var itemsLeft = data["p"]["1"]["1"];
        var itemsRight = data["p"]["2"]["1"];
        var resLeft = [];
        var resRight = [];

        var parseFucntion = function (source, dest) {
            for (var i = 0; i < source.length; ++i) {
                var entry = {};
                entry.amount = source[i]["1"];
                entry.rewardType = source[i]["2"];
                entry.gameName = source[i]["3"];

                dest.push(entry);
            }
        };

        parseFucntion(itemsLeft, resLeft);
        parseFucntion(itemsRight, resRight);

        this._view.initItemsLeft(resLeft);
        this._view.initItemRight(resRight);
    },
    _onGetResultLucky: function (cmd, data) {
        var result = data["p"]["1"];
        var indexLeft = result["0"];
        var indexRight = result["1"];
        this._view.showResult(indexLeft, indexRight);
    },
    _onGetTimeBonus: function (cmd, data) {
        var numBonus = data["p"]["1"];
        var timeCount = data["p"]["2"];
        this._view.showBonus(numBonus, timeCount);
    },
    _onGetHelpData: function (cmd, data) {
        var helpData = data["p"]["1"];
        this._view.setHelp(helpData);
    },
    sendGetItemRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("221", {});
    },
    sendGetTimeBonusRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("223", {});
    },
    sendGetResultLuckyRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("222", {});
    }
});
