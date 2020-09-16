var HomeController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);
        SmartfoxClient.getInstance().addExtensionListener("40", this._onGetUserInfo, this);
        SmartfoxClient.getInstance().addExtensionListener("41", this._onGetUserCoin, this);
        SmartfoxClient.getInstance().addExtensionListener("220", this._onGetUnreadMail, this);
        SmartfoxClient.getInstance().addExtensionListener("231", this._onUpdateBroadcastMessage, this);
        SmartfoxClient.getInstance().addExtensionListener("160", this._onEventItems, this);
        SmartfoxClient.getInstance().addExtensionListener("2108", this._onResetPassRespone, this);
        SmartfoxClient.getInstance().addExtensionListener("2101", this._onInAppPurchase, this);

    },
    _onEventItems: function (cmd, data) {
        var res = data["p"]["1"];
        var items = [];
        for (var i = 0; i < res.length; ++i) {
            var entry = {};
            entry.id = res[i]["0"];
            entry.name = res[i]["1"];
            entry.bannerUrl = res[i]["2"];
            entry.startTime = res[i]["3"];
            entry.endTime = res[i]["4"];
            entry.description = res[i]["5"];
            entry.eventUrl = res[i]["6"];
            entry.actionId = res[i]["7"];
            items.push(entry);
        }
        cc.log("Count Events " + JSON.stringify(res));
        this._view.initEventItems(items);
    },
    _onGetUserInfo: function (cmd, data) {
        // cc.log("_onGetUserInfo: " + data);
        data = data["p"];
        var res = {};
        res.userId = data["1"];
        res.username = data["2"];
        res.userFullname = data["3"];
        res.userAvatar = data["4"];
        res.token = data["6"];

        // cc.log("_onGetUserInfo: " + JSON.stringify(res));
        this._view.updateUserInfo(res);
    },
    _onGetUserCoin: function (cmd, data) {
        this._view.updateUserCoin(data["p"]["1"]);
        // cc.log("_onGetUserCoin: " + JSON.stringify(data));
    },
    _onGetUnreadMail: function (cmd, data) {
        this._view.updateUnreadMailNotification(data["p"]["1"]);
    },
    _onUpdateBroadcastMessage: function (cmd, data) {
        data = data["p"]["1"];
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var entry = {
                message: data[i]["1"]
            };
            res.push(entry);
        }
        this._view.updateBroadCastMessage(res);
    },
    _onResetPassRespone: function (cmd, data) {
        data = data["p"];
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];

        this._view.onResetPassRespone(res);
    },
    _onInAppPurchase: function (cmd, data) {
        // cc.log("_onInAppPurchase: " + JSON.stringify(data));
        data = data["p"];
        var res = {};
        res.errorCode = data["1"];
        if (res.errorCode !== 0)
            res.errorMessage = data["2"];
        res.money = data["3"];
        this._view.onInAppPurchase(res);
    }
});
